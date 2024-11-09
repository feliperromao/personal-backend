import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@src/@infra/models/user/mongoose/user.model';
import Bcrypt from '@src/@infra/encrypt/bcrypt';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Exercise } from '@src/@infra/models/exercise/mongoose/exercise.model';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Exercise.name) private exerciseModel: Model<User>,
  ) { }

  async seed(): Promise<void> {
    await this.seedUsers();
    await this.seedExercises();
    console.log("✅ database seed was completed")
  }

  private async seedUsers(): Promise<void> {
    console.log("migrating users...")
    const encrypt = new Bcrypt();
    const password = await encrypt.encrypt("personal@mail.com")
    const users = [
      {
        "_id": new ObjectId(),
        "name": "Personal",
        "email": "personal@mail.com",
        "password": password,
        "type": "PERSONAL",
        "blocked": false,
      }
    ];

    for (const user of users) {
      const existingUser = await this.userModel.findOne({ email: user.email });
      if (existingUser) {
        console.log(`🚀 ~ user already exists: ${existingUser.name}(${existingUser.email})`)
        continue;
      }
      await this.userModel.create(user);
    }
  }

  private async seedExercises(): Promise<void> {
    console.log("migrating exercises...")
    const exercises = [
      {
        "_id": new ObjectId(),
        "name": "Supino reto com alteres",
        "personal_id": "TEMPLATE",
        "instructions": "Supino reto com alteres 4x12",
        "video": "https://www.youtube.com/shorts/hlV6f0kHmeo",
        "rest": 60,
        "load": 25,
        "load_progress": true,
        "series": 4,
      },
      {
        "_id": new ObjectId(),
        "name": "Supino reto com barra",
        "personal_id": "TEMPLATE",
        "instructions": "Supino reto com barra 4x12",
        "video": "https://www.youtube.com/shorts/UHa9U-O09_U",
        "rest": 60,
        "load": 25,
        "load_progress": true,
        "series": 4,
      },
    ]

    for (const item of exercises) {
      const existing = await this.exerciseModel.findOne({name: item.name, personal_id: "TEMPLATE"})
      if (existing) {
        console.log(`🚀 ~ exercise already exists: ${item.name}`)
        continue;
      }
      await this.exerciseModel.create(item)
    }
  }
}
