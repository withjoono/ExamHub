import { Module } from '@nestjs/common';
import { MockExamController } from './mock-exam.controller';
import { MockExamService } from './mock-exam.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MockExamController],
  providers: [MockExamService],
  exports: [MockExamService],
})
export class MockExamModule {}








