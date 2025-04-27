"use client"

import type React from "react"
import { useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Dimensions,
} from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../App"
import { useAuth } from "../contexts/AuthContext"
import { useTodo } from "../contexts/TodoContext"
import type { Todo } from "../types/Todo"
import { Checkbox } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import { Swipeable } from "react-native-gesture-handler"
import { theme } from "../theme/theme"
import { Card } from "../components/Card"
import { Button } from "../components/Button"

type TodoListScreenNavigationProp = StackNavigationProp<RootStackParamList, "TodoList">

type Props = {
  navigation: TodoListScreenNavigationProp
}

const TodoListScreen: React.FC<Props> = ({ navigation }) => {
  const { token, userId, logout } = useAuth()
  const { todos, loading, error, refreshing, fetchTodos, updateTodo, deleteTodo } = useTodo()

  const { width } = Dimensions.get("window")
  const isTablet = width > 768

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    fetchTodos()
  }, [fetchTodos])

  // Navigate to add todo screen
  const navigateToAddTodo = () => {
    navigation.navigate("AddTodo")
  }

  // Handle logout
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => {
          logout()
          navigation.replace("Login")
        },
      },
    ])
  }

  // Toggle todo completion status
  const toggleTodoStatus = async (todo: Todo) => {
    try {
      await updateTodo(todo.id, !todo.completed)

      // Show success message
      Alert.alert("Success", `Todo marked as ${!todo.completed ? "completed" : "incomplete"}`)
    } catch (e) {
      Alert.alert("Error", "Failed to update todo. Please try again.")
    }
  }

  // Delete todo with confirmation
  const confirmDeleteTodo = (todoId: number) => {
    // Confirm deletion
    Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTodo(todoId)

            // Show success message
            Alert.alert("Success", "Todo deleted successfully")
          } catch (e) {
            Alert.alert("Error", "Failed to delete todo. Please try again.")
          }
        },
      },
    ])
  }

  // Render right actions for swipeable
  const renderRightActions = (todoId: number) => {
    return (
      <TouchableOpacity style={styles.deleteAction} onPress={() => confirmDeleteTodo(todoId)}>
        <Ionicons name="trash-outline" size={24} color="#fff" />
      </TouchableOpacity>
    )
  }

  // Render a todo item
  const renderTodoItem = ({ item }: { item: Todo }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <Card style={styles.todoItem}>
        <TouchableOpacity style={styles.checkboxContainer} onPress={() => toggleTodoStatus(item)}>
          <Checkbox status={item.completed ? "checked" : "unchecked"} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.todoText, item.completed && styles.completedTodo]}>{item.todo}</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDeleteTodo(item.id)}>
          <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
        </TouchableOpacity>
      </Card>
    </Swipeable>
  )

  // Set up the header buttons
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={navigateToAddTodo}>
            <Ionicons name="add" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      ),
    })
  }, [navigation])

  // Handle authentication state
  useEffect(() => {
    if (!token || !userId) {
      navigation.replace("Login")
    }
  }, [token, userId, navigation])

  // If not authenticated, show loading state
  if (!token || !userId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading todos...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Retry" onPress={fetchTodos} style={styles.retryButton} />
        </View>
      ) : (
        <FlatList
          data={todos}
          renderItem={renderTodoItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[styles.listContent, isTablet && styles.tabletListContent]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
          }
          ListEmptyComponent={<Text style={styles.emptyText}>No todos found. Pull down to refresh.</Text>}
        />
      )}

      {/* Floating action button for mobile */}
      {!isTablet && (
        <TouchableOpacity style={styles.fab} onPress={navigateToAddTodo}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  errorText: {
    color: theme.colors.danger,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    minWidth: 120,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  tabletListContent: {
    paddingHorizontal: "10%",
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    marginBottom: 0,
  },
  checkboxContainer: {
    marginRight: theme.spacing.sm,
  },
  todoText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  completedTodo: {
    textDecorationLine: "line-through",
    color: theme.colors.textSecondary,
  },
  deleteButton: {
    padding: theme.spacing.sm,
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xxl,
  },
  headerButtons: {
    flexDirection: "row",
  },
  headerButton: {
    marginRight: theme.spacing.md,
    padding: theme.spacing.xs,
  },
  deleteAction: {
    backgroundColor: theme.colors.danger,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderTopRightRadius: theme.borderRadius.md,
    borderBottomRightRadius: theme.borderRadius.md,
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
})

export default TodoListScreen
