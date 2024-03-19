# Stage 1: Build Frontend
FROM node:18 AS frontend-build
WORKDIR /usr/src/app
COPY Frontend/package*.json ./
RUN npm install
COPY Frontend ./
RUN npm run build

# Stage 2: Build Backend
FROM maven:3.9.5 AS backend-build
WORKDIR /app
COPY Backend ./
RUN mvn clean install -DskipTests=true

# Stage 3: PostgreSQL Setup
FROM postgres:latest AS postgres-setup
ENV POSTGRES_DB=Customer_Success
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=aditya

# Stage 4: Final Image
FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=backend-build /app/target/*.jar ./app.jar
COPY --from=frontend-build /usr/src/app/build ./frontend
EXPOSE 8081
CMD ["java", "-jar", "app.jar"]
