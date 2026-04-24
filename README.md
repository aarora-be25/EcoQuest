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

## Setup (on codespaces, run the following commands)
```
npm install
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
npx expo install expo-updates
eas update:configure
eas update --branch preview --message "update"
```

---
## To Do

### Add real data (backend integration) AND image storage
All mock data lives in `constants/data.js`. When your backend is ready:
- Replace `TASKS` with an API call using `fetch()` or `axios`
- Replace `CURRENT_USER` with data from your auth system
- Replace leaderboard arrays with live API responses

### Add more tasks
Will have to be edited in data.js

---

### Design system

All design decisions (colors, fonts, spacing) are in `constants/theme.js`.
Import what you need:
```js
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
```
