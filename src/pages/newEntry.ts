import { html } from 'tina4js';
import { NewEntryHeader } from '../components/new-entry-header';
import Users from '../database/users.json';

export const NewEntry = () => {
  const user = Users[Math.floor(Math.random() * Users.length)];
  const { name, current_streak, seven_day_streak } = user;

  return html`
    ${NewEntryHeader({user: {name, current_streak, seven_day_streak}})}
  `;
}
