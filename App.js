import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from './constants/theme';

import HomeScreen          from './screens/HomeScreen';
import LoginScreen         from './screens/LoginScreen';
import DashboardScreen     from './screens/DashboardScreen';
import TaskDetailScreen    from './screens/TaskDetailScreen';
import TasksListScreen     from './screens/TasksListScreen';
import LeaderboardScreen   from './screens/LeaderboardScreen';
import ProfileScreen       from './screens/ProfileScreen';
import NotificationsScreen from './screens/NotificationsScreen';

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

setTimeout(() => {
  SplashScreen.hideAsync();
}, 3000); // 3 seconds — change to whatever you want

export default function App() {
  const [screen, setScreen]       = useState('home');
  const [screenParams, setParams] = useState({});

  const navigate = (to, params = {}) => {
    setParams(params);
    setScreen(to);
  };

  const renderScreen = () => {
    switch (screen) {
      case 'home':          return <HomeScreen          navigate={navigate} />;
      case 'login':         return <LoginScreen         navigate={navigate} />;
      case 'dashboard':     return <DashboardScreen     navigate={navigate} />;
      case 'taskDetail':    return <TaskDetailScreen    navigate={navigate} task={screenParams.task} onComplete={screenParams.onComplete} />;
      case 'tasksList':     return <TasksListScreen     navigate={navigate} />;
      case 'leaderboard':   return <LeaderboardScreen   navigate={navigate} />;
      case 'profile':       return <ProfileScreen       navigate={navigate} />;
      case 'notifications': return <NotificationsScreen navigate={navigate} />;
      default:              return <HomeScreen          navigate={navigate} />;
    }
  };

  return <View style={styles.root}>{renderScreen()}</View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bgPage },
});
