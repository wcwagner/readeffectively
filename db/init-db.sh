#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" "$POSTGRES_DB" <<-EOSQL
    CREATE TABLE books (
        isbn TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        browseNodes TEXT NOT NULL,
        thumbnail TEXT,
        author TEXT,
        editorialReview TEXT
    );

    CREATE TABLE comments (
        id serial PRIMARY KEY,
        commentId TEXT NOT NULL,
        createdUtc integer NOT NULL,
        subreddit TEXT NOT NULL,
        subredditId TEXT NOT NULL,
        author TEXT NOT NULL,
        url TEXT NOT NULL,
        isbn TEXT NOT NULL,
        score integer,
        linkId TEXT NOT NULL,
        parentId TEXT NOT NULL,
        body TEXT NOT NULL
    );


    CREATE TABLE comentions (
     id serial PRIMARY KEY,
     isbn1 TEXT,
     isbn2 TEXT,
     frequency integer DEFAULT 0
    );


    COPY comments(commentId, createdUtc, subreddit, subredditId, author,
                  url, isbn, score, linkId, parentId, body)
    FROM '/amazon_book_comments.csv' delimiter ',' csv;

    COPY books(isbn, title, author, browseNodes, thumbnail, editorialReview)
    FROM '/book_metadata.csv' delimiter ',' csv;

    COPY comentions(isbn1, isbn2, frequency)
    FROM '/comentions.csv' delimiter ',' csv;

EOSQL
