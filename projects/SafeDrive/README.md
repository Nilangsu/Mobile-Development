# SafeDrive

SafeDrive is a mobile driving safety application built with Expo and React Native. The app monitors driving behavior using device sensors and provides a safety score based on driving performance. Users can track driving history, review trip summaries, manage profiles and gain insights into safer driving habits.

---

## Features

### User Authentication

- User registration and login
- Persistent login using local storage
- Secure logout functionality

### Driving Monitoring

- Real-time safety score calculation
- Harsh braking detection
- Harsh acceleration detection
- Aggressive steering detection
- Phone handling detection during driving

### Drive Tracking

- Start and end drive sessions
- Automatic drive event recording
- Duration tracking
- Safety score generation
- Performance rating generation

### Dashboard

- Overall driving overview
- Average safety score
- Best driving score
- Total drives completed
- Recent drive information
- Driving insights

### Drive History

- View previous driving sessions
- Access detailed drive summaries
- Review historical scores and ratings

### Profile Management

- User profile information
- Profile image selection from device gallery
- Drive statistics
- Average score tracking

### Settings

- Application information
- Safety information
- Clear drive history
- Delete account functionality

### Navigation

- Drawer navigation
- Bottom tab navigation
- Responsive layouts for phones and tablets

---

## Technology Stack

### Frontend

- React Native
- Expo
- Expo Router
- TypeScript

### Device Sensors

- Accelerometer
- Gyroscope
- DeviceMotion

### Storage

- Expo SQLite
- Async Storage

### File Management

- Expo File System
- Expo Image Picker

---

## Project Architecture

```text
.
├── app
│   ├── (drawer)
│   │   ├── (tabs)
│   │   │   ├── _layout.tsx
│   │   │   ├── dashboard
│   │   │   │   └── index.tsx
│   │   │   ├── drive
│   │   │   │   ├── index.tsx
│   │   │   │   └── summary.tsx
│   │   │   ├── history
│   │   │   │   └── index.tsx
│   │   │   └── profile
│   │   │       └── index.tsx
│   │   ├── _layout.tsx
│   │   └── settings
│   │       └── index.tsx
│   ├── _layout.tsx
│   ├── auth
│   │   └── index.tsx
│   ├── index.tsx
│   └── onboarding
│       ├── _layout.tsx
│       ├── page1.tsx
│       ├── page2.tsx
│       └── page3.tsx
│
├── assets
│   ├── expo.icon
│   └── images
│
├── components
│   ├── CustomAlert.tsx
│   └── CustomDrawerContent.tsx
│
├── database
│   ├── database.ts
│   ├── driveRepository.ts
│   └── userRepository.ts
│
├── hooks
│   ├── use-accelerometer.ts
│   ├── use-gyroscope.ts
│   └── use-phone-handling.ts
│
├── storage
│   └── storage.ts
│
└── types
    └── index.ts
```

---

## Folder Responsibilities

### app/

Contains all screens and navigation routes.

### app/(drawer)/

Main application area after authentication.

### app/(drawer)/(tabs)/

Bottom tab navigation screens.

### dashboard/

Displays overall driving statistics and insights.

### drive/

Handles live drive monitoring and drive summaries.

### history/

Displays historical driving sessions.

### profile/

User profile and profile image management.

### settings/

Application settings and account management.

---

### components/

Reusable UI components used throughout the application.

### database/

SQLite database configuration and repository functions.

### hooks/

Custom hooks for sensor monitoring and phone handling detection.

### storage/

Persistent application storage helpers.

### types/

Shared TypeScript interfaces and type definitions.

---

## Database Structure

### users

| Column       | Type    |
| ------------ | ------- |
| id           | INTEGER |
| name         | TEXT    |
| email        | TEXT    |
| mobile       | TEXT    |
| password     | TEXT    |
| profileImage | TEXT    |
| createdAt    | TEXT    |

### drives

| Column    | Type    |
| --------- | ------- |
| id        | INTEGER |
| userId    | INTEGER |
| startTime | TEXT    |
| endTime   | TEXT    |
| duration  | INTEGER |
| score     | INTEGER |
| rating    | TEXT    |
| createdAt | TEXT    |

### drive_events

| Column    | Type    |
| --------- | ------- |
| id        | INTEGER |
| driveId   | INTEGER |
| eventType | TEXT    |
| timestamp | TEXT    |
| severity  | TEXT    |

---

## Safety Score Logic

The application starts each drive with a score of **100**.

Detected driving events reduce the score:

| Event               | Penalty |
| ------------------- | ------- |
| Harsh Braking       | -5      |
| Harsh Acceleration  | -5      |
| Aggressive Steering | -5      |
| Sharp Turn          | -3      |
| Phone Handling      | -10     |

### Ratings

| Score    | Rating    |
| -------- | --------- |
| 90 - 100 | Excellent |
| 75 - 89  | Good      |
| 60 - 74  | Fair      |
| Below 60 | Poor      |

---
