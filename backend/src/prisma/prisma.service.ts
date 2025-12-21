import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // PostgreSQL 연결 풀 생성
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({
      adapter,
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('cleanDatabase is not allowed in production');
    }

    // 개발/테스트 환경에서 모든 테이블 초기화 (외래키 순서 고려)
    // 삭제 순서: 외래키 참조가 있는 테이블부터 삭제
    await this.achievementResult.deleteMany();
    await this.studentTarget.deleteMany();
    await this.studentScore.deleteMany();
    await this.examQuestion.deleteMany();
    await this.admissionCutoff.deleteMany();
    await this.scoreConversionStandard.deleteMany();
    await this.scoreConversionRaw.deleteMany();
    await this.department.deleteMany();
    await this.university.deleteMany();
    await this.subjectChapter.deleteMany();
    await this.subjectCode.deleteMany();
    await this.subjectArea.deleteMany();
    await this.mockExam.deleteMany();
    await this.mentoring.deleteMany();
    await this.student.deleteMany();
  }
}
