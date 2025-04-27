import type React from "react"
import type { ReactNode } from "react"
import { View, StyleSheet, type StyleProp, type ViewStyle } from "react-native"
import { theme } from "../theme/theme"

interface CardProps {
  children: ReactNode
  style?: StyleProp<ViewStyle>
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
})
