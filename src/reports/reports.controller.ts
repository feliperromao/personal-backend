import { Controller, Get, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@src/guards/auth.guard';
import { Roles } from '@src/guards/roles.decorator';
import { RolesGuard } from '@src/guards/roles.guard';
import { USER_TYPE } from '@src/users/enum/user.type';
import { EvolutionQueryDto } from './dtos/evolution-query.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
@Roles(USER_TYPE.STUDENT, USER_TYPE.PERSONAL)
@UseGuards(AuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('/evolution')
  async evolution(@Req() request: Request, @Query() query: EvolutionQueryDto) {
    const user = request['user'];
    return await this.reportsService.getEvolution(user.id, user.type, query.student_id, query.exercise_id);
  }
}
