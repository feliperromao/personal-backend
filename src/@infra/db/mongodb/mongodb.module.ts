import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

const protocol = process.env.MONGODB_PROTOCOL || 'mongodb';
const host = process.env.MONGODB_HOST;
const port = process.env.MONGODB_PORT;
const name = process.env.MONGODB_NAME;
const user = process.env.MONGODB_USER;
const pwd = process.env.MONGODB_PWD;
const MONGODB_URI = `${protocol}://${user}:${pwd}@${host}:${port}`

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URI, {
      auth: {
        username: user,
        password: pwd,
      },
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
    }),
  ],
})
export class MongodbModule {}
