# Use Eclipse Temurin Java 17 as the base image
FROM eclipse-temurin:17-jdk-alpine

# Set working directory inside the container
WORKDIR /app

# Copy the Maven wrapper and pom.xml first for layer caching
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (cache layer)
RUN ./mvnw dependency:go-offline

# Copy the full source code
COPY src src

# Package the application
RUN ./mvnw clean package -DskipTests

# Expose port 8080 (Render uses this)
EXPOSE 8080

# Start the application
CMD ["java", "-jar", "target/FormNotify-0.0.1-SNAPSHOT.jar"]
