CREATE TABLE IF NOT EXISTS

character(

  id SERIAL PRIMARY KEY NOT NULL,
  image VARCHAR(256) ,
  name VARCHAR(256) ,
  patronus VARCHAR(256) ,
  alive BOOLEAN 

);

