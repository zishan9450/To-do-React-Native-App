"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import axios from "axios"
import type { Todo, TodosResponse } from "../types/Todo"
import { useAuth } from "./AuthContext"

type TodoContextType = {
  todos: Todo[]
  loading: boolean
  error: string | null
  refreshing: boolean
  fetchTodos: () => Promise<void>
  addTodo: (title: string) => Promise<void>
  updateTodo: (todoId: number, completed: boolean) => Promise<void>
  deleteTodo: (todoId: number) => Promise<void>
}

const TodoContext = createContext<TodoContextType>({
  todos: [],
  loading: false,
  error: null,
  refreshing: false,
  fetchTodos: async () => {},
  addTodo: async () => {},
  updateTodo: async () => {},
  deleteTodo: async () => {},
})

interface TodoProviderProps {
  children: ReactNode
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const { token, userId, logout } = useAuth()

  // Fetch todos
  const fetchTodos = async () => {
    if (!token || !userId) {
      return
    }

    try {
      setError(null)
      const response = await axios.get<TodosResponse>(`https://dummyjson.com/todos/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setTodos(response.data.todos)
    } catch (e) {
      console.error("Failed to fetch todos", e)
      setError("Failed to load todos. Please try again.")

      // Handle unauthorized error
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        logout()
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Add todo
  const addTodo = async (title: string) => {
    if (!token || !userId) {
      return
    }

    try {
      console.log("Adding todo locally:", { title, userId })
      
      // Generate a unique ID by combining timestamp with a random number
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Since the API is read-only, we'll create a new todo locally
      const newTodo: Todo = {
        id: Number(uniqueId.replace(/[^0-9]/g, '')), // Convert to number for consistency
        todo: title,
        completed: false,
        userId: Number.parseInt(userId),
      }

      setTodos((prevTodos) => [...prevTodos, newTodo])
    } catch (e) {
      console.error("Failed to add todo", e)
      if (axios.isAxiosError(e)) {
        console.error("Axios error details:", {
          status: e.response?.status,
          data: e.response?.data,
          headers: e.response?.headers
        })
      }
      setError("Failed to add todo. Please try again.")

      if (axios.isAxiosError(e) && e.response?.status === 401) {
        logout()
      }
    }
  }

  // Update todo
  const updateTodo = async (todoId: number, completed: boolean) => {
    if (!token) {
      return
    }

    try {
      console.log("Updating todo locally:", { todoId, completed })
      
      // Since the API is read-only, we'll just update the local state
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === todoId ? { ...todo, completed } : todo)),
      )
    } catch (e) {
      console.error("Failed to update todo", e)
      if (axios.isAxiosError(e)) {
        console.error("Axios error details:", {
          status: e.response?.status,
          data: e.response?.data,
          headers: e.response?.headers
        })
      }
      setError("Failed to update todo. Please try again.")

      if (axios.isAxiosError(e) && e.response?.status === 401) {
        logout()
      }
    }
  }

  // Delete todo
  const deleteTodo = async (todoId: number) => {
    if (!token) {
      return
    }

    try {
      console.log("Deleting todo locally:", { todoId })
      
      // Since the API is read-only, we'll just update the local state
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId))
    } catch (e) {
      console.error("Failed to delete todo", e)
      if (axios.isAxiosError(e)) {
        console.error("Axios error details:", {
          status: e.response?.status,
          data: e.response?.data,
          headers: e.response?.headers
        })
      }
      setError("Failed to delete todo. Please try again.")

      if (axios.isAxiosError(e) && e.response?.status === 401) {
        logout()
      }
    }
  }

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos()
  }, [token, userId])

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        error,
        refreshing,
        fetchTodos,
        addTodo,
        updateTodo,
        deleteTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}

export const useTodo = () => useContext(TodoContext)
