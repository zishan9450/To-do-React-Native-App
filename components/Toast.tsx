"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { theme } from "../theme/theme"

export type ToastType = "success" | "error" | "info" | "warning"

interface ToastProps {
  visible: boolean
  message: string
  type?: ToastType
  duration?: number
  onDismiss: () => void
}

const Toast: React.FC<ToastProps> = ({ visible, message, type = "info", duration = 3000, onDismiss }) => {
  const opacity = useRef(new Animated.Value(0)).current
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (visible) {
      setIsVisible(true)
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()

      const timer = setTimeout(() => {
        handleDismiss()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [visible])

  const handleDismiss = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false)
      onDismiss()
    })
  }

  if (!isVisible) return null

  const getIconName = () => {
    switch (type) {
      case "success":
        return "checkmark-circle"
      case "error":
        return "alert-circle"
      case "warning":
        return "warning"
      case "info":
      default:
        return "information-circle"
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return theme.colors.success
      case "error":
        return theme.colors.danger
      case "warning":
        return theme.colors.warning
      case "info":
      default:
        return theme.colors.info
    }
  }

  return (
    <Animated.View style={[styles.container, { opacity, backgroundColor: getBackgroundColor() }]}>
      <View style={styles.content}>
        <Ionicons name={getIconName()} size={24} color="#fff" />
        <Text style={styles.message}>{message}</Text>
      </View>
      <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
        <Ionicons name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    borderRadius: theme.borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  message: {
    color: "#fff",
    marginLeft: theme.spacing.md,
    fontSize: theme.fontSize.md,
    flex: 1,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
})

export default Toast
