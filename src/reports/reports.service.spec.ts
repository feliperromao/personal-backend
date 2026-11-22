import { NotFoundException } from '@nestjs/common';
import { USER_TYPE } from '@src/users/enum/user.type';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  const repository = { findFinishedByExecutor: jest.fn() };
  const usersService = { findById: jest.fn() };
  let service: ReportsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ReportsService(repository as any, usersService as any);
  });

  it('builds load evolution from finished workout executions', async () => {
    usersService.findById.mockResolvedValue({ id: 'student-1', name: 'Ana', type: USER_TYPE.STUDENT, personal_id: 'personal-1' });
    repository.findFinishedByExecutor.mockResolvedValue([
      execution('progress-1', new Date('2026-10-01T10:00:00Z'), [20, 22.5]),
      execution('progress-2', new Date('2026-10-08T10:00:00Z'), [22.5, 25, 25]),
    ]);

    const report = await service.getEvolution('student-1', USER_TYPE.STUDENT, undefined, 'exercise-1');

    expect(report.subject).toEqual({ id: 'student-1', name: 'Ana', type: USER_TYPE.STUDENT });
    expect(repository.findFinishedByExecutor).toHaveBeenCalledWith('student-1', USER_TYPE.STUDENT);
    expect(report.exercises).toEqual([{ id: 'exercise-1', name: 'Supino', executions: 2, personal_best: 25 }]);
    expect(report.points.map((point) => point.max_load)).toEqual([22.5, 25]);
    expect(report.summary).toMatchObject({
      initial_load: 22.5,
      current_load: 25,
      absolute_change: 2.5,
      percentage_change: 11.1,
      personal_best: 25,
      total_executions: 2,
      total_series: 5,
    });
  });

  it('builds the personal own evolution when no student is selected', async () => {
    usersService.findById.mockResolvedValue({ id: 'personal-1', name: 'Carlos', type: USER_TYPE.PERSONAL });
    repository.findFinishedByExecutor.mockResolvedValue([
      execution('progress-1', new Date('2026-10-01T10:00:00Z'), [30, 32.5]),
    ]);

    const report = await service.getEvolution('personal-1', USER_TYPE.PERSONAL);

    expect(report.subject).toEqual({ id: 'personal-1', name: 'Carlos', type: USER_TYPE.PERSONAL });
    expect(repository.findFinishedByExecutor).toHaveBeenCalledWith('personal-1', USER_TYPE.PERSONAL);
    expect(report.summary.current_load).toBe(32.5);
  });

  it('prevents a personal from viewing another personal student', async () => {
    usersService.findById.mockResolvedValue({ id: 'student-2', name: 'Bia', type: USER_TYPE.STUDENT, personal_id: 'personal-2' });
    await expect(service.getEvolution('personal-1', USER_TYPE.PERSONAL, 'student-2')).rejects.toBeInstanceOf(NotFoundException);
  });

  function execution(id: string, finishedAt: Date, loads: number[]) {
    return {
      _id: { toString: () => id },
      training_id: 'training-1',
      name: 'Treino A',
      finished_at: finishedAt,
      exercises: [{ id: 'exercise-1', name: 'Supino', series: 3 }],
      completed_series: loads.map((load, index) => ({ exercise_id: 'exercise-1', series: index + 1, load })),
    };
  }
});
