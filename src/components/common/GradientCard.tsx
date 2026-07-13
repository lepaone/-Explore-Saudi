import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients, borderRadius, shadows, spacing } from '../../constants/theme';

interface GradientCardProps {
  children: React.ReactNode;
  colors?: string[];
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const GradientCard: React.FC<GradientCardProps> = ({
  children,
  colors: colorsProp,
  style,
  onPress,
}) => {
  const gradientColors = (colorsProp ?? [...gradients.goldGradient]) as [
    string,
    string,
    ...string[],
  ];

  const content = (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.touchable}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.touchable}>{content}</View>;
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: borderRadius.xl,
    ...shadows.medium,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    overflow: 'hidden',
  },
});

export default GradientCard;
