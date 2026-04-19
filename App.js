import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from './constants/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Firebase Auth
import { AuthProvider, useAuth } from './context/AuthContext';

// Screens
import HomeScreen          from './screens/HomeScreen';
import LoginScreen         from './screens/LoginScreen';
import DashboardScreen     from './screens/DashboardScreen';
import TaskDetailScreen    from './screens/TaskDetailScreen';
import TasksListScreen     from './screens/TasksListScreen';
import LeaderboardScreen   from './screens/LeaderboardScreen';
import ProfileScreen       from './screens/ProfileScreen';
import NotificationsScreen from './screens/NotificationsScreen';

SplashScreen.preventAutoHideAsync().catch(() => {});

const Stack = createNativeStackNavigator();

// Separate component so it can access useAuth() inside AuthProvider
function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null; // splash is still showing, wait

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={user ? 'dashboard' : 'home'}
    >
      {/* Logged OUT screens */}
      <Stack.Screen name="home"     component={HomeScreen} />
      <Stack.Screen name="login"    component={LoginScreen} />

      {/* Logged IN screens */}
      <Stack.Screen name="dashboard"     component={DashboardScreen} />
      <Stack.Screen name="taskDetail"    component={TaskDetailScreen} />
      <Stack.Screen name="tasksList"     component={TasksListScreen} />
      <Stack.Screen name="leaderboard"   component={LeaderboardScreen} />
      <Stack.Screen name="profile"       component={ProfileScreen} />
      <Stack.Screen name="notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (e) {
        console.log('Init error:', e);
      } finally {
        setAppReady(true);
      }
    };
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [appReady]);

  if (!appReady) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <View style={styles.root} onLayout={onLayoutRootView}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </View>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bgPage,
  },
});