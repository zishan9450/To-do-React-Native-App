import React, { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Provider as PaperProvider } from "react-native-paper"

// Import screen components
import LoginScreen from "./screens/LoginScreen"
import TodoListScreen from "./screens/TodoListScreen"
import AddTodoScreen from "./screens/AddTodoScreen"

// Import providers
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { TodoProvider } from "./contexts/TodoContext"

// Import error handling components
import ErrorBoundary from "./components/ErrorBoundary"
import LoadingOverlay from "./components/LoadingOverlay"
import Toast from "./components/Toast"

// Define the stack navigator param list
export type RootStackParamList = {
  Login: undefined
  TodoList: undefined
  AddTodo: undefined
}

// Create a context for global loading and toast
interface AppContextType {
  showLoading: (message?: string) => void
  hideLoading: () => void
  showToast: (message: string, type?: "success" | "error" | "info" | "warning") => void
}

export const AppContext = React.createContext<AppContextType>({
  showLoading: () => {},
  hideLoading: () => {},
  showToast: () => {},
})

const Stack = createStackNavigator<RootStackParamList>()

function Navigation() {
  const { token } = useAuth()

  return (
    <Stack.Navigator initialRouteName={token ? "TodoList" : "Login"}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
      <Stack.Screen name="TodoList" component={TodoListScreen} options={{ title: "Todo List" }} />
      <Stack.Screen name="AddTodo" component={AddTodoScreen} options={{ title: "Add Todo" }} />
    </Stack.Navigator>
  )
}

export default function App() {
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Loading...")
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" | "info" | "warning" }>({
    visible: false,
    message: "",
    type: "info",
  })

  // Global loading and toast functions
  const showLoading = (message = "Loading...") => {
    setLoadingMessage(message)
    setLoading(true)
  }

  const hideLoading = () => {
    setLoading(false)
  }

  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    setToast({ visible: true, message, type })
  }

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }))
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider>
          <AppContext.Provider value={{ showLoading, hideLoading, showToast }}>
            <AuthProvider>
              <TodoProvider>
                <NavigationContainer>
                  <Navigation />
                </NavigationContainer>
                <LoadingOverlay visible={loading} message={loadingMessage} />
                <Toast visible={toast.visible} message={toast.message} type={toast.type} onDismiss={hideToast} />
              </TodoProvider>
            </AuthProvider>
          </AppContext.Provider>
        </PaperProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  )
}
