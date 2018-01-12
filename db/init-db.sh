#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" "$POSTGRES_DB" <<-EOSQL
    CREATE TABLE books (
        ISBN TEXT PRIMARY KEY,
        Title TEXT NOT NULL,
        BrowseNodes TEXT NOT NULL,
        Thumbnail TEXT,
        Author TEXT
    );

    CREATE TABLE comments (
        Id serial PRIMARY KEY,
        Comment_id TEXT NOT NULL,
        Created_utc integer NOT NULL,
        Subreddit TEXT NOT NULL,
        Subreddit_id TEXT NOT NULL,
        Author TEXT NOT NULL,
        URL TEXT NOT NULL,
        ISBN TEXT NOT NULL,
        Score integer,
        Link_id TEXT NOT NULL,
        Parent_id TEXT NOT NULL,
        Body TEXT NOT NULL
    );

EOSQL
