import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Register from '../../components/Users/Register';
import { renderWithProviders } from '../test-utils';
import { userService } from '../mocks/services';

// Mock the user service
vi.mock('../../services/users/userService', () => ({
  registerAPI: vi.fn()
}));

// Mock the react-router-dom hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

// Mock react-query
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useMutation: () => ({
      mutateAsync: vi.fn().mockResolvedValue({ 
        status: 'success',
        message: 'Registration successful' 
      }),
      isPending: false,
      isError: false,
      error: null,
      isSuccess: true
    })
  };
});

describe('RegistrationForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock registration response
    userService.registerAPI.mockResolvedValue({
      status: 'success',
      message: 'Registration successful'
    });
  });

  it('renders registration form correctly', () => {
    renderWithProviders(<Register />);
    
    // Check form elements
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  it('validates form inputs', async () => {
    renderWithProviders(<Register />);
    
    // Submit empty form
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
    
    // Check validation errors
    await waitFor(() => {
      expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  it('displays success message after registration', async () => {
    renderWithProviders(<Register />);
    
    // Fill form fields
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: 'password123' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/Registration success/i)).toBeInTheDocument();
    });
  });
}); 