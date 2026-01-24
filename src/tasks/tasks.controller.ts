import { Body, Controller, Get, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get() // GET /tasks
  getAll(): string[] {
    return this.tasksService.getAllTasks();
  }

  @Post()
  create(@Body('text') text: string): string {
    return this.tasksService.addTask(text);
  }
}
