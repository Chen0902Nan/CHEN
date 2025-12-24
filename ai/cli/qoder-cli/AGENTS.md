# AGENTS.md

This file provides guidance to Qoder (qoder.com) when working with code in this repository.

## Project Overview

This is a simple Python web crawler project that scrapes book information from Douban's Top 250 books list. The codebase is minimal, consisting of a single Python script.

## Commands

**Install dependencies:**
```bash
pip install -r requirements.txt
```

**Run the crawler:**
```bash
python douban_books_crawler.py
```

## Architecture

This is a single-file Python application with no complex architecture:
- `douban_books_crawler.py` - Main crawler script that fetches and parses Douban's book list using requests and BeautifulSoup
- Dependencies: `requests` for HTTP requests, `beautifulsoup4` for HTML parsing
- The script handles UTF-8 encoding explicitly for Windows console output compatibility
