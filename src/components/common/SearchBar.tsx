import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, Animated } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onSubmit?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search destinations...',
  onFocus,
  onSubmit,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.pearl, colors.sand],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderColor,
          borderWidth: isFocused ? 1.5 : 1,
        },
      ]}
    >
      <Text style={styles.searchIcon}>{'\uD83D\uDD0D'}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.slate}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...shadows.sm,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.charcoal,
    padding: 0,
  },
});

export default SearchBar;
