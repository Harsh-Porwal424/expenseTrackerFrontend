import { describe, it, expect, beforeEach, vi } from 'vitest';
import authReducer, { loginAction, logoutAction } from '../../redux/slice/authSlice';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Auth Slice', () => {
  const testUser = { id: '1', email: 'test@example.com', name: 'Test User' };
  
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: undefined })).toEqual({
      user: null
    });
  });

  it('should handle login', () => {
    const previousState = { user: null };
    expect(authReducer(previousState, loginAction(testUser))).toEqual({
      user: testUser
    });
  });

  it('should handle logout', () => {
    const previousState = { user: testUser };
    expect(authReducer(previousState, logoutAction())).toEqual({
      user: null
    });
  });
}); 