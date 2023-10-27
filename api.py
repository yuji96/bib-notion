import os
import sys
from pathlib import Path

import bibtexparser
import pyperclip
from notion_client import Client

DEBUG = "-d" in sys.argv

bib = Path("./sample.bib").read_text() if DEBUG else pyperclip.paste()
parsed = bibtexparser.parse_string(bib.replace("\n", " "))

if len(parsed.failed_blocks) > 0:
    raise Exception("BibTeX parse error.")
if len(parsed.entries) == 0:
    raise Exception("No BibTeX entries found.")
if len(parsed.entries) > 1:
    raise Exception("Multiple BibTeX entries found.")
entry = parsed.entries[0]

title = entry["title"].replace("{", "").replace("}", "")
author_before = entry["author"].replace("{", "").replace("}", "")
booktitle = entry["booktitle"].replace("{", "").replace("}", "")
year = entry["year"]
url = entry["url"]

abbrev = {
    "NeurIPS": "Neural Information Processing Systems",
    "NACCL": "North American Chapter of the Association for Computational Linguistics",
}
for short, long in abbrev.items():
    if long in booktitle:
        booktitle = short
        break

# 対応表記: A_first A_last and B_last, B_first
author_after = []
for name in author_before.split(" and "):
    name = name.strip()
    if "," in name:
        last, first = name.split(", ")
        name = f"{first} {last}"
    author_after.append(name)
author_after = ", ".join(author_after[:-1]) + ", and " + author_after[-1]


notion = Client(auth=os.getenv("NOTION_TOKEN"))

notion.pages.create(
    parent={"database_id": os.getenv("DATABASE_ID")},
    properties={
        "Title": {"title": [{"text": {"content": title}}]},
        "Author(s)": {"rich_text": [{"text": {"content": author_after}}]},
        "Booktitle": {"rich_text": [{"text": {"content": booktitle}}]},
        "Year": {"number": int(year)},
        "URL": {"url": url},
    },
)
