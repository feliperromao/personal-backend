import { Module } from '@nestjs/common';
import { TrainingsResolver } from './trainings.resolver';
import { TrainingsService } from './trainings.service';

@Module({
  providers: [TrainingsResolver, TrainingsService]
})
export class TrainingsModule {}
