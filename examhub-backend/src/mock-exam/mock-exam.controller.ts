import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { MockExamService } from './mock-exam.service';
import { SearchMockExamDto } from './dto/search-mock-exam.dto';
import { MockExamResponseDto } from './dto/mock-exam-response.dto';
import { GradeAnswersDto, GradeResultDto } from './dto/grade-answers.dto';

@ApiTags('모의고사')
@Controller('api/mock-exams')
export class MockExamController {
  constructor(private readonly mockExamService: MockExamService) {}

  @Get()
  @ApiOperation({ summary: '모의고사 목록 조회' })
  @ApiResponse({ status: 200, description: '모의고사 목록', type: [MockExamResponseDto] })
  async findAll() {
    const data = await this.mockExamService.findAll();
    return { success: true, data };
  }

  @Get('search')
  @ApiOperation({ summary: '모의고사 검색 (연도/학년/월)' })
  @ApiQuery({ name: 'year', required: false, type: Number, description: '연도 (예: 2024)' })
  @ApiQuery({ name: 'grade', required: false, type: String, description: '학년 (H1, H2, H3)' })
  @ApiQuery({ name: 'month', required: false, type: Number, description: '시행 월 (3, 6, 9, 11 등)' })
  @ApiResponse({ status: 200, description: '검색 결과', type: [MockExamResponseDto] })
  async search(@Query() searchDto: SearchMockExamDto) {
    const data = await this.mockExamService.search(searchDto);
    return { success: true, data };
  }

  @Get('check')
  @ApiOperation({ summary: '모의고사 존재 여부 확인' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'grade', required: true, type: String })
  @ApiQuery({ name: 'month', required: true, type: Number })
  async checkExists(
    @Query('year', ParseIntPipe) year: number,
    @Query('grade') grade: string,
    @Query('month', ParseIntPipe) month: number,
  ) {
    const data = await this.mockExamService.checkExists(year, grade, month);
    return { success: true, data };
  }

  @Get('subject-areas')
  @ApiOperation({ summary: '교과 영역 목록 조회' })
  async getSubjectAreas() {
    const data = await this.mockExamService.getSubjectAreas();
    return { success: true, data };
  }

  @Get('subject-codes')
  @ApiOperation({ summary: '세부 과목 코드 목록 조회' })
  @ApiQuery({ name: 'subjectAreaId', required: false, type: Number })
  async getSubjectCodes(@Query('subjectAreaId') subjectAreaId?: number) {
    const data = await this.mockExamService.getSubjectCodes(
      subjectAreaId ? Number(subjectAreaId) : undefined,
    );
    return { success: true, data };
  }

  @Get(':id/answers')
  @ApiOperation({ summary: '모의고사 정답 조회 (과목별)' })
  @ApiQuery({ name: 'subject', required: true, type: String, description: '과목명 (국어, 수학, 영어 등)' })
  @ApiQuery({ name: 'subjectDetail', required: false, type: String, description: '세부 과목명 (화법과작문 등)' })
  async getAnswers(
    @Param('id', ParseIntPipe) id: number,
    @Query('subject') subject: string,
    @Query('subjectDetail') subjectDetail?: string,
  ) {
    const data = await this.mockExamService.getAnswers(id, subject, subjectDetail);
    return { success: true, data };
  }

  @Post('grade')
  @ApiOperation({ summary: '채점하기 - 학생 답안과 정답 비교' })
  @ApiBody({ type: GradeAnswersDto })
  @ApiResponse({ status: 200, description: '채점 결과', type: GradeResultDto })
  async gradeAnswers(@Body() gradeDto: GradeAnswersDto) {
    const data = await this.mockExamService.gradeAnswers(gradeDto);
    return { success: true, data };
  }

  @Get('code/:code')
  @ApiOperation({ summary: '모의고사 코드로 조회' })
  @ApiResponse({ status: 200, description: '모의고사 상세', type: MockExamResponseDto })
  async findByCode(@Param('code') code: string) {
    const data = await this.mockExamService.findByCode(code);
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: '모의고사 ID로 조회' })
  @ApiResponse({ status: 200, description: '모의고사 상세', type: MockExamResponseDto })
  async findById(@Param('id', ParseIntPipe) id: number) {
    const data = await this.mockExamService.findById(id);
    return { success: true, data };
  }
}

