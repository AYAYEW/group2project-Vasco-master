create database fit_darling;

create table users (
	user_id int not null auto_increment primary key,
    email varchar(255) unique not null,
    password_hash varchar(255) not null,
    display_name varchar(255),
    age int,
    profile_picture text(65535),
    created_on timestamp default current_timestamp
);

create table traits (
	traits_id int not null auto_increment primary key,
    user_id int,
    weight float,
    bmi float,
    water float,
    daily_steps float,
    foreign key (user_id) references users (user_id)
);

create table sleep (
	sleep_id int not null auto_increment primary key,
    user_id int,
    start_sleep datetime,
    end_sleep datetime,
    duration float,
    foreign key (user_id) references users (user_id)
);

create table weight_goal (
	weight_goal_id int not null auto_increment primary key,
    user_id int,
    weight_goal_message text (65535),
    weight_goal float,
    weight_goal_time date,
    foreign key (user_id) references users (user_id)
);

CREATE TABLE sleep_goal (
    sleep_goal_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    sleep_goal_message MEDIUMTEXT,
    duration_goal FLOAT,
    sleep_goal_time DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

create table steps_goal (
	steps_goal_id int not null auto_increment primary key,
    user_id int,
    steps_goal_message text(65535),
    steps_goal int,
    steps_goal_time date,
    foreign key (user_id) references users (user_id)
);

create table water_goal (
	water_goal_id int not null auto_increment primary key,
    user_id int,
    water_goal_message text(65535),
    water_goal int,
    water_goal_time date,
    foreign key (user_id) references users (user_id)
);

create table bmi_goal (
	bmi_goal_id int not null auto_increment primary key,
    user_id int,
    bmi_goal_message text(65535),
    bmi_goal float,
    bmi_goal_time date,
    foreign key (user_id) references users (user_id)
);