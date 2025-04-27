"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import * as SecureStore from "expo-secure-store"
import axios from "axios"

// Define the shape of our authentication context
interface AuthContextType {
  token: string | null
  userId: string | null
  loading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  token: null,
  userId: null,
  loading: false,
  error: null,
  login: async () => {},
  logout: async () => {},
})

// Keys for secure storage
const TOKEN_KEY = "auth_token"
const USER_ID_KEY = "user_id"

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Check for existing token on mount
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY)
        const storedUserId = await SecureStore.getItemAsync(USER_ID_KEY)

        if (storedToken && storedUserId) {
          setToken(storedToken)
          setUserId(storedUserId)
        }
      } catch (e) {
        console.error("Failed to load auth token", e)
      } finally {
        setLoading(false)
      }
    }

    loadToken()
  }, [])

  // Login function
  const login = async (username: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      console.log("Attempting login with:", { username, password })
      
      const response = await axios.post(
        "https://dummyjson.com/auth/login",
        JSON.stringify({
          username,
          password,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      console.log("Raw login response:", response.data)

      // Extract the required fields from the response
      const id = response.data.id
      const accessToken = response.data.accessToken

      console.log("Extracted values:", { id, accessToken })

      if (!id || !accessToken) {
        console.error("Missing required fields in response:", {
          id: id,
          accessToken: accessToken,
          fullResponse: response.data
        })
        throw new Error("Invalid response from server: Missing required fields")
      }

      // Ensure we're storing strings in SecureStore
      const userIdString = String(id)
      const tokenString = String(accessToken)

      console.log("Storing values:", {
        userIdString,
        tokenString,
        userIdType: typeof userIdString,
        tokenType: typeof tokenString,
      })

      // Store in secure storage
      await SecureStore.setItemAsync(TOKEN_KEY, tokenString)
      await SecureStore.setItemAsync(USER_ID_KEY, userIdString)

      // Update state
      setToken(tokenString)
      setUserId(userIdString)
    } catch (e) {
      console.error("Login failed with error:", e)
      if (axios.isAxiosError(e)) {
        console.error("Axios error details:", {
          status: e.response?.status,
          data: e.response?.data,
          headers: e.response?.headers
        })
        if (e.response?.status === 400) {
          setError("Invalid username or password. Please try again.")
        } else if (e.response?.status === 404) {
          setError("Server not found. Please try again later.")
        } else if (e.response?.status === 500) {
          setError("Server error. Please try again later.")
        } else {
          setError("Login failed. Please try again later.")
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
      throw e
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    setLoading(true)

    try {
      // Clear secure storage
      await SecureStore.deleteItemAsync(TOKEN_KEY)
      await SecureStore.deleteItemAsync(USER_ID_KEY)

      // Clear state
      setToken(null)
      setUserId(null)
    } catch (e) {
      console.error("Logout failed", e)
      setError("Failed to logout. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        loading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext)
