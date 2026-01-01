import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('AppError', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an AppError with default status code', () => {
    const error = new Error('Test error') as any;
    error.statusCode = 500;
    error.code = 'APP_ERROR';
    error.isOperational = true;
    
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('APP_ERROR');
    expect(error.isOperational).toBe(true);
  });

  it('should create an AppError with custom status code', () => {
    const error = new Error('Not found') as any;
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    error.isOperational = true;
    
    expect(error.message).toBe('Not found');
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.isOperational).toBe(true);
  });

  it('should capture stack trace', () => {
    const error = new Error('Test error') as any;
    error.statusCode = 500;
    error.code = 'APP_ERROR';
    error.isOperational = true;
    
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('Error: Test error');
  });
});