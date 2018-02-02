SQL_BOOK_BY_ISBN = (
    '''
    SELECT isbn, title, thumbnail, author, editorialReview
    FROM books
    WHERE ISBN=%(isbn)s
    '''
)

SQL_TOP_BOOKS_BY_SUBREDDIT = (
    '''
    SELECT B.title, B.thumbnail, B.isbn, "totalMentions",
          "totalScore"
    FROM books B
        INNER JOIN(
            SELECT comments_filter.isbn, COUNT(comments_filter.isbn) AS "totalMentions",
                   SUM(comments_filter.score) as "totalScore"
            FROM (
                SELECT rank_filter.isbn, rank_filter.score FROM (
                    SELECT C.*,
                        ROW_NUMBER() OVER (
                            PARTITION BY author, isbn
                            ORDER BY score DESC
                        )
                    FROM comments C
                    WHERE C.subreddit=%(subreddit)s
                ) rank_filter
                WHERE rank_filter.row_number <= 3
            ) comments_filter
            GROUP BY comments_filter.isbn
        ) book_mentions ON B.isbn = book_mentions.isbn
     ORDER BY {} DESC
     LIMIT 100;
    '''
)

SQL_TOP_COMMENTS_BY_ISBN = (
    '''
    SELECT *
    FROM Comments
    WHERE isbn=%(isbn)s
    ORDER BY score DESC
    LIMIT 25;
    '''
)



