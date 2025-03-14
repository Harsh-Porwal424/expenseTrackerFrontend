import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from '../../components/Users/Dashboard';
import { renderWithProviders } from '../test-utils';
import { transactionService } from '../mocks/services';

// Mock the transaction service
vi.mock('../../services/transactions/transactionServices', () => ({
  fetchTransactionsAPI: vi.fn()
}));

// Mock the Chart.js library
vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="mock-bar-chart" />,
  Pie: () => <div data-testid="mock-pie-chart" />,
  Line: () => <div data-testid="mock-line-chart" />,
  Doughnut: () => <div data-testid="mock-doughnut-chart" />
}));

// Mock the TransactionChart and TransactionList components
vi.mock('../../components/Transactions/TransactionChart', () => ({
  default: () => <div data-testid="transaction-chart">Transaction Chart</div>
}));

vi.mock('../../components/Transactions/TransactionList', () => ({
  default: () => <div data-testid="transaction-list">Transaction List</div>
}));

// Mock the react-query hooks
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: () => ({
      data: [
        { 
          _id: '1', 
          name: 'Groceries', 
          amount: 100, 
          type: 'expense', 
          category: { name: 'Food', type: 'expense' },
          createdAt: new Date().toISOString() 
        },
        { 
          _id: '2', 
          name: 'Monthly Salary', 
          amount: 5000, 
          type: 'income', 
          category: { name: 'Salary', type: 'income' },
          createdAt: new Date().toISOString() 
        }
      ],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn()
    })
  };
});

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock transactions response
    transactionService.fetchTransactionsAPI.mockResolvedValue([
      { 
        _id: '1', 
        name: 'Groceries', 
        amount: 100, 
        type: 'expense', 
        category: { name: 'Food', type: 'expense' },
        createdAt: new Date().toISOString() 
      },
      { 
        _id: '2', 
        name: 'Monthly Salary', 
        amount: 5000, 
        type: 'income', 
        category: { name: 'Salary', type: 'income' },
        createdAt: new Date().toISOString() 
      }
    ]);
  });

  it('renders dashboard correctly', async () => {
    renderWithProviders(<Dashboard />);
    
    // Check dashboard components
    expect(screen.getByTestId('transaction-chart')).toBeInTheDocument();
    expect(screen.getByTestId('transaction-list')).toBeInTheDocument();
  });

  it('displays transaction chart', async () => {
    renderWithProviders(<Dashboard />);
    
    // Check if chart is displayed
    expect(screen.getByText(/Transaction Chart/i)).toBeInTheDocument();
  });

  it('displays transaction list', async () => {
    renderWithProviders(<Dashboard />);
    
    // Check if transaction list is displayed
    expect(screen.getByText(/Transaction List/i)).toBeInTheDocument();
  });
}); 