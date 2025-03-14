import { screen, render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import AuthRoute from '../../components/Auth/AuthRoute';

// Mock getUserFromStorage function
vi.mock('../../utils/getUserFromStorage', () => ({
  getUserFromStorage: vi.fn()
}));

// Import the mocked function
import { getUserFromStorage } from '../../utils/getUserFromStorage';

// Create a test component to render inside AuthRoute
const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;

describe('AuthRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('redirects to login when user is not authenticated', () => {
    // Mock getUserFromStorage to return null (not authenticated)
    getUserFromStorage.mockReturnValue(null);
    
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route 
            path="/protected" 
            element={
              <AuthRoute>
                <TestComponent />
              </AuthRoute>
            } 
          />
        </Routes>
      </MemoryRouter>
    );
    
    // Should be redirected to login
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    
    // Should not see protected content
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });
  
  it('renders children when user is authenticated', () => {
    // Mock getUserFromStorage to return a token (authenticated)
    getUserFromStorage.mockReturnValue('fake-token');
    
    render(
      <BrowserRouter>
        <AuthRoute>
          <TestComponent />
        </AuthRoute>
      </BrowserRouter>
    );
    
    // Should see protected content
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
}); 