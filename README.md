# EcoQuest 🌱
**TIET UEN008 Sustainability App — 1st Year Team Project**

---

## Project structure

```
ecoquest/
├── App.js                        ← Root — handles all screen navigation
├── app.json                      ← Expo config
├── package.json                  ← Dependencies
│
├── constants/
│   ├── theme.js                  ← All colors, fonts, spacing (design system)
│   └── data.js                   ← Mock data (tasks, leaderboard, user)
│
├── components/
│   ├── BottomNav.js              ← Shared bottom navigation bar
│   └── TaskCard.js               ← Reusable task card component
│
└── screens/
    ├── HomeScreen.js             ← Landing / about page
    ├── LoginScreen.js            ← Login + Sign up
    ├── DashboardScreen.js        ← Main dashboard (home after login)
    ├── TaskDetailScreen.js       ← Single task — photo + complete
    ├── TasksListScreen.js        ← All tasks with category filter
    ├── LeaderboardScreen.js      ← Full leaderboard (branch + year)
    ├── ProfileScreen.js          ← User profile + achievements
    └── NotificationsScreen.js   ← Notifications list
```

---

## Setup (do this once)

1. Install Node.js from https://nodejs.org (LTS version)
2. Install Expo CLI:
   ```
   npm install -g expo-cli
   ```
3. Clone the repo and enter the folder:
   ```
   git clone <your-repo-url>
   cd ecoquest
   ```
4. Install dependencies:
   ```
   npm install
   ```
5. Start the app:
   ```
   npx expo start
   ```
6. Scan the QR code with the **Expo Go** app on your phone (available on Play Store / App Store)

---

## How to work as a team on GitHub

1. Each person works on their assigned screen file
2. Never edit `theme.js` without telling the team — it affects every screen
3. Never edit `data.js` structure without telling the team
4. Push to a feature branch, then merge to main via Pull Request

### Suggested team split (7 people):
| Person | File(s) |
|--------|---------|
| 1 | HomeScreen.js |
| 2 | LoginScreen.js |
| 3 | DashboardScreen.js |
| 4 | TaskDetailScreen.js + TasksListScreen.js |
| 5 | LeaderboardScreen.js |
| 6 | ProfileScreen.js + NotificationsScreen.js |
| 7 | Backend / data integration (replace mock data in data.js) |

---

## How navigation works

Navigation is handled in `App.js` using a simple `navigate(screenName, params)` function.
Every screen receives `navigate` as a prop.

To go to another screen:
```js
navigate('dashboard')           // go to dashboard
navigate('taskDetail', { task }) // go to task detail, pass the task object
navigate('home')                // go back to home (logout etc)
```

When you're ready, replace this with **expo-router** or **React Navigation** for more
advanced features like back-button support and deep linking.

---

## Adding real data (backend integration)

All mock data lives in `constants/data.js`. When your backend is ready:
- Replace `TASKS` with an API call using `fetch()` or `axios`
- Replace `CURRENT_USER` with data from your auth system
- Replace leaderboard arrays with live API responses

For photo upload in `TaskDetailScreen.js`, install and use:
```
npx expo install expo-image-picker
```
Then follow the commented instructions in `TaskDetailScreen.js`.

---

## Design system

All design decisions (colors, fonts, spacing) are in `constants/theme.js`.
Import what you need:
```js
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
```

Primary green: `#1D9E75`
Accent (points): `#EF9F27`
