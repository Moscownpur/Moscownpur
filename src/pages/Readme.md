# 📄 Pages Directory

## 📋 Overview
This directory contains all page components for the Moscownpur application, organized by access level and functionality. Pages are the top-level components that represent different routes and user experiences.

## 🏗️ Page Architecture

### Design Principles
- **Route-Based Organization**: Pages organized by access level and functionality
- **Component Composition**: Pages composed of smaller, reusable components
- **State Management**: Proper state management with hooks and context
- **Performance**: Optimized loading and rendering
- **User Experience**: Intuitive navigation and responsive design

### Page Categories
- **Public Pages**: Accessible to all users (landing, about, features)
- **Authentication Pages**: Login, signup, password recovery
- **Authenticated Pages**: User-specific content and management
- **Admin Pages**: Administrative functionality and oversight

## 🌐 Public Pages

### Landing.tsx
**Purpose**: Homepage and main entry point  
**Features**:
- Hero section with call-to-action
- Feature highlights
- User testimonials
- Pricing information
- Navigation to other pages

### About.tsx
**Purpose**: Company and product information  
**Features**:
- Company story and mission
- Team information
- Product philosophy
- Contact information

### Features.tsx
**Purpose**: Detailed feature showcase  
**Features**:
- Feature descriptions with examples
- Interactive demonstrations
- Use case scenarios
- Comparison with alternatives

### Pricing.tsx
**Purpose**: Pricing plans and subscription information  
**Features**:
- Pricing tiers and features
- Subscription management
- Payment information
- Free trial options

## 🔐 Authentication Pages

### Login.tsx
**Purpose**: User authentication  
**Features**:
- Email/password login
- Social authentication options
- Remember me functionality
- Password recovery links
- Form validation and error handling

### Signup.tsx
**Purpose**: User registration  
**Features**:
- Account creation form
- Email verification
- Terms of service acceptance
- Welcome onboarding
- Duplicate account prevention

### ForgotPassword.tsx
**Purpose**: Password recovery  
**Features**:
- Email-based password reset
- Security questions
- Account recovery options
- Success/error feedback

## 👤 Authenticated Pages


## 🔧 Page Development Patterns

### Standard Page Structure
```typescript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCustomHook } from '../../hooks/useCustomHook';

const PageName: React.FC = () => {
  // State management
  const [state, setState] = useState<StateType>(initialState);
  const { user } = useAuth();
  const { data, loading, error } = useCustomHook();

  // Effects
  useEffect(() => {
    // Page initialization logic
  }, []);

  // Event handlers
  const handleAction = () => {
    // Action logic
  };

  // Render
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="page-container">
      {/* Page content */}
    </div>
  );
};

export default PageName;
```

### Protected Page Pattern
```typescript
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { AdminProtectedRoute } from '../../components/AdminProtectedRoute';

// User-only page
const UserPage = () => (
  <ProtectedRoute>
    <PageContent />
  </ProtectedRoute>
);

// Admin-only page
const AdminPage = () => (
  <AdminProtectedRoute>
    <AdminContent />
  </AdminProtectedRoute>
);
```

### Data Loading Pattern
```typescript
const DataPage = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await dataService.fetchData();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <DataDisplay data={data} />;
};
```

## 🎨 Styling and Layout

### Page Layout Structure
```typescript
const PageLayout = ({ children, title }: PageLayoutProps) => {
  return (
    <div className="page-layout">
      <SEOHead title={title} />
      <Navbar />
      <main className="page-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};
```

### Responsive Design
```typescript
const ResponsivePage = () => {
  const { isDesktop } = useResponsive();

  return (
    <div className={`page ${isDesktop ? 'desktop' : 'mobile'}`}>
      {isDesktop ? <DesktopLayout /> : <MobileLayout />}
    </div>
  );
};
```

## 🧪 Testing Pages

### Page Testing Pattern
```typescript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

test('Dashboard renders correctly', () => {
  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );

  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
```

## 🔒 Security Features

### Route Protection
```typescript
// Protected routes
const ProtectedPage = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;

  return <PageContent />;
};
```

### Data Validation
```typescript
// Input validation
const validatePageData = (data: any): boolean => {
  return data && 
         typeof data.id === 'string' && 
         typeof data.name === 'string';
};
```

### XSS Prevention
```typescript
// Sanitize user input
const sanitizeInput = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};
```

## 🔗 Related Documentation

- [Components Directory](../components/Readme.md)
- [Hooks Directory](../hooks/Readme.md)
- [Authentication Guide](../../SECURITY.md)
- [Routing Configuration](../../ROUTING.md)

## 📅 Last Updated
**January 25, 2025**

---

*This pages directory provides a comprehensive set of well-organized, performant, and secure page components that form the user interface of the Moscownpur application.*
