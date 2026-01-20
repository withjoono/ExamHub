import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cookie Parser 설정 (HttpOnly Cookie 지원)
  app.use(cookieParser());

  // CORS 설정 - Cloud Run 환경 지원
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3003',
    'http://localhost:3005',
    'http://localhost:5173',
    // Firebase Hosting
    'https://examhub-app.web.app',
    'https://examhub-app.firebaseapp.com',
    // Production domains
    'https://examhub.kr',
    'https://www.examhub.kr',
    // 거북스쿨 Hub
    'https://geobukschool.kr',
    'https://www.geobukschool.kr',
  ];

  // 환경 변수로 추가 origin 허용
  if (process.env.ALLOWED_ORIGINS) {
    allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(','));
  }

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Validation Pipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('ExamHub API')
    .setDescription('ExamHub 모의고사 분석 서비스 API | 거북스쿨')
    .setVersion('1.0')
    .addTag('Health', 'Health check endpoints')
    .addTag('모의고사', '모의고사 관련 API')
    .addTag('점수', '점수 입력/조회 API')
    .addTag('대학', '대학/학과 조회 API')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Cloud Run은 PORT 환경변수 사용 (기본 8080)
  const port = process.env.PORT ?? 4003;

  // Cloud Run에서는 0.0.0.0으로 바인딩 필요
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 ExamHub Backend is running on port ${port}`);
  console.log(`📚 API Documentation: /api-docs`);
}

void bootstrap();
