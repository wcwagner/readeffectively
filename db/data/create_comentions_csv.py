"""
Script to parse the historical Reddit comment CSVS and count the number of times books (using Amazon urls as a proxy)
are mentioned together in the same comment. For reasons related to querying, comentions are mirrored in the database,
i.e. (isbn1, isbn2) and (isbn2, isbn1) will both be inserted.
This script writes these comentions to a csv, of the form:
ISBN1 (str), ISBN2 (str), FREQUENCY (int)
...
"""
import csv
import re
import os
from glob import glob
from collections import Counter
from itertools import permutations

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


def get_comentions(body):
    """
    Parses a comment body for amazon book urls, return all comentions
    Note: comentions will be mirrored, i.e. this function will yeild (isbn1, isbn2)  AND (isbn2, isbn1)
    """
    isbns = set(isbn for _, isbn in ISBN_REGEX.findall(body))
    for isbn1, isbn2 in permutations(isbns, 2):
        yield isbn1, isbn2


def count_comentions_csv(csv_reader):
    """ for each comment in the csv, count the number of comentions  """
    header = next(csv_reader)
    index_of = {col: index for index, col in enumerate(header)}
    comention_counter = Counter()
    for line in csv_reader:
        body = line[index_of['body']]
        for isbn1, isbn2 in get_comentions(body):
            comention_counter[(isbn1, isbn2)] += 1
    return comention_counter


def main():
    """
    Reads in the all the comment csvs in `csv_directory` and builds a csv containing all the
    comention frequencies
    """
    csv_paths = sorted(glob(os.path.join('amazon', '*.csv')), key=lambda p: p.split('/'))
    with open('comentions.csv', 'w+') as wf:
        csv_writer = csv.writer(wf)
        # counter for comentions across ALL the csvs
        all_comentions_counter = Counter()
        for csv_path in csv_paths:
            with open(csv_path) as rf:
                csv_reader = csv.reader(rf)
                comentions_counter = count_comentions_csv(csv_reader)
                all_comentions_counter += comentions_counter
        for comention, freq in all_comentions_counter.items():
            isbn1, isbn2 = comention
            csv_writer.writerow([isbn1, isbn2, freq])


if __name__ == '__main__':
    main()
