SQL_BOOK_BY_ISBN = (
    '''
    SELECT ISBN, Title, Thumbnail, Author
    FROM books
    WHERE ISBN=%(ISBN)s
    '''
)

SQL_TOP_BOOKS_BY_SUBREDDIT = (
    '''
    SELECT B.title, B.thumbnail, B.isbn, "Total Mentions",
          "Total Score"
    FROM books B
        INNER JOIN(
            SELECT comments_filter.isbn, COUNT(comments_filter.isbn) AS "Total Mentions",
                   SUM(comments_filter.score) as "Total Score"
            FROM (
                SELECT rank_filter.isbn, rank_filter.score FROM (
                    SELECT C.*,
                        ROW_NUMBER() OVER (
                            PARTITION BY author, isbn
                            ORDER BY score DESC
                        )
                    FROM comments C
                    WHERE C.subreddit=%(SUBREDDIT)s
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
    WHERE ISBN=%(ISBN)s
    ORDER BY score DESC
    LIMIT 100;
    '''
)



