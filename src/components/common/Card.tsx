import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';

type CardVariant = 'default' | 'elevated' | 'outlined';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: CardVariant;
  onPress?: () => void;
  padding?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  onPress,
  padding = spacing.md,
}) => {
  const variantStyles: Record<CardVariant, ViewStyle> = {
    default: {
      backgroundColor: colors.cream,
      borderWidth: 1,
      borderColor: colors.pearl,
      ...shadows.small,
    },
    elevated: {
      backgroundColor: colors.white,
      ...shadows.large,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.pearl,
    },
  };

  const cardStyle: ViewStyle[] = [
    styles.card,
    variantStyles[variant],
    { padding },
    style as ViewStyle,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={cardStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
});

export default Card;
