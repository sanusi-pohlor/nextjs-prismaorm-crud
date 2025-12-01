import { prisma } from './lib/prisma';

try {
    // Access a property to ensure the client is initialized
    console.log('Prisma Client instance:', prisma);
    console.log('Prisma Client successfully instantiated');
    process.exit(0);
} catch (e) {
    console.error('Failed to instantiate Prisma Client:', e);
    process.exit(1);
}
