# TodoApp

A complete React Native Expo application for managing todos with authentication, CRUD operations, and a responsive UI.

## Features

- User authentication with JWT tokens
- Secure token storage using Expo SecureStore
- Todo management (Create, Read, Update, Delete)
- Responsive UI that adapts to both phones and tablets
- Pull-to-refresh for data updates
- Swipe-to-delete functionality
- Error handling and user feedback
- Global state management with React Context

## Prerequisites

- Node.js (v14 or newer)
- npm or Yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac users) or Android Emulator
- Expo Go app on your physical device (optional for testing)

## Setup

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/TodoApp.git
cd TodoApp
\`\`\`

2. Install dependencies:

\`\`\`bash
yarn install
# or
npm install
\`\`\`

3. Start the development server:

\`\`\`bash
npx expo start
\`\`\`

4. Run on a simulator/emulator or scan the QR code with the Expo Go app on your device.

## Usage

### Authentication

The app uses [dummyjson.com](https://dummyjson.com) for authentication. You can use the following credentials to log in:

- Username: `kminchelle`
- Password: `0lelplR`

### Todo Management

Once logged in, you can:

- View your todos in a list
- Pull down to refresh the list
- Tap the checkbox to mark a todo as complete/incomplete
- Swipe left on a todo to delete it
- Tap the trash icon to delete a todo
- Tap the "+" button to add a new todo

## Project Structure

\`\`\`
TodoApp/
├── App.tsx                  # Main application component
├── components/              # Reusable UI components
│   ├── Button.tsx           # Custom button component
│   ├── Card.tsx             # Card container component
│   ├── ErrorBoundary.tsx    # Error handling component
│   ├── Input.tsx            # Form input component
│   ├── LoadingOverlay.tsx   # Loading indicator overlay
│   └── Toast.tsx            # Toast notification component
├── contexts/                # React Context providers
│   ├── AuthContext.tsx      # Authentication state management
│   └── TodoContext.tsx      # Todo state management
├── screens/                 # Application screens
│   ├── AddTodoScreen.tsx    # Screen for adding new todos
│   ├── LoginScreen.tsx      # Authentication screen
│   └── TodoListScreen.tsx   # Main todo list screen
├── theme/                   # Styling and theming
│   └── theme.ts             # Theme constants
└── types/                   # TypeScript type definitions
    └── Todo.ts              # Todo interface definitions
\`\`\`

## API Integration

The app integrates with the following endpoints from dummyjson.com:

- `POST /auth/login` - User authentication
- `GET /todos/user/{userId}` - Fetch user's todos
- `POST /todos/add` - Create a new todo
- `PUT /todos/{id}` - Update a todo
- `DELETE /todos/{id}` - Delete a todo

## Troubleshooting

- If you encounter network errors, check your internet connection
- If authentication fails, verify the credentials
- For any other issues, check the console logs for error messages

## License

This project is licensed under the MIT License - see the LICENSE file for details.
