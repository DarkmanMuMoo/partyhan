FROM openjdk:11-jre
ENV JAVA_TOOL_OPTIONS -agentlib:jdwp=transport=dt_socket,address=*:8000,server=y,suspend=n


ENTRYPOINT ["java","-jar", "/usr/share/myservice/myservice.jar" ]

ARG JAR_FILE
ADD target/${JAR_FILE} /usr/share/myservice/myservice.jar