"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, Dimensions } from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../App"
import { useAuth } from "../contexts/AuthContext"
import { useTodo } from "../contexts/TodoContext"
import { theme } from "../theme/theme"
import { Input } from "../components/Input"
import { Button } from "../components/Button"
import { Card } from "../components/Card"

type AddTodoScreenNavigationProp = StackNavigationProp<RootStackParamList, "AddTodo">

type Props = {
  navigation: AddTodoScreenNavigationProp
}

const AddTodoScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { token } = useAuth()
  const { addTodo } = useTodo()
  const { width } = Dimensions.get("window")
  const isTablet = width > 768

  const handleAddTodo = async () => {
    // Validate input
    if (!title.trim()) {
      setError("Todo title is required")
      return
    }

    if (!token) {
      navigation.replace("Login")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await addTodo(title)

      // Success - go back to list
      Alert.alert("Success", "Todo added successfully")
      navigation.goBack()
    } catch (e) {
      console.error("Failed to add todo", e)
      setError("Failed to add todo. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={[styles.formContainer, isTablet && styles.tabletFormContainer]}>
        <Card style={styles.card}>
          <Text style={styles.title}>Add New Todo</Text>

          <Input
            label="Todo Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter todo title"
            autoCapitalize="sentences"
            autoFocus
            error={error ?? undefined}
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Create Todo"
              onPress={handleAddTodo}
              loading={loading}
              disabled={loading}
              style={styles.button}
            />

            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="outline"
              disabled={loading}
              style={styles.button}
            />
          </View>
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
    padding: theme.spacing.md,
  },
  tabletFormContainer: {
    paddingHorizontal: "20%",
  },
  card: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: "bold",
    marginBottom: theme.spacing.xl,
    color: theme.colors.primary,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
  },
  button: {
    marginBottom: theme.spacing.md,
  },
})

export default AddTodoScreen
