FROM postgres:10.1
MAINTAINER William Wagner <wcw.wagner@gmail.com>
ADD ./data/amazon_book_comments.csv /amazon_book_comments.csv
ADD ./data/book_metadata.csv /book_metadata.csv
ADD ./data/comentions.csv /comentions.csv
ADD init-db.sh /docker-entrypoint-initdb.d/
