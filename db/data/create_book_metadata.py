import csv
import json
import time
import traceback
import random
import os
from bottlenose import Amazon
from bs4 import BeautifulSoup
from itertools import islice, chain
from urllib.error import HTTPError, URLError


def error_handler(err):
    """ returns true to tell client to retry the request, using exponential backoff schedule """
    ex = err['exception']
    if isinstance(ex, HTTPError) and ex.code == 503:
        time.sleep(random.expovariate(0.1))
        return True


AMAZON_PAAPI_ACCESS_KEY = os.environ['AMAZON_PAAPI_ACCESS_KEY']
AMAZON_PAAPI_SECRET_KEY = os.environ['AMAZON_PAAPI_SECRET_KEY']
AMAZON_ASSOCIATE_TAG = os.environ['AMAZON_ASSOCIATE_TAG']


# client to the Amazon Product Advertising API
AMZN = Amazon(AMAZON_PAAPI_ACCESS_KEY, AMAZON_PAAPI_SECRET_KEY, AMAZON_ASSOCIATE_TAG,
              Parser=lambda text: BeautifulSoup(text, 'xml'),
              ErrorHandler=error_handler)

DATA_FIELDS = ['ISBN', 'Title', 'Author', 'BrowseNodes', 'Thumbnail', 'EditorialReview']


# https://docs.aws.amazon.com/AWSECommerceService/latest/DG/CHAP_ResponseGroupsList.html
DEFAULT_RESPONSE_GROUPS = ['ItemAttributes', 'BrowseNodes', 'Images', 'EditorialReview']


def chunk_iterator(iterable, size=10):
    iterator = iter(iterable)
    for first in iterator:
        yield chain([first], islice(iterator, size - 1))


def _lookup_items(item_ids, response_groups=DEFAULT_RESPONSE_GROUPS):
    """ Lookup via Amazon Product Advertising API and return DATA"""
    if len(item_ids) > 10:
        raise ValueError('len(item_ids) must be no more than 10')
    if not response_groups:
        raise ValueError('must provide at least 1 response group')
    try:
        resp = AMZN.ItemLookup(ItemId=','.join(item_ids), ResponseGroup=','.join(response_groups))
        is_valid_tag = resp.find('IsValid')
        assert(is_valid_tag and is_valid_tag.get_text() == 'True')
        return resp
    except (HTTPError, URLError, AssertionError) as e:
        print(f'Could not lookup item_ids: {",".join(item_ids)}')
        print(e)


def _build_path(root):
    """
    Simple DFS into the nested browse node hierarchy.
    Returns an array of the names in the path
    e.g. ['Books', 'Subjects', 'Sports & Outdoors', 'Training']
    """
    cur = root
    path = []
    while cur:
        name = cur.find('Name').get_text()
        path.append(name)
        ancestors = cur.find('Ancestors')
        if not ancestors:
            break
        cur = ancestors.find('BrowseNode')
    return path[::-1]


def build_browse_node_paths(browse_nodes_xml):
    """
    Get the browse node path(s) for the product,
    e.g. Books->Subjects->Health, Fitness & Dieting->Exercise & Fitness->Weight Training
         Books->Subjects->Sports & Outdoors->Training
    See https://docs.aws.amazon.com/AWSECommerceService/latest/DG/RG_BrowseNodes.html for more

    Returns a string representation of a list, where each list element is another list representing the node path
    """
    # recursive  to only get direct children
    browse_node_roots = browse_nodes_xml.find_all('BrowseNode', recursive=False)
    paths = []
    for root in browse_node_roots:
        node_path = _build_path(root)
        paths.append(node_path)
    # serialize these paths to strings, inorder to be put into csv and database
    return json.dumps(paths)


def build_dict(item_xml):
    """
    Builds a dict of the DATA_FIELDS from the item xml
    """
    item_attrs_xml = item_xml.find('ItemAttributes')
    browse_nodes_xml = item_xml.find('BrowseNodes')
    return {
        'ISBN': item_xml.find('ASIN').get_text(),
        'Title': item_attrs_xml.find('Title').get_text(),
        'Author': item_attrs_xml.find('Author').get_text() if item_attrs_xml.find('Author') else None,
        'BrowseNodes': build_browse_node_paths(browse_nodes_xml),
        'Thumbnail': item_xml.find('LargeImage').find('URL').get_text(),
        'EditorialReview': item_xml.find('EditorialReview').get_text() if item_xml.find('EditorialReview') else '',
    }


def build_drows(xml_resp):
    """
    Builds array of dictionaries, each dict corresponding to a row in the CSV, where each row
    is the DATA for a book (ISBN)
    """
    items_xml_arr = xml_resp.find('Items').find_all('Item', recursive=False)  # only get direct child Items
    drows = []  # array of dictionaries
    for item_xml in items_xml_arr:
        try:
            drow = build_dict(item_xml)
            drows.append(drow)
        except AttributeError as e:
            asin_xml = item_xml.find('ASIN').get_text()
            print(f"Coulnd't parse ISBN: {asin_xml}")
            traceback.print_exc()
    return drows


def main():
    """ Reads from the list of isbns and gathers DATA of the isbn via the Amazon Product Advertising API"""
    with open('book_metadata.csv', 'w+') as wf:
        with open('isbns.txt') as rf:
            csv_dwriter = csv.DictWriter(wf, fieldnames=DATA_FIELDS)
            for chunk in chunk_iterator(rf, size=10):
                isbns = list(map(lambda l: l.rstrip(), chunk))
                xml_resp = _lookup_items(isbns)
                if not xml_resp:
                    print(f'Skipping {isbns}')
                    continue
                drows = build_drows(xml_resp)
                csv_dwriter.writerows(drows)
                time.sleep(1.1)


if __name__ == '__main__':
    main()
