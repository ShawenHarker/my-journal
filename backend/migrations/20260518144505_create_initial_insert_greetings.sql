-- Migration: create_initial_insert_greetings
-- Created: 2026-05-18 14:45:05

insert into greetings (time_of_day, greeting) values ('morning', 'Good morning, {name} — let''s start the day with a few honest words.');
insert into greetings (time_of_day, greeting) values ('morning', 'Morning, {name}. What''s on your mind before the day takes over?');
insert into greetings (time_of_day, greeting) values ('afternoon', 'Good afternoon, {name} — let''s continue the day with a few honest words.');
insert into greetings (time_of_day, greeting) values ('afternoon', 'Afternoon check-in, {name}. Pause for a moment — how are you really doing?');
insert into greetings (time_of_day, greeting) values ('evening', 'Evening, {name}. Before you wind down, let''s capture today.');
insert into greetings (time_of_day, greeting) values ('evening', 'Good evening, {name}. What''s worth remembering about today?');
