import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

const protocol = process.env.MONGODB_PROTOCOL || 'mongodb';
const host = process.env.MONGODB_HOST;
const port = process.env.MONGODB_PORT;
const name = process.env.MONGODB_NAME || 'personal';
const user = process.env.MONGODB_USER;
const pwd = process.env.MONGODB_PWD;
const atlasUri = process.env.MONGODB_URI;

function createLegacyMongoUri(): string {
  if (!host) {
    throw new Error(
      'MongoDB is not configured. Set MONGODB_URI or the legacy MONGODB_HOST variables.',
    );
  }

  const credentials =
    user && pwd
      ? `${encodeURIComponent(user)}:${encodeURIComponent(pwd)}@`
      : '';
  const portSegment = port ? `:${port}` : '';

  return `${protocol}://${credentials}${host}${portSegment}`;
}

const mongoUri = atlasUri || createLegacyMongoUri();
const mongoOptions: MongooseModuleOptions = {
  dbName: name,
  connectionFactory: (connection) => {
    connection.on('connected', () => {
      console.log('MongoDB connected');
    });
    connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });
    connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    return connection;
  },
};

// Keep compatibility with the existing local Docker Compose configuration.
if (!atlasUri && user && pwd) {
  mongoOptions.auth = {
    username: user,
    password: pwd,
  };
}

console.log(
  `🚀 ~ connecting to MongoDB using ${atlasUri ? 'MONGODB_URI' : `${protocol}://${host}`}`,
);

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri, mongoOptions),
  ],
})
export class MongodbModule {}
