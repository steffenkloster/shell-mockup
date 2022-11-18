FROM node:14.15.1 as dist
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM socialengine/nginx-spa:latest
COPY --from=dist /app/dist /app
RUN chmod -R 777 /app
