-- feltételeztem hogy a staff ingyen edz, ezért külön staff és user táblát csináltam

USE gym_ACS

CREATE TABLE passType (
    id INT AUTO_INCREMENT,
    pass_type TINYTEXT NOT NULL,
    validity SMALLINT NOT NULL,
    PRIMARY KEY (id),
);

CREATE TABLE gymName (
    id INT AUTO_INCREMENT,
    gymName TINYTEXT NOT NULL,
    PRIMARY KEY (id),
);

CREATE TABLE users (
    id INT AUTO_INCREMENT,
    firstName TINYTEXT NOT NULL,
    lastName TINYTEXT NOT NULL,
    email TINYTEXT,
    phoneNumber TINYTEXT,
    PRIMARY KEY (id),
);

CREATE TABLE passes (
    id INT AUTO_INCREMENT,
    userID INT NOT NULL,
    passID INT NOT NULL,
    gymID INT NOT NULL,
    passNumber int NOT NULL,
    dateOfBuying DATE,
    PRIMARY KEY (id),
    FOREIGN KEY (userID) REFERENCES users(id),
    FOREIGN KEY (passID) REFERENCES passType(id),
    FOREIGN KEY (gymID) REFERENCES gymName(id)
);

--https://www.airops.com/sql-guide/how-to-add-days-to-date-in-sql  (szám hozzáadása dátomhoz)

CREATE TABLE staff (
    id INT AUTO_INCREMENT,
    staffName TINYTEXT NOT NULL,
    email TINYTEXT NOT NULL,
    passwordSalt varchar(255), 
    passwordHash varchar(511),
    PRIMARY KEY (id)
);
