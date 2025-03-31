import { test, expect } from 'vitest';
import app from '../src/app';

// TODO: Add more complete tests for the API routes
test("GET / should return 'greetings Welcome to the ft_transcendence API'", async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/',
  });

  expect(response.statusCode).toBe(200);
  expect(response.json()).toEqual({
    greetings: 'Welcome to the ft_transcendence API',
  });
});

test('GET /users should return 200', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/users',
  });

  expect(response.statusCode).toBe(200);
});

test('GET /profiles should return 200', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/profiles',
  });

  expect(response.statusCode).toBe(200);
});
