import type React from "react"
import { View, ActivityIndicator, Text, StyleSheet, Modal } from "react-native"
import { theme } from "../theme/theme"

interface LoadingOverlayProps {
  visible: boolean
  message?: string
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, message = "Loading..." }) => {
  if (!visible) return null

  return (
    <Modal transparent visible={visible}>
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    minWidth: 200,
  },
  message: {
    marginTop: theme.spacing.md,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
  },
})

export default LoadingOverlay
