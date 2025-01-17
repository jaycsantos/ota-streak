# OTA Streaks

Project setup

    $ npm install

### Development

    $ npm run dev:api
    $ npm run dev:web

### Build

    $ npm run build

### Test

    $ npm run test
    $ npm run test:api
    $ npm run test:api:watch

## Implementation Notes

### API

- Prefixed with version number (/v1) - This makes it easier to maintain for major API changes in the future.
- Streaks JSON response has its days sorted from past to future/present.
- [`StreakService#getStreakWeek`](./packages/streak-api/src/streaks/streaks.service.ts#21) Assumes that the resulting activity days is always within 7 days from today.
- Days are assumed to be in the timezone of the server where the application is deployed. Timezone management is out of scope for this implementation.

### Web

- Figma design lacked specific notes on implementation details, particularly regarding the visual representation of checked and unchecked days. I relied on my best judgment for these aspects.
- Days are assumed to be in the server's timezone. If the client's timezone differs, synchronization issues may occur. Timezone management is outside the scope of this implementation.
- I added several more test cases (0-6) to cover a wider range of scenarios. Without these, the component would display an "Unavailable" message. Handling 404 errors is beyond the scope of this work.

## Push Notifications Technical Specificiation

[see here](./push_notif_tech_spec.md)
