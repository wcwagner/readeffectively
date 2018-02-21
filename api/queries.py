SQL_BOOK_BY_ISBN = (
'''
SELECT isbn, title, thumbnail, author, editorialReview
FROM books
WHERE ISBN=%(isbn)s
'''
)

SQL_TOP_BOOKS_BY_SUBREDDIT = (
'''
SELECT books.title, top_books.*
FROM books
    INNER JOIN (
        SELECT spam_filter.isbn, COUNT(spam_filter.isbn) AS "totalMentions",
               SUM(spam_filter.score) as "totalScore"
        FROM (
            SELECT C.*,
                ROW_NUMBER() OVER (
                    PARTITION BY author, isbn
                    ORDER BY score DESC
                )
            FROM comments C
            WHERE subreddit LIKE {subreddit}
        ) spam_filter
        WHERE spam_filter.row_number <= 3
        GROUP BY spam_filter.isbn
        ORDER BY {order_by_col} DESC
        LIMIT 100
    ) top_books ON books.isbn = top_books.isbn;
'''
)


# need to limit the comments to the TOP N for each commenter
SQL_TOP_COMMENTS_BY_ISBN = (
'''
SELECT *
FROM Comments
WHERE isbn LIKE %(isbn)s AND
      subreddit LIKE {subreddit}
ORDER BY score DESC
LIMIT 25;
'''
)


SQL_TOP_COMENTIONS = (
'''
SELECT B.title, B.thumbnail, isbn2, frequency
FROM books B INNER JOIN (
    SELECT isbn2, frequency
    FROM comentions C
    WHERE isbn1=%(isbn1)s
    ORDER BY C.frequency DESC
    LIMIT 10
) topComentions ON B.isbn = topComentions.isbn2
'''
)
