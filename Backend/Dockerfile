FROM maven:3.9.5 AS build
WORKDIR /app
COPY . .
RUN mvn clean install -DskipTests=true
ADD target/Promact_Customer_Success-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]
EXPOSE 8081