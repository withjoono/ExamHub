import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';

@Injectable()
export class ScoreService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * 점수 저장 (upsert)
   */
  async create(createScoreDto: CreateScoreDto) {
    const { studentId, mockExamId, ...scoreData } = createScoreDto;

    // 학생 존재 확인
    const member = await this.prisma.member.findUnique({
      where: { id: studentId },
    });
    if (!member) {
      throw new NotFoundException(`학생 ID ${studentId}를 찾을 수 없습니다.`);
    }

    // 모의고사 존재 확인
    const mockExam = await this.prisma.mockExam.findUnique({
      where: { id: mockExamId },
    });
    if (!mockExam) {
      throw new NotFoundException(`모의고사 ID ${mockExamId}를 찾을 수 없습니다.`);
    }

    // 자동 계산: 표준점수 합계, 백분위 합계
    const calculatedData = this.calculateTotals(scoreData);

    // Upsert 처리
    return this.prisma.studentScore.upsert({
      where: {
        memberId_mockExamId: {
          memberId: studentId,
          mockExamId,
        },
      },
      update: {
        ...scoreData,
        ...calculatedData,
      },
      create: {
        memberId: studentId,
        mockExamId,
        ...scoreData,
        ...calculatedData,
      },
      include: {
        member: true,
        mockExam: true,
      },
    });
  }

  /**
   * 표준점수 합계 및 백분위 합계 자동 계산
   */
  private calculateTotals(scoreData: Partial<CreateScoreDto>) {
    const calculated: any = {};

    // 국수탐 표준점수 합계
    const standardScores = [
      scoreData.koreanStandard,
      scoreData.mathStandard,
      scoreData.inquiry1Standard,
      scoreData.inquiry2Standard,
    ].filter((s) => s !== undefined && s !== null) as number[];

    if (standardScores.length > 0) {
      calculated.totalStandardSum = standardScores.reduce((sum, s) => sum + s, 0);
    }

    // 국수탐 백분위 합계
    const percentiles = [
      scoreData.koreanPercentile,
      scoreData.mathPercentile,
      scoreData.inquiry1Percentile,
      scoreData.inquiry2Percentile,
    ].filter((p) => p !== undefined && p !== null) as number[];

    if (percentiles.length > 0) {
      calculated.totalPercentileSum = percentiles.reduce((sum, p) => sum + p, 0);
    }

    return calculated;
  }

  /**
   * 학생의 모든 점수 조회
   */
  async findByStudent(studentId: number) {
    return this.prisma.studentScore.findMany({
      where: { memberId: studentId },
      include: {
        mockExam: true,
      },
      orderBy: [{ mockExam: { year: 'desc' } }, { mockExam: { month: 'desc' } }],
    });
  }

  /**
   * 특정 학생의 특정 모의고사 점수 조회
   */
  async findOne(studentId: number, mockExamId: number) {
    const score = await this.prisma.studentScore.findUnique({
      where: {
        memberId_mockExamId: {
          memberId: studentId,
          mockExamId,
        },
      },
      include: {
        member: true,
        mockExam: true,
      },
    });

    if (!score) {
      throw new NotFoundException(
        `학생 ${studentId}의 모의고사 ${mockExamId} 점수를 찾을 수 없습니다.`,
      );
    }

    return score;
  }

  /**
   * 점수 ID로 조회
   */
  async findById(id: number) {
    const score = await this.prisma.studentScore.findUnique({
      where: { id },
      include: {
        member: true,
        mockExam: true,
      },
    });

    if (!score) {
      throw new NotFoundException(`점수 ID ${id}를 찾을 수 없습니다.`);
    }

    return score;
  }

  /**
   * 점수 수정
   */
  async update(id: number, updateScoreDto: UpdateScoreDto) {
    const score = await this.findById(id);

    const calculatedData = this.calculateTotals(updateScoreDto);

    return this.prisma.studentScore.update({
      where: { id },
      data: {
        ...updateScoreDto,
        ...calculatedData,
      },
      include: {
        member: true,
        mockExam: true,
      },
    });
  }

  /**
   * 점수 삭제
   */
  async remove(id: number) {
    await this.findById(id); // 존재 확인

    return this.prisma.studentScore.delete({
      where: { id },
    });
  }

  /**
   * 학생의 최근 점수 조회
   */
  async findLatestByStudent(studentId: number) {
    return this.prisma.studentScore.findFirst({
      where: { memberId: studentId },
      include: {
        mockExam: true,
      },
      orderBy: [{ mockExam: { year: 'desc' } }, { mockExam: { month: 'desc' } }],
    });
  }

  /**
   * 점수 변환표 조회 (표준점수 → 백분위/등급)
   */
  async getScoreConversion(mockExamId: number, subject: string) {
    return this.prisma.scoreConversionStandard.findMany({
      where: { mockExamId, subject },
      orderBy: { standardScore: 'desc' },
    });
  }

  /**
   * 원점수 변환표 조회 (원점수 → 표준점수)
   */
  async getRawScoreConversion(mockExamId: number, subject: string, subjectType?: string) {
    const where: any = { mockExamId, subject };
    if (subjectType) where.subjectType = subjectType;

    return this.prisma.scoreConversionRaw.findMany({
      where,
      orderBy: { standardScore: 'desc' },
    });
  }
}










