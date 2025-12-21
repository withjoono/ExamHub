import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchMockExamDto } from './dto/search-mock-exam.dto';

@Injectable()
export class MockExamService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 모든 모의고사 목록 조회
   */
  async findAll() {
    return this.prisma.mockExam.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  /**
   * 학년별 모의고사 목록 조회
   */
  async findByGrade(grade: string) {
    return this.prisma.mockExam.findMany({
      where: { grade },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  /**
   * 연도/학년/월로 모의고사 검색
   */
  async search(searchDto: SearchMockExamDto) {
    const { year, grade, month } = searchDto;

    const where: any = {};
    if (year) where.year = year;
    if (grade) where.grade = grade;
    if (month) where.month = month;

    return this.prisma.mockExam.findMany({
      where,
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  /**
   * 모의고사 코드로 조회
   */
  async findByCode(code: string) {
    const mockExam = await this.prisma.mockExam.findUnique({
      where: { code },
      include: {
        questions: {
          orderBy: { questionNumber: 'asc' },
        },
      },
    });

    if (!mockExam) {
      throw new NotFoundException(`모의고사 코드 ${code}를 찾을 수 없습니다.`);
    }

    return mockExam;
  }

  /**
   * 모의고사 ID로 조회
   */
  async findById(id: number) {
    const mockExam = await this.prisma.mockExam.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { questionNumber: 'asc' },
        },
      },
    });

    if (!mockExam) {
      throw new NotFoundException(`모의고사 ID ${id}를 찾을 수 없습니다.`);
    }

    return mockExam;
  }

  /**
   * 특정 연도/학년/월에 해당하는 모의고사 존재 여부 확인
   */
  async checkExists(year: number, grade: string, month: number) {
    const mockExam = await this.prisma.mockExam.findFirst({
      where: { year, grade, month },
    });

    return {
      exists: !!mockExam,
      mockExam: mockExam || null,
    };
  }

  /**
   * 과목 영역 목록 조회
   */
  async getSubjectAreas() {
    return this.prisma.subjectArea.findMany({
      include: {
        subjectCodes: true,
      },
    });
  }

  /**
   * 세부 과목 코드 목록 조회
   */
  async getSubjectCodes(subjectAreaId?: number) {
    const where = subjectAreaId ? { subjectAreaId } : {};
    return this.prisma.subjectCode.findMany({
      where,
      include: {
        subjectArea: true,
      },
    });
  }
}








