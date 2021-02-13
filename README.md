# Stack
- Java 11
- Kotlin
- Maven
- React
- Type-script
- Docker

## Disclaimer
   I have a little experience on react and It long time ago since i coding on front end. Due to limit timeframe  i try to focus on functionality of application over ui and style.

## How to run

This demo contain Backend service and Frontend application. I dockerize both of them and push it up in docker hub here https://hub.docker.com/repository/docker/mumoo/partyhan-fe and https://hub.docker.com/repository/docker/mumoo/partyhan

If you have docker on your machine  you can run demo by

```
    docker-compose up
```
## How to build locally

 This is how to build demo locally. Pleas note that you need to have all of tools install in your machine.

 ### Backend

 ```
   mvn clean install
 ```
 #### Frontend

 ```
   npm install && npm start

 ```
## Demo Detail

### How to browse DB

I use H2 DB which is in memmory DB  you can go to http://localhost:8081 and here is credential.
```
url=jdbc:h2:mem:test
user=admin
password=admin
```

### Sample data
I insert sample user you can use this user to login.  
```
 user=user1@gmail.com
 password=12345678
 user=user2@gmail.com
 password=12345678
```






