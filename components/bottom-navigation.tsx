import { Colors } from '@/constants/theme';
import { BrandPalette } from '@/context/FinanceContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter, useSegments } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

type TabId = 'index' | 'budgets' | 'goals' | 'cards';

interface NavItem {
  id: TabId;
  label: string;
  icon: string;
  route: '/' | '/budgets' | '/goals' | '/cards';
}

const navItems: NavItem[] = [
  { id: 'index', label: 'Home', icon: 'home', route: '/' },
  { id: 'budgets', label: 'Budgets', icon: 'chart-pie', route: '/budgets' },
  { id: 'goals', label: 'Goals', icon: 'target', route: '/goals' },
  { id: 'cards', label: 'Cards', icon: 'credit-card', route: '/cards' },
];

// Per-tab theming so the nav bar picks up the screen's mood
const TAB_THEME: Record<TabId, { accent: string; barBg: string }> = {
  index: { accent: BrandPalette.moss, barBg: '#E8EFE2' },
  budgets: { accent: BrandPalette.coffee, barBg: '#F6E9D7' },
  goals: { accent: BrandPalette.moss, barBg: '#EEF3E8' },
  cards: { accent: BrandPalette.mocha, barBg: '#EFE9DC' },
};

export default function BottomNavigation() {
  const router = useRouter();
  const segments = useSegments();
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const currentRoute = (segments[1] as TabId) || 'index';
  const tabTheme = TAB_THEME[currentRoute] ?? TAB_THEME.index;

  return (
    <View style={[styles.bottomNav, { backgroundColor: tabTheme.barBg, borderTopColor: colors.border }]}>
      {navItems.map((item) => {
        const isActive = currentRoute === item.id;
        const activeColor = TAB_THEME[item.id].accent;
        return (
          <NavItemButton
            key={item.id}
            isActive={isActive}
            activeColor={activeColor}
            item={item}
            inactiveBg={colors.backgroundTertiary}
            inactiveText={colors.textSecondary}
            onPress={() => router.push(item.route)}
          />
        );
      })}
    </View>
  );
}

function NavItemButton({
  item,
  isActive,
  activeColor,
  inactiveBg,
  inactiveText,
  onPress,
}: {
  item: NavItem;
  isActive: boolean;
  activeColor: string;
  inactiveBg: string;
  inactiveText: string;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const activeAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  // Spring up slightly when a tab becomes active
  useEffect(() => {
    Animated.spring(activeAnim, {
      toValue: isActive ? 1 : 0,
      useNativeDriver: true,
      speed: 18,
      bounciness: 10,
    }).start();
  }, [isActive, activeAnim]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  const iconScale = activeAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const iconLift = activeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -2] });

  return (
    <Pressable
      style={styles.navItem}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.navIcon,
          { backgroundColor: isActive ? activeColor : inactiveBg },
          { transform: [{ scale: Animated.multiply(scale, iconScale) }, { translateY: iconLift }] },
        ]}
      >
        <MaterialCommunityIcons
          name={item.icon as any}
          size={20}
          color={isActive ? 'white' : inactiveText}
        />
      </Animated.View>
      <Text style={[styles.navLabel, { color: isActive ? activeColor : inactiveText }]}>
        {item.label}
      </Text>
    </Pressable>
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
