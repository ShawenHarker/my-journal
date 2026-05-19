-- Migration: create_initial_tables
-- Created: 2026-05-18 14:43:34

create table users
(
    id               integer primary key autoincrement,
    name             text    not null unique,
    email            text    not null unique,
    password         text    not null,
    current_streak   integer not null,
    seven_day_streak integer not null,
    created_at       timestamp default CURRENT_TIMESTAMP
);


create table greetings
(
    id                  integer primary key autoincrement,
    time_of_day         text      not null,
    greeting            text      not null,
    created_at          timestamp    default CURRENT_TIMESTAMP
);

create table moods
(
    id                  integer primary key autoincrement,
    name                text      not null unique,
    emoji               text      not null unique,
    bg_color            text      not null,
    text_color          text      not null,
    created_at          timestamp    default CURRENT_TIMESTAMP
);

create table prompts
(
    id                  integer primary key autoincrement,
    prompt              text      not null,
    created_at          timestamp    default CURRENT_TIMESTAMP
);

create table tags (
                      id                  integer primary key autoincrement,
                      name                text      not null unique,
                      bg_color            text      not null,
                      text_color          text      not null,
                      created_at          timestamp    default CURRENT_TIMESTAMP
);

create table entry
(
    id         integer primary key autoincrement,
    user_id    integer not null REFERENCES users (id),
    mood_id    integer not null REFERENCES moods (id),
    title      text    not null,
    entry      text    not null,
    created_at timestamp default CURRENT_TIMESTAMP
);

create table entry_tags
(
    id                  integer primary key autoincrement,
    entry_id            integer not null REFERENCES entry(id),
    tag_id              integer not null REFERENCES tag(id),
    created_at          timestamp    default CURRENT_TIMESTAMP
);
