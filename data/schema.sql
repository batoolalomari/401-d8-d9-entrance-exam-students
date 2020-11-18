DROP character IF  EXISTS
CREATE TABLE character(
  
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(256) ,
  gender VARCHAR(256) ,
  image VARCHAR(256)  ,
  house VARCHAR(256)  


);