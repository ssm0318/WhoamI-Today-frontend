# Base image
FROM node:18-alpine as base
WORKDIR /app
COPY package*.json ./

# Development stage
FROM base as development
ENV NODE_ENV=development
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# Production stage
FROM base as production
ENV NODE_ENV=production
# 캐시 디렉토리 설정 및 정리를 한 번에 수행
RUN npm ci --only=production && \
    npm cache clean --force
COPY . .
RUN npm run build

# Nginx stage
FROM nginx:alpine
COPY --from=production /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000 