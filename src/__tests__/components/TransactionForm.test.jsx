import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TransactionForm from '../../components/Transactions/TransactionForm';
import { renderWithProviders } from '../test-utils';
import { transactionService, categoryService } from '../mocks/services';

// Mock the transaction and category services
vi.mock('../../services/transactions/transactionService', () => ({
  addTransactionAPI: vi.fn()
}));

vi.mock('../../services/category/categoryService', () => ({
  listCategoriesAPI: vi.fn()
}));

// Mock react-query
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useMutation: () => ({
      mutateAsync: vi.fn().mockResolvedValue({ message: 'Transaction created successfully' }),
      isPending: false,
      isError: false,
      error: null,
      isSuccess: true
    }),
    useQuery: () => ({
      data: [
        { _id: '1', name: 'Food', type: 'expense' },
        { _id: '2', name: 'Salary', type: 'income' }
      ],
      isError: false,
      isLoading: false,
      isFetched: true,
      error: null,
      refetch: vi.fn()
    })
  };
});

describe('TransactionForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock transaction creation response
    transactionService.addTransactionAPI = vi.fn().mockResolvedValue({
      message: 'Transaction created successfully'
    });
    
    // Mock categories response
    categoryService.listCategoriesAPI = vi.fn().mockResolvedValue([
      { _id: '1', name: 'Food', type: 'expense' },
      { _id: '2', name: 'Salary', type: 'income' }
    ]);
  });

  it('renders transaction form correctly', async () => {
    renderWithProviders(<TransactionForm />);
    
    // Check form elements
    expect(screen.getByText(/Transaction Details/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit Transaction/i)).toBeInTheDocument();
  });

  it('validates form inputs', async () => {
    renderWithProviders(<TransactionForm />);
    
    // Submit form without filling required fields
    fireEvent.click(screen.getByText(/Submit Transaction/i));
    
    // Check validation errors
    await waitFor(() => {
      expect(screen.getByText(/Transaction type is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Amount is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Category is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Date is required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    renderWithProviders(<TransactionForm />);
    
    // Fill form fields
    fireEvent.change(screen.getByLabelText(/Type/i), { target: { value: 'income' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Salary' } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Monthly salary' } });
    
    // Submit form
    fireEvent.click(screen.getByText(/Submit Transaction/i));
    
    // Check success message
    await waitFor(() => {
      expect(screen.getByText(/Transaction added successfully/i)).toBeInTheDocument();
    });
  });
}); 