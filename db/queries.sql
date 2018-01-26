
# Top ISBNs by sheer mentions
SELECT isbn, count(url) as Mentions
FROM comments
GROUP BY isbn
ORDER BY Mentions DESC
LIMIT 25;

########################################################################################################################
# ISBNs that have no metadata
SELECT DISTINCT product_id
FROM comments c
WHERE NOT EXISTS (
    SELECT 1
    FROM products p
    WHERE c.product_id = p.id
);

########################################################################################################################
# Filters down comments to the top 3 scored comments on a per book/author basis
# this is to prevent spam, where an author keeps mentioning the same book over and over
SELECT rank_filter.isbn FROM (
    SELECT C.*,
        ROW_NUMBER() OVER (
            PARTITION BY author, isbn
            ORDER BY score DESC
        )
    FROM comments C
) rank_filter
WHERE rank_filter.row_number <= 3

########################################################################################################################
# Retrieves top books based on the number of mentions, with the spam protection as mentioned above
SELECT B.title, book_mentions.*
FROM books B
    INNER JOIN(
        SELECT comments_filter.isbn, COUNT(comments_filter.isbn) AS "Total Mentions"
        FROM (
            SELECT rank_filter.isbn FROM (
                SELECT C.*,
                    ROW_NUMBER() OVER (
                        PARTITION BY author, isbn
                        ORDER BY score DESC
                    )
                FROM comments C
            ) rank_filter
            WHERE rank_filter.row_number <= 3
        ) comments_filter
        GROUP BY comments_filter.isbn
    ) book_mentions ON B.isbn = book_mentions.isbn
 ORDER BY "Total Mentions" DESC
 LIMIT 25;

########################################################################################################################
# Gets top books by score
SELECT B.title, book_scores.*
FROM books B
    INNER JOIN (
        SELECT isbn, SUM(score) AS "Total Score", COUNT(url) AS "Number Comments"
        FROM comments
        GROUP BY isbn
    ) book_scores ON B.isbn = book_scores.isbn
ORDER BY "Total Score" DESC
LIMIT 25;
