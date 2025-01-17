# Push Notification Technical Specifications

## Problem

Users should be alerted when they are at risk of losing their streak.

## Solution

Send strategic push notifications to let users know about the status of their streak.

## Scope

Only the broad tools, technologies and high level functions will be explained.

## Requirements

The implementing developer should have skills and knowledge in:

- [ ] GCP
- [ ] NodeJS
- [ ] Typescript (optional, but recommended)

Sufficient access to the following GCP tools:

- [ ] Firebase Firestore
- [ ] Cloud Functions
- [ ] Firebase Cloud Messaging (**FCM**)
- [ ] Cloud Tasks
- [ ] GCP Identity (for security)

## Constraints

Except for FCM, GCP tools has cost for most processes. The decision to such tools is to make efficient use of cost to product ratio.

The most simple technical approach is to create a daily or multiple times a day cron job that checks for user streaks and determine if they are at risk of losing the streak then send a push notification. But firebase charges per document read, so the cost exponentially rises the more users there are even if they are not active.

## Cost Benefit

- Cloud Functions - charges on a per CPU-second, so longer process cost - more
- Firestore - charges per 100K for each write, read & delete
- Cloud Tasks - charges per 1M

With this, the solution proposed here is to maximize use of Cloud Tasks while minimizing use of Cloud Function and Firestore.

## Strategy

`User streak change` -> `Cloud function trigger (Analyze user streak)` -> `Schedule cloud task`

`Cloud task` -> `cloud function http endpoint (Analyze user streak)` -> `send push notification vis FCM`

Note: Each _Analyze user streak_ will require a small query to the user's recent streak which should be efficient.

## Interfaces

Below list interfaces that needs to created.

- [ ] Cloud Task queue `streakAlertQueue`
- [ ] Cloud Function trigger `onStreakCreated` when streak collection document gets created.
- [ ] Cloud Function trigger `onStreakUpdated` when streak collection document gets updated.
- [ ] Cloud Function `scheduleStreakAlert`
- [ ] Cloud Function HTTP endpoint `sendStreakAlert`

## Implementation

### `onStreakCreated`

New daily entry to the streak triggers this, so based on the user's current streak and risk threshold, schedule an alert using `scheduleStreakAlert`.

User streak is one of the following:

- **First or continuous streak** - schedule mid-day tomorrow,

- **Missed last 1 or 2 days** - schedule in a few hours and/or before the day ends

### `onStreakUpdated`

Updates to daily entries for additional activities, so based if user still has missing streak days, schedule another alert within the day or for tomorrow using `scheduleStreakAlert`.

### `scheduleStreakAlert`

Calling this creates tasks for the `streakAlertQueue` cloud task. The task should include details to call the `streakAlert` http endpoint. Include the userId in the payload.

**Security:** Secure the http request by attaching authorization token from a **GCP Identity** service account with invoker access.

### `sendStreakAlert`

Using userId check if the user's streak pattern is still relevant at this point in time.

User streak is one of the following:

1. **Continuous streak**

- if no activity yet for today, alert to continue streak
- if with activity, cancel alert

2. **Missed 1 day**

- if no activity yet, alert to catch up to missing streak
- if 1 activity, alert to do another activity to complete todays streak
- if 2+ activity, cancel alert

3. **Missed 2 days**

- if no activity yet, alert to catch up to missing streak
- if 1 or 2 activity, alert to do another activity to complete todays streak
- if 3+ activity, cancel alert

Sending the alert push notification should be using **FCM api**.

Suggest: Can check the time of day to compose relative message for alert.

**Security:** Secure the http endpoint by limiting invoker access with a **GCP Identity** service account. Without this the http endpoint will be invokable by anyone.
