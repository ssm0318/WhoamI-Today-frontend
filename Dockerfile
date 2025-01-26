# Base image
FROM node:18-alpine as base
WORKDIR /app
COPY package*.json yarn.lock ./

# Development stage
FROM base as development
ENV NODE_ENV=development
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["yarn", "start"]

# Production build stage
FROM base as builder
# 빌드에 필요한 모든 dependencies 설치
RUN yarn install
COPY . .
RUN yarn build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000