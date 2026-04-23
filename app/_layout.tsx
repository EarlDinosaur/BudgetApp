import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { FinanceProvider, useFinance } from '@/context/FinanceContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootStack() {
  const colorScheme = useColorScheme();
  const { isHydrated } = useFinance();

  if (!isHydrated) {
    const colors = Colors[colorScheme ?? 'light'];
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          animation: 'slide_from_right',
          animationDuration: 260,
          contentStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'Add Transaction',
            animation: 'slide_from_bottom',
            animationDuration: 320,
          }}
        />
        <Stack.Screen
          name="history"
          options={{ title: 'History', animation: 'slide_from_right' }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <FinanceProvider>
      <RootStack />
    </FinanceProvider>
  );
}
