Frontend Code for Authentication Flow
The authentication flow is designed using React with TypeScript. The structure is organized into various folders and files to ensure maintainability and scalability. Below is an explanation of each part of the system:

Directory Structure:
css
Copy code
src/
├── api/
│ └── auth/
│ └── authService.ts
├── components/
│ ├── AuthForm.tsx
│ └── Dashboard.tsx
├── context/
│ └── AuthContext.tsx
├── hooks/
│ └── useApplications.ts
├── pages/
│ ├── DashboardPage.tsx
│ ├── LoginPage.tsx
│ └── SignupPage.tsx
├── services/
│ └── authClient.ts
├── state/
│ ├── actions/
│ │ └── authActions.ts
│ └── reducers/
│ └── authReducer.ts
└── App.tsx
Key Components:
authService.ts (src/api/auth/authService.ts):

This file handles the API calls for user authentication. It exports functions for both login and signup processes, making POST requests to the server with user credentials and returning the user data (including tokens) on success.
AuthForm.tsx (src/components/AuthForm.tsx):

This is the main form component used for both login and signup. It handles user input, form validation, submission, and display of errors. Based on the isSignup prop, it can switch between login and signup functionality.
It uses state hooks for managing form inputs (username, password, confirmPassword, role) and displays appropriate error messages when needed.
It also integrates with context and actions to manage user login state and redirects after successful authentication.
Dashboard.tsx (src/components/Dashboard.tsx):

This component represents the user's dashboard after login. It displays the user's username and provides a button to log out.
On logout, the user's state is cleared from the context.
AuthContext.tsx (src/context/AuthContext.tsx):

This context provides a global authentication state using React.useReducer to manage login state. It holds user data in the state and provides a dispatch function to update the state.
It also ensures the app is wrapped in the AuthProvider to maintain the authentication context.
useApplications.ts (src/hooks/useApplications.ts):

This custom hook is used to fetch and manage application data, such as fetching a list of applications from the server. It uses the useState and useCallback hooks to manage state and fetch the data when necessary.
DashboardPage.tsx (src/pages/DashboardPage.tsx):

A page component that renders the Dashboard component. It is part of the authenticated routes, accessible only after login.
LoginPage.tsx (src/pages/LoginPage.tsx):

A page component that renders the AuthForm for login. This is the route the user accesses to log into their account.
SignupPage.tsx (src/pages/SignupPage.tsx):

Similar to the login page, but it renders the AuthForm for signing up a new user.
authClient.ts (src/services/authClient.ts):

This file sets up an Axios client (authClient) with default headers and request interceptors. It attaches the JWT token to every request if available, allowing for secure API calls.
authActions.ts (src/state/actions/authActions.ts):

This file defines the actions related to authentication, such as LOGIN and LOGOUT. These actions are dispatched to the reducer to manage the authentication state.
authReducer.ts (src/state/reducers/authReducer.ts):

This is the reducer function that updates the authentication state. It handles the LOGIN action by setting the user data in the state and the LOGOUT action by clearing the user data.
App.tsx (src/App.tsx):

The main component of the application. It wraps the app with the AuthProvider and sets up the router using react-router-dom to handle navigation between the login, signup, and dashboard pages.
AuthForm.css (src/components/styles/AuthForm.css):

This CSS file provides styling for the authentication form. It includes styles for the form container, inputs, buttons, error messages, and links for switching between login and signup forms.
Authentication Flow:
Login:

The user enters their credentials (username and password) on the login form.
The form sends a POST request to the server for authentication. If successful, the user's data and token are stored in the global context, and the user is redirected to the dashboard.
If the credentials are invalid, an error message is displayed.
Signup:

The user enters their details (username, password, confirm password, role) on the signup form.
The form sends a POST request to create a new account. Upon success, the user is logged in automatically and redirected to the dashboard.
Logout:

The user can log out from the dashboard by clicking the "Log Out" button, which clears the user state in the context.
