USE gymACS

CREATE TABLE passType (
    id INT AUTO_INCREMENT,
    name TINYTEXT NOT NULL,
    validity SMALLINT NOT NULL,
    PRIMARY KEY (id),
);

CREATE TABLE gym (
    id INT AUTO_INCREMENT,
    name TINYTEXT NOT NULL,
    PRIMARY KEY (id),
);

CREATE TABLE user (
    id INT AUTO_INCREMENT,
    firstName TINYTEXT NOT NULL,
    lastName TINYTEXT NOT NULL,
    email TINYTEXT,
    phoneNumber TINYTEXT,
    PRIMARY KEY (id),
);

CREATE TABLE pass (
    id INT AUTO_INCREMENT,
    userID INT NOT NULL,
    passTypeID INT NOT NULL,
    gymID INT NOT NULL,
    passNumber INT NOT NULL,
    dateOfBuying DATE,
    PRIMARY KEY (id),
    FOREIGN KEY (userID) REFERENCES user(id),
    FOREIGN KEY (passTypeID) REFERENCES passType(id),
    FOREIGN KEY (gymID) REFERENCES gym(id),
);

--https://www.airops.com/sql-guide/how-to-add-days-to-date-in-sql  (szám hozzáadása dátomhoz)

CREATE TABLE password (
    id INT AUTO_INCREMENT,
    userID INT NOT NULL,
    -- vagy itt elég lenne a sima id? nem lesz mindenkinek jelszava, de minden staffnak csak 1 jelszava lesz, tehát duplikáció nincs
    passwordSalt varchar(255), 
    passwordHash varchar(511),
    PRIMARY KEY (id),
    FOREIGN KEY (userID) REFERENCES user(id),
);
