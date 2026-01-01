# 📡 Communication Protocols & Standards

## 📋 Overview
This document defines the communication standards, API patterns, and versioning rules for the Moscownpur application. It ensures consistent and reliable communication between all system components.

## 🎯 Protocol Goals

### Primary Objectives
- **Consistency**: Uniform communication patterns across all components
- **Reliability**: Robust error handling and retry mechanisms
- **Security**: Secure data transmission and authentication
- **Performance**: Efficient data exchange and minimal overhead
- **Maintainability**: Clear, documented, and versioned protocols

### Communication Principles
- **RESTful Design**: Standard HTTP methods and status codes
- **JSON Format**: Consistent data serialization
- **Error Handling**: Comprehensive error responses
- **Versioning**: Backward-compatible API evolution
- **Documentation**: Complete API documentation

## 🌐 API Communication Protocols

### HTTP Standards

#### Request Methods
- **GET**: Retrieve data (idempotent)
- **POST**: Create new resources
- **PUT**: Update entire resources (idempotent)
- **PATCH**: Partial resource updates
- **DELETE**: Remove resources (idempotent)

#### Status Codes
```typescript
// Success Codes
200 OK                    // Request successful
201 Created              // Resource created
204 No Content           // Successful deletion

// Client Error Codes
400 Bad Request          // Invalid request data
401 Unauthorized         // Authentication required
403 Forbidden            // Insufficient permissions
404 Not Found            // Resource not found
409 Conflict             // Resource conflict
422 Unprocessable Entity // Validation errors

// Server Error Codes
500 Internal Server Error // Server error
502 Bad Gateway          // Upstream service error
503 Service Unavailable  // Service temporarily down
```

#### Headers
```typescript
// Standard Headers
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>
User-Agent: Moscownpur/1.0.0

// Custom Headers
X-Request-ID: <uuid>
X-Client-Version: 1.0.0
X-API-Version: v1
```

### Request/Response Patterns

#### Standard Request Format
```typescript
interface APIRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  headers: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
}
```

#### Standard Response Format
```typescript
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}
```

#### Error Response Format
```typescript
interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: {
      field?: string;
      value?: any;
      constraint?: string;
    };
  };
  meta: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}
```

## 🔐 Authentication Protocols

### JWT Token Structure
```typescript
interface JWTPayload {
  sub: string;           // User ID
  email: string;         // User email
  iat: number;           // Issued at
  exp: number;           // Expiration
  role: 'user' | 'admin'; // User role
  permissions: string[];  // User permissions
}
```

### Authentication Flow
1. **Login Request**: POST /api/auth/login
2. **Token Generation**: Server creates JWT
3. **Token Response**: Client receives token
4. **Token Storage**: Client stores token securely
5. **API Requests**: Token sent in Authorization header
6. **Token Validation**: Server validates on each request
7. **Token Refresh**: Automatic token renewal

### Authorization Levels
- **Public**: No authentication required
- **User**: Valid user token required
- **Admin**: Admin role required
- **Owner**: Resource owner required

## 📊 Data Exchange Protocols

### Serialization Standards
- **Format**: JSON (JavaScript Object Notation)
- **Encoding**: UTF-8
- **Date Format**: ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
- **Boolean**: true/false (lowercase)
- **Null**: null (lowercase)

### Data Validation
```typescript
// Input Validation Rules
interface ValidationRules {
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  enum?: any[];
  custom?: (value: any) => boolean;
}
```

### Data Transformation
- **Camel Case**: Frontend uses camelCase
- **Snake Case**: Database uses snake_case
- **Automatic Conversion**: API handles transformation
- **Type Safety**: TypeScript interfaces ensure consistency

## 🔄 Real-time Communication

### WebSocket Protocol
```typescript
interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
  userId?: string;
  roomId?: string;
}
```

### Message Types
- **user_joined**: User joins collaboration
- **user_left**: User leaves collaboration
- **content_updated**: Content changes
- **cursor_moved**: Cursor position updates
- **typing_started**: User starts typing
- **typing_stopped**: User stops typing

### Connection Management
- **Heartbeat**: Keep-alive messages
- **Reconnection**: Automatic reconnection logic
- **Room Management**: Join/leave collaboration rooms
- **Message Queuing**: Offline message handling

## 🤖 AI Integration Protocols


### AI Error Handling
- **Rate Limiting**: Respect API rate limits
- **Fallback Responses**: Default responses on failure
- **Retry Logic**: Exponential backoff for retries
- **User Notification**: Clear error messages

## 📱 Client-Server Communication

### API Endpoint Patterns
```
# Resource Endpoints
GET    /api/worlds              # List worlds
POST   /api/worlds              # Create world
GET    /api/worlds/:id          # Get world
PUT    /api/worlds/:id          # Update world
DELETE /api/worlds/:id          # Delete world

# Nested Resources
GET    /api/worlds/:id/characters    # List characters
POST   /api/worlds/:id/characters    # Create character
GET    /api/characters/:id           # Get character
PUT    /api/characters/:id           # Update character
DELETE /api/characters/:id           # Delete character

# Chapter Endpoints
GET    /api/chapters              # List chapters
POST   /api/chapters              # Create chapter
GET    /api/chapters/:id          # Get chapter
PUT    /api/chapters/:id          # Update chapter
DELETE /api/chapters/:id          # Delete chapter

# Scene Endpoints
GET    /api/scenes              # List scenes
POST   /api/scenes              # Create scene
GET    /api/scenes/:id          # Get scene
PUT    /api/scenes/:id          # Update scene
DELETE /api/scenes/:id          # Delete scene

# Dialogue Endpoints
GET    /api/dialogues              # List dialogues
POST   /api/dialogues              # Create dialogue
GET    /api/dialogues/:id          # Get dialogue
PUT    /api/dialogues/:id          # Update dialogue
DELETE /api/dialogues/:id          # Delete dialogue
```

### Query Parameters
```typescript
interface QueryParams {
  page?: number;           // Pagination
  limit?: number;          // Items per page
  sort?: string;           // Sort field
  order?: 'asc' | 'desc';  // Sort order
  filter?: Record<string, any>; // Filter criteria
  search?: string;         // Search term
}
```

### Pagination Protocol
```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

## 🔄 Versioning Protocols

### API Versioning
- **URL Versioning**: /api/v1/worlds
- **Header Versioning**: X-API-Version: v1
- **Backward Compatibility**: Maintain previous versions
- **Deprecation Notice**: Advance warning for changes

### Version Lifecycle
1. **Development**: v1.0.0-alpha
2. **Beta Testing**: v1.0.0-beta
3. **Production**: v1.0.0
4. **Maintenance**: v1.0.x
5. **Deprecation**: v1.x.x (with notice)
6. **End of Life**: v2.0.0

### Breaking Changes
- **Major Version**: Incompatible changes
- **Minor Version**: New features, backward compatible
- **Patch Version**: Bug fixes, backward compatible

## 🚨 Error Handling Protocols

### Error Classification
- **Client Errors**: 4xx status codes
- **Server Errors**: 5xx status codes
- **Network Errors**: Connection issues
- **Timeout Errors**: Request timeouts

### Error Response Structure
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    stack?: string; // Development only
  };
  meta: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}
```

### Error Recovery
- **Retry Logic**: Exponential backoff
- **Fallback Data**: Default values
- **User Notification**: Clear error messages
- **Logging**: Comprehensive error logging

## 📊 Monitoring Protocols

### Metrics Collection
- **Request Count**: API call frequency
- **Response Time**: Latency measurements
- **Error Rate**: Failure percentage
- **Throughput**: Requests per second

### Health Checks
- **Liveness Probe**: Service is running
- **Readiness Probe**: Service is ready
- **Dependency Checks**: External service status
- **Performance Metrics**: System health indicators

### Logging Standards
```typescript
interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context: {
    userId?: string;
    requestId?: string;
    service: string;
    version: string;
  };
  data?: any;
}
```

## 🔧 Development Protocols

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality rules
- **Prettier**: Code formatting
- **Testing**: Comprehensive test coverage

### Documentation Standards
- **API Docs**: OpenAPI/Swagger specification
- **Code Comments**: Inline documentation
- **README Files**: Component documentation
- **Changelog**: Version change tracking

### Testing Protocols
- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user flow testing
- **Performance Tests**: Load and stress testing

## 📅 Last Updated
**January 25, 2025**

---

*This protocols document ensures consistent, reliable, and secure communication across all components of the Moscownpur application.*
