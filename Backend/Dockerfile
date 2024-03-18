# FROM maven:3.9.5 AS build
# WORKDIR /app
# COPY . .
# RUN mvn clean install -DskipTests=true
# ADD target/Promact_Customer_Success-0.0.1-SNAPSHOT.jar app.jar
# ENTRYPOINT ["java","-jar","app.jar"]
# EXPOSE 8081

FROM maven:3.9.5 AS builder

WORKDIR /app
COPY . .
RUN mvn clean install -DskipTests=true
RUN openssl req -newkey rsa:2048 -nodes -keyout key.pem -x509 -days 365 -out certificate.pem

FROM maven:3.9.5
WORKDIR /app
COPY --from=builder /app/target/Promact_Customer_Success-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","app.jar"]
