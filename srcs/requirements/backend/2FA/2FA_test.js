// 2FA + JWT Node App (Fastify Version)

require('dotenv').config();
const Fastify = require('fastify');
const fastifyJwt = require('@fastify/jwt');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const fastifyStatic = require('@fastify/static')
const path = require('path');

const app = Fastify({ logger: true });

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'default_secret'
});

// In-memory user store: { username: { password, secret } }
const users = {};

// Register new user
app.post('/register', async (request, reply) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return reply.status(400).send({ error: 'Username and password required' });
  }

  if (users[username]) {
    return reply.status(400).send({ error: 'User already exists' });
  }

  users[username] = { password }; // No hashing for simplicity (not safe for production)
  return { message: 'Registered successfully' };
});

// Login user
app.post('/login', async (request, reply) => {
  const { username, password } = request.body;

  const user = users[username];
  if (!user || user.password !== password) {
    return reply.status(401).send({ error: 'Invalid credentials' });
  }

  return { message: 'Login successful' };
});

// Generate 2FA setup
app.get('/2fa/setup/:username', async (request, reply) => {
  const { username } = request.params;
  const user = users[username];

  if (!user) {
    return reply.status(404).send({ error: 'User not found' });
  }

  const secret = speakeasy.generateSecret({ name: `2FAApp (${username})` });
  user.secret = secret.base32;

  const qrCode = await qrcode.toDataURL(secret.otpauth_url);
  return { qrCode, secret: secret.base32 }; // NOTE: expose secret only for demo/testing
});

// Verify 2FA code and issue JWT
app.post('/2fa/verify', async (request, reply) => {
  const { username, token } = request.body;
  const user = users[username];

  if (!user || !user.secret) {
    return reply.status(400).send({ error: '2FA not setup or user not found' });
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

// JWT middleware
app.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
});

// Protected route
app.get('/protected', { preValidation: [app.authenticate] }, async (request, reply) => {
  return { message: `Hello ${request.user.username}, you have access.` };
});

// Serve static files (HTML, CSS, JS)
app.register(fastifyStatic, {
  root: path.join(__dirname, 'public'), // Path to your static files
  prefix: '/', // URL path where static files are served
});

// Define a route for the root `/` to serve the index.html
app.get('/', async (request, reply) => {
  return reply.sendFile('index.html'); // This assumes the file is located in the 'public' folder
});

// Start server
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
