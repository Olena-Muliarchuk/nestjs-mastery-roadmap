import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from './users.service';

@Injectable()
export class UsersTask {
  private readonly logger = new Logger(UsersTask.name);

  constructor(private readonly usersService: UsersService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'delete_expired_users',
    timeZone: 'Europe/Kyiv',
  })
  async handleCron() {
    this.logger.debug('Triggering Cron: delete_expired_users');

    try {
      const count = await this.usersService.deleteExpiredUsers();
      this.logger.log(`Success. Removed ${count} users.`);
    } catch (error) {
      this.logger.error('Cron Job Failed', error);
    }
  }
}
