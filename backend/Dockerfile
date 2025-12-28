FROM node:20-alpine

WORKDIR /app

# 의존성 설치
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# Prisma 클라이언트 생성
RUN npx prisma generate

# 애플리케이션 빌드
RUN npm run build

# 포트 노출
EXPOSE 4003

# 애플리케이션 시작
CMD ["npm", "run", "start:prod"]

