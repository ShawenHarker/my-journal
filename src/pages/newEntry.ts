import { html } from 'tina4js';
import '@/components/new-entry-tags';
import '@/components/new-entry-moods';
import '@/components/new-entry-header';
import Users from '../database/users.json';

export const NewEntry = () => {
  const user = Users[Math.floor(Math.random() * Users.length)];
  const { name, current_streak, seven_day_streak } = user;

  return html`
    <new-entry-header
        name=${name}
        current_streak=${current_streak}
        seven_day_streak=${seven_day_streak}>
    </new-entry-header>
    <div class="mt-3"></div>
    <new-entry-moods></new-entry-moods>
    <div class="mt-2"></div>
    <new-entry-tags></new-entry-tags>
  `;
}
