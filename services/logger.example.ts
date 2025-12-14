/**
 * Pino Logger Usage Examples
 * 
 * This file demonstrates how to use the global logger service
 * Import: import { log } from '@/services/logger';
 */

import { log } from '@/services/logger';

// Basic logging
log.debug('Debug message', { userId: '123', action: 'login' });
log.info('User logged in', { userId: '123', email: 'user@example.com' });
log.warn('Token expiring soon', { timeUntilExpiry: 300 });
log.success('Operation completed successfully', { operationId: 'op-123' });

// Error logging with Error object
try {
  // Some operation
  throw new Error('Something went wrong');
} catch (error) {
  log.error('Operation failed', error, { 
    operationId: 'op-123',
    userId: '123' 
  });
}

// Error logging without Error object
log.error('API call failed', undefined, { 
  endpoint: '/api/users',
  statusCode: 500 
});

// Advanced usage - direct logger access
import logger from '@/services/logger';

logger.child({ component: 'AuthService' }).info('Authentication service initialized');
logger.child({ requestId: 'req-123' }).debug('Processing request');

