import { Injectable, NotFoundException } from '@nestjs/common';
import TrainingProgressRepository from '@src/@infra/repository/training-progress/training-progress.repository';
import { USER_TYPE } from '@src/users/enum/user.type';
import { UsersService } from '@src/users/users.service';

export interface EvolutionExercise {
  id: string;
  name: string;
  executions: number;
  personal_best: number;
}

export interface EvolutionPoint {
  progress_id: string;
  training_id: string;
  training_name: string;
  executed_at: Date;
  max_load: number;
  average_load: number;
  completed_series: number;
  planned_series: number;
  loads: number[];
}

@Injectable()
export class ReportsService {
  constructor(
    private readonly repository: TrainingProgressRepository,
    private readonly usersService: UsersService,
  ) {}

  async getEvolution(
    requesterId: string,
    requesterType: USER_TYPE,
    requestedStudentId?: string,
    requestedExerciseId?: string,
  ) {
    const subject = await this.resolveSubject(requesterId, requesterType, requestedStudentId);
    const executions = await this.repository.findFinishedByExecutor(subject.id, subject.type as USER_TYPE);
    const exerciseMap = new Map<string, EvolutionExercise>();

    executions.forEach((execution) => {
      const completed = execution.completed_series || [];
      execution.exercises?.forEach((exercise) => {
        const loads = completed
          .filter((series) => series.exercise_id === exercise.id)
          .map((series) => series.load)
          .filter((load) => Number.isFinite(load));

        if (!loads.length) return;
        const current = exerciseMap.get(exercise.id);
        exerciseMap.set(exercise.id, {
          id: exercise.id,
          name: exercise.name,
          executions: (current?.executions || 0) + 1,
          personal_best: Math.max(current?.personal_best || 0, ...loads),
        });
      });
    });

    const exercises = Array.from(exerciseMap.values())
      .sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'));
    const selectedExerciseId = exerciseMap.has(requestedExerciseId)
      ? requestedExerciseId
      : exercises[0]?.id;
    const points: EvolutionPoint[] = selectedExerciseId
      ? executions.flatMap((execution) => this.toPoint(execution, selectedExerciseId))
      : [];
    const firstLoad = points[0]?.max_load ?? null;
    const currentLoad = points.at(-1)?.max_load ?? null;
    const absoluteChange = firstLoad !== null && currentLoad !== null
      ? this.round(currentLoad - firstLoad)
      : null;
    const percentageChange = firstLoad && currentLoad !== null
      ? this.round(((currentLoad - firstLoad) / firstLoad) * 100)
      : null;

    return {
      subject: { id: subject.id, name: subject.name, type: subject.type },
      exercises,
      selected_exercise_id: selectedExerciseId ?? null,
      summary: {
        initial_load: firstLoad,
        current_load: currentLoad,
        absolute_change: absoluteChange,
        percentage_change: percentageChange,
        personal_best: points.length ? Math.max(...points.map((point) => point.max_load)) : null,
        total_executions: points.length,
        total_series: points.reduce((total, point) => total + point.completed_series, 0),
      },
      points,
    };
  }

  private async resolveSubject(requesterId: string, requesterType: USER_TYPE, requestedStudentId?: string) {
    if (requesterType === USER_TYPE.STUDENT) {
      const subject = await this.findUser(requesterId);
      if (subject.type !== USER_TYPE.STUDENT) throw new NotFoundException('Usuário não encontrado');
      return subject;
    }

    if (!requestedStudentId) {
      const subject = await this.findUser(requesterId);
      if (subject.type !== USER_TYPE.PERSONAL) throw new NotFoundException('Usuário não encontrado');
      return subject;
    }

    const student = await this.findUser(requestedStudentId);
    if (student.type !== USER_TYPE.STUDENT || student.personal_id !== requesterId) {
      throw new NotFoundException('Aluno não encontrado');
    }
    return student;
  }

  private async findUser(id: string) {
    try {
      const user = await this.usersService.findById(id);
      if (!user) throw new Error('not-found');
      return user;
    } catch {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  private toPoint(execution: any, exerciseId: string): EvolutionPoint[] {
    const exercise = execution.exercises?.find((item) => item.id === exerciseId);
    if (!exercise) return [];

    const series = (execution.completed_series || [])
      .filter((item) => item.exercise_id === exerciseId && Number.isFinite(item.load))
      .sort((left, right) => left.series - right.series);
    if (!series.length) return [];

    const loads = series.map((item) => item.load);
    return [{
      progress_id: execution._id.toString(),
      training_id: execution.training_id,
      training_name: execution.name,
      executed_at: execution.finished_at,
      max_load: Math.max(...loads),
      average_load: this.round(loads.reduce((total, load) => total + load, 0) / loads.length),
      completed_series: series.length,
      planned_series: exercise.series,
      loads,
    }];
  }

  private round(value: number) {
    return Math.round(value * 10) / 10;
  }
}
