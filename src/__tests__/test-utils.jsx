import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slice/authSlice';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a custom render function
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    // Automatically create a store with the preloaded state
    storeConfig = configureStore({
      reducer: { auth: authReducer },
      preloadedState
    }),
    ...renderOptions
  } = {}
) {
  // Create a new QueryClient for each test
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Turn off retries for testing
        retry: false,
      },
    },
  });

  function Wrapper({ children }) {
    return (
      <Provider store={storeConfig}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>{children}</BrowserRouter>
        </QueryClientProvider>
      </Provider>
    );
  }

  return { store: storeConfig, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Mock the localStorage
export const mockLocalStorage = () => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  return localStorageMock;
};

// Mock Authentication
export const mockAuthState = (authenticated = false) => {
  const user = authenticated 
    ? { id: '1', email: 'test@example.com', name: 'Test User' } 
    : null;
  
  return {
    auth: {
      user
    }
  };
}; 