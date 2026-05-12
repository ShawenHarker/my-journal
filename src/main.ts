import { router } from 'tina4js';
import './routes';

// Debug overlay in dev mode (Ctrl+Shift+D to toggle, tree-shaken from production builds)
// @ts-ignore
if (import.meta.env.MODE === 'development') import('tina4js/debug');

// Configure API (uncomment to connect to tina4-php/python backend)
// api.configure({ baseUrl: '/api', auth: true });

// Start router
router.start({ target: '#root', mode: 'hash' });
