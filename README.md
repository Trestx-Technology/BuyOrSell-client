This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

Infrastructure (AWS CloudFormation)

An AWS CloudFormation template is provided to provision the AWS resources needed to run this app on ECS Fargate and to host its Docker image on ECR.

- Template path: infra/cloudformation/ecr-ecs-fargate.yml

What it creates:
- ECR repository (with scan on push and simple lifecycle policy)
- ECS Cluster
- IAM roles (task execution role and task role)
- CloudWatch Logs log group
- Security group to allow ingress to the app port
- Fargate Task Definition (awsvpc, configurable CPU/memory)
- ECS Service (Fargate) in your provided subnets

Required parameters when deploying:
- RepositoryName: ECR repository name to create/use
- VpcId: Your VPC ID
- SubnetIds: Comma-separated subnet IDs (use public subnets if AssignPublicIp=ENABLED)

Common optional parameters:
- ClusterName (default: app-cluster)
- ServiceName (default: app-service)
- AppPort (default: 3000)
- DesiredCount (default: 1)
- Cpu (default: 512), Memory (default: 1024)
- ImageTag (default: latest)
- AssignPublicIp (ENABLED|DISABLED, default: ENABLED)

Example deploy command:

```bash
STACK_NAME=buy-or-sell-ecs
REGION=us-east-1

aws cloudformation deploy \
  --region "$REGION" \
  --stack-name "$STACK_NAME" \
  --template-file infra/cloudformation/ecr-ecs-fargate.yml \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    RepositoryName=buy-or-sell-client \
    ClusterName=buy-or-sell-cluster \
    ServiceName=buy-or-sell-client-svc \
    VpcId=vpc-0123456789abcdef0 \
    SubnetIds=subnet-aaa111bbb222,subnet-ccc333ddd444 \
    AssignPublicIp=ENABLED \
    AppPort=3000 \
    DesiredCount=1 \
    Cpu=512 \
    Memory=1024
```

After the stack is created:
- Push your Docker image to the created ECR repository. The included GitHub Actions workflow (.github/workflows/ecr-ecs-deploy.yml) already builds and pushes images tagged with latest and the commit SHA.
- The ECS service uses the ImageTag parameter (default latest). Ensure your task definition image tag matches what you push or update the stack with a different ImageTag to roll out.

---

## Logging

This project uses [Pino](https://getpino.io/) for structured logging across both client and server environments. The logger is configured to work seamlessly in Next.js with automatic environment detection.

### Features

- ✅ **Universal**: Works in both browser and server environments
- ✅ **Structured Logging**: JSON format in production, pretty-printed in development
- ✅ **Environment-aware**: Automatic log level configuration based on environment
- ✅ **Type-safe**: Full TypeScript support
- ✅ **Performance**: Pino is one of the fastest Node.js loggers

### Installation

The logger is already installed. If you need to reinstall:

```bash
yarn add pino pino-pretty
```

### Basic Usage

Import the logger convenience methods:

```typescript
import { log } from '@/services/logger';

// Debug logging (only in development)
log.debug('Debug message', { userId: '123', action: 'login' });

// Info logging
log.info('User logged in', { userId: '123', email: 'user@example.com' });

// Warning logging
log.warn('Token expiring soon', { timeUntilExpiry: 300 });

// Success logging
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
```

### Advanced Usage

For advanced features like child loggers with context:

```typescript
import logger from '@/services/logger';

// Create a child logger with persistent context
const authLogger = logger.child({ component: 'AuthService' });
authLogger.info('Authentication service initialized');

// Create a request-scoped logger
const requestLogger = logger.child({ requestId: 'req-123' });
requestLogger.debug('Processing request');
```

### Configuration

#### Environment Variables

Set the log level using the `NEXT_PUBLIC_LOG_LEVEL` environment variable:

```bash
# .env.local
NEXT_PUBLIC_LOG_LEVEL=debug  # Options: trace, debug, info, warn, error, fatal
```

#### Default Log Levels

- **Development**: `debug` (shows all logs)
- **Production**: `warn` (only warnings and errors)

#### Log Levels (from lowest to highest priority)

1. `trace` - Very detailed debugging information
2. `debug` - Debugging information
3. `info` - General informational messages
4. `warn` - Warning messages
5. `error` - Error messages
6. `fatal` - Fatal errors

### Best Practices

1. **Use appropriate log levels**:
   - `debug`: Detailed information for debugging
   - `info`: General information about application flow
   - `warn`: Warning messages that don't stop execution
   - `error`: Error messages that need attention

2. **Include context**:
   ```typescript
   // Good: Includes relevant context
   log.error('API call failed', error, { 
     endpoint: '/api/users',
     statusCode: 500,
     userId: '123'
   });

   // Bad: No context
   log.error('API call failed', error);
   ```

3. **Use structured data**:
   ```typescript
   // Good: Structured context object
   log.info('User action', { userId: '123', action: 'purchase', itemId: '456' });

   // Bad: String concatenation
   log.info(`User 123 purchased item 456`);
   ```

4. **Don't log sensitive information**:
   ```typescript
   // Bad: Logging sensitive data
   log.info('User login', { password: userPassword, token: accessToken });

   // Good: Logging safe data
   log.info('User login', { userId: user.id, email: user.email });
   ```

5. **Use child loggers for components**:
   ```typescript
   // Create a component-specific logger
   const componentLogger = logger.child({ component: 'ProductGallery' });
   componentLogger.debug('Gallery opened', { imageCount: 5 });
   ```

### Server vs Client Behavior

- **Server**: Logs are pretty-printed in development using `pino-pretty`, JSON format in production
- **Client**: Logs are sent to browser console with appropriate console methods (console.info, console.error, etc.)

### Example: Replacing console.log

```typescript
// Before
console.log('User logged in');
console.error('Login failed', error);

// After
import { log } from '@/services/logger';

log.info('User logged in', { userId: user.id });
log.error('Login failed', error, { email: user.email });
```

### File Location

The logger service is located at: `services/logger.ts`

For usage examples, see: `services/logger.example.ts`