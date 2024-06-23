import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

const host = process.env.MONGODB_HOST
const port = process.env.MONGODB_PORT
const name = process.env.MONGODB_NAME
const user = process.env.MONGODB_USER
const pwd = process.env.MONGODB_PWD

const MONGODB_URI = `mongodb://${host}:${port}/admin`
console.log("🚀 ~ MONGODB_URI:", MONGODB_URI)

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URI, {
      auth: {
        username: user,
        password: pwd
      },
      dbName: name
    }),
  ],
})
export class MongodbModule {}
