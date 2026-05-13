import { html } from 'tina4js';
import Greetings from '../database/greetings.json'

type UserProps = {
  name: string;
  current_streak: number;
  seven_day_streak: number;
}

const getTimeOfDay = (hour: number): string => {
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

export const NewEntryHeader = ({user}: {user: UserProps}) => {
  const splitUserName = user.name.split(' ');
  const initials = splitUserName.map(name => name.charAt(0).toUpperCase()).join('');

  const date = new Date();
  const timeOfDay = getTimeOfDay(date.getHours());

  const filteredGreetings = Greetings.filter(g => g.time_of_day === timeOfDay);
  const randomGreeting = filteredGreetings[Math.floor(Math.random() * filteredGreetings.length)];
  const firstName = splitUserName[0];
  const greetingText = randomGreeting.greeting
      .replace('{user.name}', firstName)
      .replace('{name}', firstName);

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return html`
    <card class="d-flex py-2 justify-content-between">
      <section class="d-flex">
        <div class="d-flex align-items-center justify-content-center p-1 mt-1 primary-bg rounded-circle"
             style="width: 60px; height: 60px;">
          <h4 class="header-text">${initials}</h4>
        </div>
        <div class="d-flex flex-column ms-2 mt-2">
          <h6 class="header-text" style="margin-bottom: -1px;">${greetingText}</h6>
          <div class="d-flex text-secondary" style="font-size: 14px;">
            <p>${formattedDate}</p>
            <span class="mx-2">|</span>
            <p>
            <span class="fw-bold">
              Current Streak:
            </span>
              ${user.current_streak}
              <i class="bi bi-fire flame"></i>
            </p>
          </div>
        </div>
      </section>
      <section>
        <div class="d-flex">
          ${Array.from({ length: 7 }, (_, i) => html`
            <div class="${i === user.seven_day_streak - 1 ? 'secondary-bg' : 'dark-bg'}" 
                 style="width: 20px; height: 20px; margin-left: 4px; border-radius: 4px;"></div>
          `)}
        </div>
        <p class="text-end text-secondary" style="font-size: 14px;">7-day Streak</p>
      </section>
    </card>
  `;
};