import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  private tasks: string[] = ['Learn NestJS', 'Settings TS'];

  getAllTasks(): string[] {
    return this.tasks;
  }

  addTask(task: string): string {
    this.tasks.push(task);
    return `Task "${task}" added`;
  }
}
