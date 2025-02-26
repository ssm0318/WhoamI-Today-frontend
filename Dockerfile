# Base image
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install

# Development stage
FROM base AS development
ENV NODE_ENV=development
COPY . .
EXPOSE 3000
CMD ["yarn", "start"]

# Production build stage
FROM base AS builder
ENV NODE_ENV=production
COPY . .
RUN yarn build

# Production stage (정적 파일 제공용)
FROM nginx:alpine AS production

# ✅ 빌드된 파일만 복사
COPY --from=builder /app/build/ /usr/share/nginx/html/

# ✅ 포트 노출 (Nginx 기본 포트만 사용)
EXPOSE 80