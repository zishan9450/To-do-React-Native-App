"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Dimensions } from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../App"
import { useAuth } from "../contexts/AuthContext"
import { theme } from "../theme/theme"
import { Input } from "../components/Input"
import { Button } from "../components/Button"
import { Card } from "../components/Card"

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">

type Props = {
  navigation: LoginScreenNavigationProp
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const { login, loading, token, error } = useAuth()
  const { width } = Dimensions.get("window")
  const isTablet = width > 768

  // If already logged in, navigate to TodoList
  useEffect(() => {
    if (token) {
      navigation.replace("TodoList")
    }
  }, [token, navigation])

  const validateForm = () => {
    let isValid = true

    if (!username.trim()) {
      setUsernameError("Username is required")
      isValid = false
    } else {
      setUsernameError(null)
    }

    if (!password.trim()) {
      setPasswordError("Password is required")
      isValid = false
    } else {
      setPasswordError(null)
    }

    return isValid
  }

  const handleLogin = async () => {
    // Form validation
    if (!validateForm()) {
      return
    }

    setFormError(null)

    try {
      await login(username, password)
      // Navigation will happen in the useEffect when token is set
    } catch (e) {
      // Error is already set in the auth context
      console.error("Login error:", e)
    }
  }

  // Display auth context error if present
  useEffect(() => {
    if (error) {
      setFormError(error)
    }
  }, [error])

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={[styles.formContainer, isTablet && styles.tabletFormContainer]}>
        <Card style={styles.card}>
          <Text style={styles.title}>TodoApp</Text>

          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            autoCapitalize="none"
            autoCorrect={false}
            error={usernameError ?? undefined}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            error={passwordError ?? undefined}
          />

          {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

          <Button title="Sign In" onPress={handleLogin} loading={loading} disabled={loading} style={styles.button} />

          <Text style={styles.hint}>
            Hint: Use dummyjson credentials (e.g., username: 'kminchelle', password: '0lelplR')
          </Text>
        </Card>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.md,
  },
  tabletFormContainer: {
    paddingHorizontal: "20%",
  },
  card: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: "bold", // Ensure this is a valid fontWeight value
    marginBottom: theme.spacing.xl,
    color: theme.colors.primary,
    textAlign: "center",
  },
  button: {
    marginTop: theme.spacing.lg,
  },
  errorText: {
    color: theme.colors.danger,
    marginTop: theme.spacing.sm,
    textAlign: "center",
  },
  hint: {
    marginTop: theme.spacing.lg,
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontSize: theme.fontSize.sm,
  },
})

export default LoginScreen
