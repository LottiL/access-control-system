-- feltételeztem hogy a staff ingyen edz, ezért külön staff és user táblát csináltam

USE gym_ACS

CREATE TABLE passes (
    id INT AUTO_INCREMENT,
    pass_type SMALLINT NOT NULL,
    validity SMALLINT NOT NULL,
    PRIMARY KEY (id),
);

CREATE TABLE users (
    id INT AUTO_INCREMENT,
    user TINYTEXT NOT NULL,
    cardNumber INT NOT NULL,
    gymName TINYTEXT NOT NULL,
    passTypeID TINYTEXT NOT NULL,
    dateOfBuying DATE,
    PRIMARY KEY (id),
    FOREIGN KEY (passTypeID) REFERENCES passes(id)
);

--gym namere is lehetne külön tábla esetleg?

CREATE TABLE staff (
    id INT AUTO_INCREMENT,
    staff TINYTEXT NOT NULL,
    email TINYTEXT NOT NULL,
    passwordSalt varchar(255), 
    passwordHash varchar(511),
    PRIMARY KEY (id)
);
