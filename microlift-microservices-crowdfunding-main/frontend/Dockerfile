# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Run stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Custom nginx config to handle React Router
RUN printf 'server {\n\tlisten 80;\n\tlocation / {\n\t\troot /usr/share/nginx/html;\n\t\tindex index.html index.htm;\n\t\ttry_files $uri $uri/ /index.html;\n\t}\n}' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
