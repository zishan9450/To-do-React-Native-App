import type React from "react"
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from "react-native"
import { theme } from "../theme/theme"

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "danger" | "outline"
  size?: "small" | "medium" | "large"
  loading?: boolean
  disabled?: boolean
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return theme.colors.secondary + "80" // 50% opacity

    switch (variant) {
      case "primary":
        return theme.colors.primary
      case "secondary":
        return theme.colors.secondary
      case "danger":
        return theme.colors.danger
      case "outline":
        return "transparent"
      default:
        return theme.colors.primary
    }
  }

  const getBorderColor = () => {
    if (variant === "outline") {
      return disabled ? theme.colors.secondary : theme.colors.primary
    }
    return "transparent"
  }

  const getTextColor = () => {
    if (disabled) return theme.colors.textSecondary

    if (variant === "outline") {
      return theme.colors.primary
    }

    return theme.colors.light
  }

  const getHeight = () => {
    switch (size) {
      case "small":
        return 36
      case "medium":
        return 48
      case "large":
        return 56
      default:
        return 48
    }
  }

  const getFontSize = () => {
    switch (size) {
      case "small":
        return theme.fontSize.sm
      case "medium":
        return theme.fontSize.md
      case "large":
        return theme.fontSize.lg
      default:
        return theme.fontSize.md
    }
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          height: getHeight(),
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize: getFontSize(),
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
  },
  text: {
    fontWeight: "500", // Replace with a valid fontWeight value
  },
})
