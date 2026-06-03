// ===============================
// CONFIG
// ===============================

const SALT_LENGTH = 16;
const IV_LENGTH = 12;

// ===============================
// TYPES
// ===============================

export interface EncryptionSetup {
    encryptedDEK: string;
    dekSalt: string;
    recoveryKeyHash: string;
}

let sessionDEK: CryptoKey | null = null;

// ===============================
// UTILITIES
// ===============================

const toBase64 = (bytes: Uint8Array): string => {
    return btoa(String.fromCharCode(...bytes));
}

const fromBase64 = (base64: string): Uint8Array => {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

const sha256 = async (text: string): Promise<string> => {
    const hash = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(text)
    );
    return toBase64(new Uint8Array(hash));
}

// ===============================
// KEK (Password → Key)
// ===============================

const deriveKEK = async (
    password: string,
    salt: Uint8Array
): Promise<CryptoKey> => {

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
    );

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt as BufferSource,
            iterations: 310000,
            hash: 'SHA-256'
        },
        keyMaterial,
        {
            name: 'AES-GCM',
            length: 256
        },
        false,
        ['encrypt', 'decrypt']
    );
}

// ===============================
// DEK
// ===============================

const generateDEK = async (): Promise<CryptoKey> => {
    return crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256
        },
        true,
        ['encrypt', 'decrypt']
    );
}

// ===============================
// INIT USER ENCRYPTION (REGISTER)
// ===============================

export const createUserEncryption = async (
    password: string,
    recoveryKey: string
): Promise<EncryptionSetup> => {

    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
    const kek = await deriveKEK(password, salt);

    const dek = await generateDEK();
    const rawDEK = await crypto.subtle.exportKey('raw', dek);

    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    const encryptedDEK = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        kek,
        rawDEK
    );

    const combined = new Uint8Array(iv.length + encryptedDEK.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedDEK), iv.length);

    return {
        encryptedDEK: toBase64(combined),
        dekSalt: toBase64(salt),
        recoveryKeyHash: await sha256(recoveryKey)
    };
}

// ===============================
// UNLOCK SESSION DEK (LOGIN)
// ===============================

export const unlockSessionKey = async (
    password: string,
    encryptedDEK: string,
    dekSalt: string
): Promise<void> => {

    const salt = fromBase64(dekSalt);
    const kek = await deriveKEK(password, salt);

    const combined = fromBase64(encryptedDEK);

    const iv = combined.slice(0, IV_LENGTH);
    const data = combined.slice(IV_LENGTH);

    const rawDEK = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        kek,
        data
    );

    sessionDEK = await crypto.subtle.importKey(
        'raw',
        rawDEK,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
    );
}

// ==============================
// GET RECOVERY KEY
// ==============================

export const generateRecoveryKey = async () => {
    const unit8Array = crypto.getRandomValues(new Uint8Array(16));
    return toBase64(unit8Array);
}

// ===============================
// GET SESSION DEK
// ===============================

const getDEK = (): CryptoKey => {
    if (!sessionDEK) {
        throw new Error('Encryption key not unlocked');
    }
    return sessionDEK;
}

// ===============================
// ENCRYPT ENTRY
// ===============================

export const encryptText = async (text: string): Promise<string> => {

    const dek = getDEK();

    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        dek,
        new TextEncoder().encode(text)
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return toBase64(combined);
}

// ===============================
// DECRYPT ENTRY
// ===============================

export const decryptText = async (ciphertext: string): Promise<string> => {

    const dek = getDEK();

    const combined = fromBase64(ciphertext);

    const iv = combined.slice(0, IV_LENGTH);
    const data = combined.slice(IV_LENGTH);

    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        dek,
        data
    );

    return new TextDecoder().decode(decrypted);
}

// ===============================
// PASSWORD CHANGE (ROTATE KEK ONLY)
// ===============================

export const changePassword = async (
    oldPassword: string,
    newPassword: string,
    encryptedDEK: string,
    dekSalt: string
): Promise<EncryptionSetup> => {

    const salt = fromBase64(dekSalt);

    const oldKEK = await deriveKEK(oldPassword, salt);

    const combined = fromBase64(encryptedDEK);

    const iv = combined.slice(0, IV_LENGTH);
    const data = combined.slice(IV_LENGTH);

    const rawDEK = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        oldKEK,
        data
    );

    const newSalt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
    const newKEK = await deriveKEK(newPassword, newSalt);

    const newIV = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    const reEncrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: newIV },
        newKEK,
        rawDEK
    );

    const combinedNew = new Uint8Array(newIV.length + reEncrypted.byteLength);
    combinedNew.set(newIV);
    combinedNew.set(new Uint8Array(reEncrypted), newIV.length);

    return {
        encryptedDEK: toBase64(combinedNew),
        dekSalt: toBase64(newSalt),
        recoveryKeyHash: '' // unchanged in password change flow
    };
}

// ===============================
// RECOVERY CHECK
// ===============================

export const verifyRecoveryKey = async (
    recoveryKey: string,
    storedHash: string
): Promise<boolean> => {
    return (await sha256(recoveryKey)) === storedHash;
}

// ===============================
// CLEAR SESSION KEY (LOGOUT)
// ===============================

export const clearSessionKey = (): void => {
    sessionDEK = null;
}