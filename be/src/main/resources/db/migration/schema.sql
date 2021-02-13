CREATE TABLE   user_data  (
   id SERIAL PRIMARY KEY,
   email  VARCHAR(255) NOT NULL,
   password  VARCHAR(64) NOT NULL,
   create_time  timestamp NOT NULL ,
   UNIQUE KEY email (email)
  );


---- -----------------------------------------------------
---- Table  mydb . party 
---- -----------------------------------------------------
CREATE TABLE   party  (
   id SERIAL PRIMARY KEY,
   owner_id  BIGINT NOT NULL,
   name  VARCHAR(100) NOT NULL,
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

--- password 12345678

insert into user_data values (null,'user1@gmail.com'
,'$2a$10$pShG7e6TnZeumnCdPi5c5u2PjW/oHlkOOo92OFd9pIxpCrx/ATQoW'
,CURRENT_TIMESTAMP());

insert into user_data values (null,'user2@gmail.com'
,'$2a$10$pShG7e6TnZeumnCdPi5c5u2PjW/oHlkOOo92OFd9pIxpCrx/ATQoW'
,CURRENT_TIMESTAMP());


insert into party values (null,2,'Puser2-1',2);
insert into party values (null,2,'Puser2-2',5);

