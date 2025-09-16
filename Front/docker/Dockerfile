# ====== Builder ======
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json  ./
RUN npm ci --silent

COPY . .

RUN npm run build

# ====== Production image (nginx) ======
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
