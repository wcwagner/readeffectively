"""
Creates a csv of all amazon book mentions to be used in seeding the database
"""
import csv
import re
import os
from glob import glob

URL_REGEX = re.compile(
    'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
)
# only matches amazon standard idenfitication number
ASIN_REGEX = re.compile(
    'http[s]?::/*amazon.co.*/(B[0-9]{2}[0-9A-Z]{7}|[0-9]{9}[X0-9])'
)

ISBN_REGEX = re.compile(
    '(amazon.co.*(?:dp|o|gp|-)/([0-9]{9}[X0-9]))'
)


COLUMNS = [
    'id', 'created_utc', 'subreddit', 'subreddit_id', 'author',
    'url', 'product_id', 'score', 'link_id', 'parent_id', 'body'
]


def get_product_mentions(line, index_of):
    """
    Parses a comment body for amazon product urls and returns a list of dictionaries containing
    the fields to be written to the data csv
    """
    body = line[index_of['body']]
    matches = ISBN_REGEX.findall(body)
    rows = []
    for url, isbn in matches:
        row = {'product_id': isbn, 'url': url}
        for col in COLUMNS:
            if col in index_of:
                row[col] = line[index_of[col]]
        rows.append(row)
    return rows


def write_csv(csv_writer, csv_reader):
    """ writes all product mentions in csv_reader to the csv_writer """
    header = next(csv_reader)
    index_of = {col: index for index, col in enumerate(header)}
    for line in csv_reader:
        rows_to_add = get_product_mentions(line, index_of)
        for row_dict in rows_to_add:
            csv_writer.writerow(row_dict)


def main():
    """
    Reads in the all the comment csvs in `csv_directory` and builds a csv containing all the
    product mentions found in the comments
    """
    csv_paths = sorted(glob(os.path.join('amazon', '*.csv')), key=lambda p: p.split('/'))
    with open('amazon_book_comments.csv', 'w+') as wf:
        csv_writer = csv.DictWriter(wf, fieldnames=COLUMNS)
        for csv_path in csv_paths:
            with open(csv_path) as rf:
                csv_reader = csv.reader(rf)
                write_csv(csv_writer, csv_reader)


if __name__ == '__main__':
    main()
