import { Tina4Element, html } from 'tina4js';
import Greetings from '../database/greetings.json';

const getTimeOfDay = (hour: number): string => {
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

export class NewEntryHeader extends Tina4Element {
  static props = {
    firstName: String,
    lastName: String,
    current_streak: Number,
    seven_day_streak: Number,
  };

  static shadow = false;

  render() {
    const firstName = this.prop('firstName').value as string;
    const lastName = this.prop('lastName').value as string;
    const currentStreak= this.prop('current_streak').value as number;
    const sevenDayStreak = this.prop('seven_day_streak').value as number;

    const date = new Date();
    const timeOfDay = getTimeOfDay(date.getHours());

    const filteredGreetings = Greetings.filter(g => g.time_of_day === timeOfDay);
    const randomGreeting = filteredGreetings[Math.floor(Math.random() * filteredGreetings.length)];
    const greetingText = randomGreeting.greeting
        .replace('{user.name}', firstName)
        .replace('{name}', firstName);

    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return html`
      <card class="d-flex py-2 justify-content-between">
        <section class="d-flex">
          <div class="d-flex align-items-center justify-content-center p-1 mt-1 primary-bg rounded-circle"
               style="width: 60px; height: 60px;">
            <h4 class="header-text">${firstName.charAt(0)}${lastName.charAt(0)}</h4>
          </div>
          <div class="d-flex flex-column ms-2 mt-2">
            <h6 class="header-text" style="margin-bottom: -1px;">${greetingText}</h6>
            <div class="d-flex text-secondary" style="font-size: 14px;">
              <p>${formattedDate}</p>
              <span class="mx-2">|</span>
              <p>
                <span class="fw-bold">Current Streak:</span>
                ${currentStreak}
                <i class="bi bi-fire flame"></i>
              </p>
            </div>
          </div>
        </section>
        <section>
          <div class="d-flex">
            ${Array.from({ length: 7 }, (_, i) => html`
              <div class="${i === sevenDayStreak - 1 ? 'secondary-bg' : 'dark-bg'}"
                   style="width: 20px; height: 20px; margin-left: 4px; border-radius: 4px;"></div>
            `)}
          </div>
          <p class="text-end text-secondary" style="font-size: 14px;">7-day Streak</p>
        </section>
      </card>
    `;
  }
}

customElements.define('new-entry-header', NewEntryHeader);