/**
 * Professional icon components using @expo/vector-icons
 * Provides consistent, professional appearance across the app
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View, ViewProps } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

const IconMap: Record<string, string> = {
  bell: 'bell',
  eye: 'eye',
  plus: 'plus',
  arrowUpRight: 'arrow-top-right',
  moreHorizontal: 'dots-horizontal',
  dollarSign: 'currency-usd',
  building: 'office-building',
  car: 'car',
  utensils: 'silverware-fork-knife',
  shoppingBag: 'shopping',
  home: 'home',
  creditCard: 'credit-card',
  user: 'account',
  menu: 'menu',
  hand: 'hand-wave',
};

export function Icon({ name, size = 24, color }: IconProps) {
  const theme = useColorScheme() ?? 'light';
  const iconColor = color || Colors[theme].icon;
  const iconName = IconMap[name] || name;

  return (
    <MaterialCommunityIcons
      name={iconName as any}
      size={size}
      color={iconColor}
    />
  );
}

/**
 * Avatar component with professional styling
 */
interface AvatarProps extends ViewProps {
  initials?: string;
  backgroundColor?: string;
}

export function Avatar({ initials = 'U', backgroundColor, style, ...props }: AvatarProps) {
  const theme = useColorScheme() ?? 'light';
  const bgColor = backgroundColor || Colors[theme].primaryLight;

  return (
    <View
      style={[
        {
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: bgColor,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1.5,
          borderColor: Colors[theme].border,
        },
        style,
      ]}
      {...props}>
      <MaterialCommunityIcons size={24} name="currency-usd" color={Colors[theme].primary} />
    </View>
  );
}

/**
 * Icon badge for category representations
 */
interface IconBadgeProps extends ViewProps {
  icon: string;
  backgroundColor?: string;
  size?: number;
}

export function IconBadge({ icon, backgroundColor, size = 48, style, ...props }: IconBadgeProps) {
  const theme = useColorScheme() ?? 'light';
  const bgColor = backgroundColor || Colors[theme].backgroundSecondary;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 3,
          backgroundColor: bgColor,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
      {...props}>
      <Icon name={icon} size={size / 2} color={Colors[theme].primary} />
    </View>
  );
}
