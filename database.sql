--Created list table

CREATE TABLE list (
	id SERIAL PRIMARY KEY,
	task varchar(200) NOT NULL,
	complete BOOLEAN NOT NULL DEFAULT FALSE
);
