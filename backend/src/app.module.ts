import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MockExamModule } from './mock-exam/mock-exam.module';
import { ScoreModule } from './score/score.module';
import { UniversityModule } from './university/university.module';
import { AnalysisModule } from './analysis/analysis.module';
import { StatisticsModule } from './statistics/statistics.module';
import { TargetModule } from './target/target.module';
import { AdminModule } from './admin/admin.module';
import { WrongAnswerModule } from './wrong-answer/wrong-answer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    MockExamModule,
    ScoreModule,
    UniversityModule,
    AnalysisModule,
    StatisticsModule,
    TargetModule,
    AdminModule,
    WrongAnswerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
