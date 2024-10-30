FROM openjdk:17-jdk-slim
ARG JAR_FILE=target/los_ciruelos-0.0.1.jar
COPY ${JAR_FILE} app_los_ciruelos.jar
EXPOSE 8080
ENTRYPOINT [ "java", "-jar", "app_los_ciruelos.jar" ]