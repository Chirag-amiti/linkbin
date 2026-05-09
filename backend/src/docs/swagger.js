import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LinkBin API',
      version: '1.0.0',
      description: 'URL shortener and paste sharing platform API',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local backend',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Health' },
      { name: 'Auth' },
      { name: 'URLs' },
      { name: 'Pastes' },
      { name: 'Dashboard' },
    ],
    paths: {
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Check API health',
          responses: {
            200: { description: 'API is running' },
          },
        },
      },
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'Chirag Raj' },
                    email: { type: 'string', example: 'chirag@example.com' },
                    password: { type: 'string', example: 'Password123' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Registration successful' },
            409: { description: 'Email already registered' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login a user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'chirag@example.com' },
                    password: { type: 'string', example: 'Password123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful' },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/api/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Current user returned' },
            401: { description: 'Authentication required' },
          },
        },
      },
      '/api/urls': {
        get: {
          tags: ['URLs'],
          summary: 'List my short URLs',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Short URLs returned' } },
        },
        post: {
          tags: ['URLs'],
          summary: 'Create a short URL',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['originalUrl'],
                  properties: {
                    originalUrl: { type: 'string', example: 'https://example.com/long/path' },
                    customAlias: { type: 'string', example: 'my-link' },
                    title: { type: 'string', example: 'Portfolio link' },
                    expiresInHours: { type: 'number', example: 24 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Short URL created' },
            409: { description: 'Alias already exists' },
          },
        },
      },
      '/api/urls/{id}': {
        get: {
          tags: ['URLs'],
          summary: 'Get one short URL',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Short URL returned' } },
        },
        patch: {
          tags: ['URLs'],
          summary: 'Update one short URL',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Short URL updated' } },
        },
        delete: {
          tags: ['URLs'],
          summary: 'Soft delete one short URL',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Short URL deleted' } },
        },
      },
      '/api/urls/{id}/analytics': {
        get: {
          tags: ['URLs'],
          summary: 'Get URL analytics',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'URL analytics returned' } },
        },
      },
      '/api/pastes': {
        get: {
          tags: ['Pastes'],
          summary: 'List my pastes',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Pastes returned' } },
        },
        post: {
          tags: ['Pastes'],
          summary: 'Create a paste',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['content'],
                  properties: {
                    title: { type: 'string', example: 'JWT error log' },
                    slug: { type: 'string', example: 'jwt-error-log' },
                    content: { type: 'string', example: 'Error: invalid token' },
                    language: { type: 'string', example: 'text' },
                    visibility: { type: 'string', enum: ['public', 'unlisted', 'private'] },
                    expiresInHours: { type: 'number', example: 48 },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Paste created' } },
        },
      },
      '/api/pastes/{id}/analytics': {
        get: {
          tags: ['Pastes'],
          summary: 'Get paste analytics',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Paste analytics returned' } },
        },
      },
      '/api/dashboard/summary': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get dashboard summary',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Dashboard summary returned' } },
        },
      },
    },
  },
  apis: [],
});
