# 🎣 Custom Hooks Directory

## 📋 Overview
This directory contains custom React hooks that encapsulate reusable stateful logic for the Moscownpur application. These hooks provide a clean abstraction layer for data fetching, state management, and UI interactions.

## 🏗️ Hook Architecture

### Design Principles
- **Single Responsibility**: Each hook has a focused purpose
- **Reusability**: Hooks can be used across multiple components
- **Type Safety**: Full TypeScript support with proper interfaces
- **Error Handling**: Comprehensive error management and user feedback
- **Performance**: Optimized for minimal re-renders and efficient updates

### Hook Categories
- **Data Management**: CRUD operations for entities (worlds, characters, etc.)
- **UI State**: Responsive design, loading states, and user interactions
- **Authentication**: User profile and admin data management
- **SEO & Analytics**: Search engine optimization and user tracking
- **Social Features**: Invite codes, connections, and user badges

## 🔧 Hook Development Patterns

### Standard Hook Structure
```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const useCustomHook = () => {
  // State management
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Data fetching
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('table_name')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setData(data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations
  const createItem = async (itemData: CreateItemData) => {
    // Implementation
  };

  const updateItem = async (id: string, updates: Partial<ItemData>) => {
    // Implementation
  };

  const deleteItem = async (id: string) => {
    // Implementation
  };

  // Effects
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Return interface
  return {
    data,
    loading,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchData
  };
};
```

### Error Handling Pattern
```typescript
const handleError = (error: any, operation: string) => {
  console.error(`Error ${operation}:`, error);
  toast.error(`Failed to ${operation}`);
  throw error;
};

const createItem = async (itemData: CreateItemData) => {
  try {
    // Implementation
    toast.success('Item created successfully! ✨');
  } catch (error) {
    handleError(error, 'create item');
  }
};
```

### Performance Optimization Pattern
```typescript
import { useCallback, useMemo } from 'react';

export const useOptimizedHook = () => {
  const [data, setData] = useState<DataType[]>([]);

  // Memoized computations
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computed: item.value * 2
    }));
  }, [data]);

  // Memoized callbacks
  const handleUpdate = useCallback((id: string, updates: Partial<DataType>) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  return {
    data: processedData,
    handleUpdate
  };
};
```


## 📊 Performance Considerations

### Optimization Strategies
- **Memoization**: Use `useMemo` and `useCallback` for expensive operations
- **Lazy Loading**: Load data only when needed
- **Debouncing**: Debounce user input for search and filtering
- **Caching**: Implement local caching for frequently accessed data

### Memory Management
- **Cleanup**: Proper cleanup of event listeners and subscriptions
- **Unmounting**: Handle component unmounting gracefully
- **Memory Leaks**: Avoid memory leaks with proper dependency arrays

## 🔒 Security Features

### Data Protection
- **User Isolation**: Users can only access their own data
- **Input Validation**: Validate all user inputs
- **SQL Injection**: Use parameterized queries
- **XSS Prevention**: Sanitize user-generated content

### Authentication
- **Token Validation**: Validate authentication tokens
- **Role-Based Access**: Implement proper authorization
- **Session Management**: Handle session expiration

## 🔗 Related Documentation

- [Components Directory](../components/Readme.md)
- [Contexts Directory](../contexts/Readme.md)
- [Types Directory](../types/index.ts)
- [System Architecture](../../System.md)

## 📅 Last Updated
**January 25, 2025**

---

*This hooks directory provides a comprehensive set of reusable, performant, and type-safe custom hooks that encapsulate complex stateful logic for the Moscownpur application.*
