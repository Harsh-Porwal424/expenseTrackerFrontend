import { vi } from 'vitest';

// Mock user service
export const userService = {
  loginAPI: vi.fn(),
  registerAPI: vi.fn(),
  updateProfileAPI: vi.fn(),
  updatePasswordAPI: vi.fn(),
  getUserProfileAPI: vi.fn()
};

// Mock transaction service
export const transactionService = {
  createTransactionAPI: vi.fn(),
  fetchTransactionsAPI: vi.fn(),
  updateTransactionAPI: vi.fn(),
  deleteTransactionAPI: vi.fn(),
  addTransactionAPI: vi.fn()
};

// Mock category service
export const categoryService = {
  createCategoryAPI: vi.fn(),
  fetchCategoriesAPI: vi.fn(),
  updateCategoryAPI: vi.fn(),
  deleteCategoryAPI: vi.fn(),
  fetchCategoryAPI: vi.fn(),
  listCategoriesAPI: vi.fn()
}; 