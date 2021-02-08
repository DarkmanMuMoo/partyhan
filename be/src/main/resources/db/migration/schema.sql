CREATE TABLE   user_data  (
   username VARCHAR(100) NOT NULL,
   email  VARCHAR(255) NOT NULL,
   password  VARCHAR(64) NOT NULL,
   create_time  timestamp NOT NULL ,
   id SERIAL PRIMARY KEY,
   UNIQUE KEY uq1 (username),
   UNIQUE KEY email (email)
  );


---- -----------------------------------------------------
---- Table  mydb . party 
---- -----------------------------------------------------
CREATE TABLE   party  (
   id SERIAL PRIMARY KEY,
   owner_id  BIGINT NOT NULL,
   name  VARCHAR(100) NOT NULL,
   description  VARCHAR(255) NULL,
   size  INT NOT NULL,
   foreign key (owner_id) references user_data(id));

--
--
---- -----------------------------------------------------
---- Table  mydb . subscription 
---- -----------------------------------------------------
CREATE TABLE subscription  (
   user_id  INT NOT NULL,
   party_id  INT NOT NULL,
   id  INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
   foreign key (user_id) references user_data(id),
   foreign key (party_id) references party(id)
);