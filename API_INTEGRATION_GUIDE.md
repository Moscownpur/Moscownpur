# 🔌 BFF API Integration Guide

## 📚 Overview
This guide provides comprehensive instructions and best practices for integrating frontend applications with the Backend for Frontend (BFF) API. It covers authentication, making API requests, handling responses, and integrating with specific entity endpoints.

## 🚀 Getting Started

### BFF Base URL
The BFF API is accessible via the base URL, which is configured using environment variables.
- **Development**: `http://localhost:3001/api`
- **Production**: `[Your Production BFF URL]/api`

Ensure your frontend environment variable `VITE_BFF_URL` is set correctly.

### Authentication
The BFF uses JWT (JSON Web Tokens) for authentication.

1.  **Login/Signup**:
    - Use `POST /api/auth/login` or `POST /api/auth/signup` to obtain a JWT.
    - The response will include a `token` field.

2.  **Storing the Token**:
    - Store the received JWT securely, typically in `localStorage` or `sessionStorage`. The `bffClient` utility (see below) handles this automatically.

3.  **Sending Authenticated Requests**:
    - Include the token in the `Authorization` header of all protected requests: `Authorization: Bearer <your_jwt_token>`.

### Error Handling
The BFF returns standardized error responses. Always check the `success` field in the response.

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string; // Custom error code (e.g., 'TOKEN_REQUIRED', 'NAME_REQUIRED')
  message?: string;
  timestamp?: string;
}
```

## 🛠️ BFF Client Utility (`src/lib/bffClient.ts`)
The `src/lib/bffClient.ts` file provides a convenient client for interacting with the BFF API. It handles token management, request headers, and standardized response parsing.

### Initialization
```typescript
import { bffClient } from './lib/bffClient';

// No explicit initialization needed, the client is a singleton.
// It automatically loads/saves tokens from localStorage.
```

### Authentication Examples
```typescript
import { bffClient } from './lib/bffClient';

// Login
const loginResponse = await bffClient.login('user@example.com', 'password123');
if (loginResponse.success) {
  console.log('Logged in successfully', loginResponse.data.user);
} else {
  console.error('Login failed', loginResponse.error);
}

// Get Current User
const userResponse = await bffClient.getCurrentUser();
if (userResponse.success) {
  console.log('Current user', userResponse.data);
} else {
  console.error('Failed to get user', userResponse.error);
}

// Logout
await bffClient.logout();
console.log('Logged out');
```

### Entity Endpoints Integration

#### Worlds
- **`bffClient.getWorlds()`**: Fetch all worlds for the authenticated user.
- **`bffClient.createWorld(worldData)`**: Create a new world.
- **`bffClient.updateWorld(id, worldData)`**: Update an existing world.
- **`bffClient.deleteWorld(id)`**: Delete a world.

#### Characters
- **`bffClient.getCharacters(worldId?)`**: Fetch characters. Can filter by `worldId`.
- **`bffClient.createCharacter(characterData)`**: Create a new character.
- **`bffClient.updateCharacter(id, characterData)`**: Update an existing character.
- **`bffClient.deleteCharacter(id)`**: Delete a character.

#### Chapters
- **`bffClient.getChapters(worldId?)`**: Fetch chapters. Can filter by `worldId`.
- **`bffClient.createChapter(chapterData)`**: Create a new chapter.
- **`bffClient.updateChapter(id, chapterData)`**: Update an existing chapter.
- **`bffClient.deleteChapter(id)`**: Delete a chapter.

#### Scenes
- **`bffClient.getScenes(chapterId?)`**: Fetch scenes. Can filter by `chapterId`.
- **`bffClient.createScene(sceneData)`**: Create a new scene.
- **`bffClient.updateScene(id, sceneData)`**: Update an existing scene.
- **`bffClient.deleteScene(id)`**: Delete a scene.

#### Dialogues
- **`bffClient.getDialogues(sceneId?)`**: Fetch dialogues. Can filter by `sceneId`.
- **`bffClient.createDialogue(dialogueData)`**: Create a new dialogue.
- **`bffClient.updateDialogue(id, dialogueData)`**: Update an existing dialogue.
- **`bffClient.deleteDialogue(id)`**: Delete a dialogue.

## 💡 Best Practices
-   **Always use `bffClient`**: Leverage the `bffClient` utility for all BFF interactions to ensure consistent authentication and error handling.
-   **Handle loading and error states**: Implement proper UI feedback for API calls (e.g., loading spinners, error messages).
-   **Environment variables**: Use `VITE_BFF_URL` to configure the BFF base URL across different environments.
-   **Authorization**: Be mindful of authorization levels (user vs. admin) when making requests, especially for routes protected by `adminAuthMiddleware`.

## 📅 Last Updated
**January 1, 2026**
