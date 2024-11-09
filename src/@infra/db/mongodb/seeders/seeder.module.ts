import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@src/@infra/models/user/mongoose/user.model';
import { SeedService } from './seed.service';
import { Exercise, ExerciseSchema } from '@src/@infra/models/exercise/mongoose/exercise.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Exercise.name, schema: ExerciseSchema },
    ]),
  ],
  providers: [SeedService],
})
export class SeederModule {}
