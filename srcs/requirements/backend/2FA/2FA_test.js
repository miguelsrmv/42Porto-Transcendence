// 2fa Jwt Node App (Fastify Version)

require('dotenv').config();
const Fastify = require('fastify');
const fastifyJwt = require('@fastify/jwt');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const app = Fastify({ logger: true });

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'default_secret'
});

const users = {}; // In-memory user store

// Generate 2FA setup
app.get('/2fa/setup/:username', async (request, reply) => {
  const { username } = request.params;

  const secret = speakeasy.generateSecret({ name: `2FAApp (${username})` });
  users[username] = { secret: secret.base32 };

  const qrCode = await qrcode.toDataURL(secret.otpauth_url);
  return { qrCode, secret: secret.base32 };
});

// Verify 2FA code and issue JWT
app.post('/2fa/verify', async (request, reply) => {
  const { username, token } = request.body;

  const user = users[username];
  if (!user) {
    return reply.status(400).send({ error: 'User not found' });
  }

  const verified = speakeasy.totp.verify({
    secret: user.secret,
    encoding: 'base32',
    token
  });

  if (!verified) {
    return reply.status(401).send({ error: 'Invalid token' });
  }

  const jwt = app.jwt.sign({ username });
  return { jwt };
});

// Middleware for protected routes
app.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// Protected route
app.get('/protected', { preValidation: [app.authenticate] }, async (request, reply) => {
  return { message: `Hello ${request.user.username}, you have access.` };
});

const start = async () => {
  try {
    await app.listen({ port: process.env.PORT || 3000 });
    console.log(`2FA + JWT server running on http://localhost:${process.env.PORT || 3000}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

