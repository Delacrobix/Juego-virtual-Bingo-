FROM openjdk:18-jdk-alpine
VOLUME /tmp
EXPOSE 8080
ARG JAR_FILE=target/Bingo-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} app.jar
ENTRYPOINT ["java","-Djava.security.edg=file:/dev/./urandom","-jar","/app.jar"]