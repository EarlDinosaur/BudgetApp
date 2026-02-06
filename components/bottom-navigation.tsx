import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter, useSegments } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface NavItem {
  id: 'index' | 'explore' | 'cards' | 'profile';
  label: string;
  icon: string;
  route: string;
}

const navItems: NavItem[] = [
  { id: 'index', label: 'Home', icon: 'home', route: '/' },
  { id: 'cards', label: 'Cards', icon: 'credit-card', route: '/(tabs)/cards' },
  { id: 'explore', label: 'Expenses', icon: 'silverware-fork-knife', route: '/(tabs)/explore' },
  { id: 'profile', label: 'Profile', icon: 'account', route: '/(tabs)/profile' },
];

export default function BottomNavigation() {
  const router = useRouter();
  const segments = useSegments();
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  // Get the current active route from segments
  // segments[1] will be the screen name (e.g., 'index', 'explore')
  const currentRoute = segments[1] || 'index';

  return (
    <View style={[styles.bottomNav, { backgroundColor: colors.backgroundSecondary, borderTopColor: colors.border }]}>
      {navItems.map(item => {
        const isActive = currentRoute === item.id;
        return (
          <Pressable
            key={item.id}
            style={styles.navItem}
            onPress={() => router.push(item.route)}
          >
            <View
              style={[
                styles.navIcon,
                {
                  backgroundColor: isActive ? colors.primary : colors.backgroundTertiary,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon as any}
                size={20}
                color={isActive ? 'white' : colors.textSecondary}
              />
            </View>
            <Text style={[styles.navLabel, { color: isActive ? colors.primary : colors.textSecondary }]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
