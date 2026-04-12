/*import React, { useState, useEffect } from 'react';
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


export default function App() {
  const [screen, setScreen]   = useState('home');
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
}*/

import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from './constants/theme';

import * as SplashScreen from 'expo-splash-screen';

// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen          from './screens/HomeScreen';
import LoginScreen         from './screens/LoginScreen';
import DashboardScreen     from './screens/DashboardScreen';
import TaskDetailScreen    from './screens/TaskDetailScreen';
import TasksListScreen     from './screens/TasksListScreen';
import LeaderboardScreen   from './screens/LeaderboardScreen';
import ProfileScreen       from './screens/ProfileScreen';
import NotificationsScreen from './screens/NotificationsScreen';

// Keep splash visible initially
SplashScreen.preventAutoHideAsync().catch(() => {});

const Stack = createNativeStackNavigator();

export default function App() {
  const [appReady, setAppReady] = useState(false);

  // Prepare app (loading phase)
  useEffect(() => {
    const prepare = async () => {
      try {
        // simulate loading (API/fonts/etc)
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (e) {
        console.log('Init error:', e);
      } finally {
        setAppReady(true);
      }
    };

    prepare();
  }, []);

  // Hide splash once layout is ready
  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [appReady]);

  if (!appReady) {
    return null; // keeps splash visible
  }

  return (
    <View style={styles.root} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="home"
          screenOptions={{
            headerShown: false, // change to true if you want default header
          }}
        >
          <Stack.Screen name="home" component={HomeScreen} />
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="dashboard" component={DashboardScreen} />
          <Stack.Screen name="taskDetail" component={TaskDetailScreen} />
          <Stack.Screen name="tasksList" component={TasksListScreen} />
          <Stack.Screen name="leaderboard" component={LeaderboardScreen} />
          <Stack.Screen name="profile" component={ProfileScreen} />
          <Stack.Screen name="notifications" component={NotificationsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bgPage,
  },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bgPage },
});
