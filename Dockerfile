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

# Production stage
FROM base as production
ENV NODE_ENV=production
RUN yarn install --frozen-lockfile --production
COPY . .
RUN yarn build
FROM nginx:alpine
COPY --from=production /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000 