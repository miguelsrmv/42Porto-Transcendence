import app from './app';
import { prisma } from './utils/prisma';

app.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening at ${address}`);
});

const shutdown = async (signal: string) => {
  app.log.info(`${signal} received: shutting down...`);
  try {
    await prisma.$disconnect();
    await app.close();
    app.log.info('Cleanup complete');
    process.exit(0);
  } catch (err) {
    app.log.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
