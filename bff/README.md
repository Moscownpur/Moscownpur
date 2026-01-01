# 🚀 Moscownpur - Backend for Frontend (BFF)

## 📚 Overview

Welcome to the Backend for Frontend (BFF) service for the Moscownpur application. This service acts as a dedicated intermediary between the frontend client and the underlying database and services (like Supabase). Its primary purpose is to provide a secure, efficient, and tailored API for the frontend, abstracting away complex business logic and direct database interactions.

## 🏛️ Architecture

The BFF is built with a modern, robust, and scalable architecture using the following key technologies:

-   **Node.js & Express.js**: A fast, unopinionated, and minimalist web framework for Node.js, providing the foundation for our API server.
-   **TypeScript**: A strongly typed superset of JavaScript that enhances code quality, maintainability, and developer productivity.
-   **Supabase**: The backend service for database storage and authentication. The BFF communicates with Supabase using the `supabase-js` client.

### Directory Structure

The BFF codebase is organized into the following key directories:

-   `src/`: Contains the core application source code.
    -   `config/`: Configuration files, such as environment variable setup.
    -   `controllers/`: (Currently unused, but reserved for more complex business logic).
    -   `lib/`: Core libraries and service initializations (e.g., Supabase client).
    -   `middleware/`: Express middleware for handling authentication, authorization, error handling, and request logging.
    -   `routes/`: API route definitions, with each file corresponding to a specific entity (e.g., `worlds.ts`, `characters.ts`).
    -   `index.ts`: The main entry point for the BFF server, where middleware and routes are initialized.
    -   `app.ts`: (Currently unused, but could be used to separate the Express app from the server).
-   `tests/`: Contains the test suite for the BFF.
    -   `fixtures/`: Test data and fixtures.
    -   `integration/`: Integration tests for API routes, authentication, and authorization.
    -   `unit/`: Unit tests for individual functions and modules.
    -   `setup.ts`: Test environment setup and configuration.

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [npm](https://www.npmjs.com/)

### Installation

1.  **Navigate to the BFF directory**:
    ```bash
    cd bff
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

### Configuration

The BFF requires environment variables to connect to Supabase and configure JWT authentication. These are managed in the `.env` file in the root of the project, which is loaded by the BFF.

Create a `.env` file in the project root and add the following variables:

```
SUPABASE_URL=[your_supabase_url]
SUPABASE_ANON_KEY=[your_supabase_anon_key]
JWT_SECRET=[your_jwt_secret]
BFF_PORT=3001
FRONTEND_URL=http://localhost:5173
```

### Running the Server

To start the BFF server, run the following command from the `bff` directory:

```bash
npm start
```

The server will start on the port specified in your `.env` file (defaulting to `3001`).

## 🔐 Authentication and Authorization

### Authentication

The BFF uses JSON Web Tokens (JWT) for authentication.

-   **Login**: `POST /api/auth/login` - Authenticates a user and returns a JWT.
-   **Signup**: `POST /api/auth/signup` - Registers a new user.
-   **Token Verification**: All protected routes require a valid JWT to be included in the `Authorization` header as a `Bearer` token.

### Authorization

The BFF supports role-based authorization.

-   **Admin Role**: The `adminAuthMiddleware` checks if the authenticated user has `is_admin` set to `true`. This middleware is applied to routes that require administrative privileges.
-   **Example**: The `/api/worlds` route is protected by both `authMiddleware` and `adminAuthMiddleware`, meaning only authenticated admin users can access it.

## 📖 API Endpoints

The BFF exposes the following API endpoints for managing application entities. All protected routes require authentication.

### Health Check

-   `GET /api/health`: Checks the health of the BFF server. (Public)

### Authentication

-   `POST /api/auth/login`: Authenticate and receive a JWT. (Public)
-   `POST /api/auth/signup`: Register a new user. (Public)
-   `GET /api/auth/me`: Get the current authenticated user's details. (Protected)
-   `POST /api/auth/logout`: Log out the current user. (Protected)

### Worlds

-   `GET /api/worlds`: Fetch all worlds for the authenticated admin user. (Protected, Admin-only)
-   `POST /api/worlds`: Create a new world. (Protected, Admin-only)

### Characters

-   `GET /api/characters`: Fetch all characters for the authenticated user.
-   `POST /api/characters`: Create a new character.

### Chapters

-   `GET /api/chapters`: Fetch all chapters for a given world.
-   `POST /api/chapters`: Create a new chapter.

### Scenes

-   `GET /api/scenes`: Fetch all scenes for a given chapter.
-   `POST /api/scenes`: Create a new scene.

### Dialogues

-   `GET /api/dialogues`: Fetch all dialogues for a given scene.
-   `POST /api/dialogues`: Create a new dialogue.

## 🚨 Error Handling

The BFF uses a centralized error handling middleware that returns standardized JSON error responses.

**Example Error Response:**

```json
{
  "success": false,
  "error": "Route not found",
  "code": "ROUTE_NOT_FOUND",
  "timestamp": "2026-01-01T12:00:00.000Z",
  "path": "/api/nonexistent-route"
}
```

## 🧪 Testing

The BFF includes a comprehensive test suite using Jest and Supertest.

To run the tests, execute the following command from the `bff` directory:

```bash
npm test
```

The test suite covers:
-   **API Routes**: Verifying the functionality of each API endpoint.
-   **Authentication**: Ensuring that protected routes are secure.
-   **Authorization**: Verifying that admin-only routes are correctly protected.
-   **Error Handling**: Checking that the API returns consistent error responses.
