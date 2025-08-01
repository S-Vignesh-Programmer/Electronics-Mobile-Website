# Use official Maven image to build the application
FROM maven:3.9.6-eclipse-temurin-17 as builder

WORKDIR /app

COPY pom.xml .
COPY src ./src

# Package the application
RUN mvn clean package -DskipTests

# Use a smaller runtime image
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port (Spring Boot default)
EXPOSE 8080

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
