import { test, expect } from 'vitest';
import app from '../src/app';

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
