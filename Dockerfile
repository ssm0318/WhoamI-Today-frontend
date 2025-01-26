# Base image
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json yarn.lock ./

# Development stage
FROM base AS development
ENV NODE_ENV=development
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["yarn", "start"]

# Production build stage
FROM base AS builder
RUN yarn install
COPY . .
RUN yarn build

# Production stage
FROM nginx:alpine AS production
# SSL 인증서 파일을 위한 디렉토리 생성
RUN mkdir -p /etc/nginx/ssl
# Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 빌드된 파일 복사
COPY --from=builder /app/build /usr/share/nginx/html
# SSL 인증서 파일을 위한 볼륨 마운트 포인트
VOLUME ["/etc/letsencrypt"]
EXPOSE 80 443