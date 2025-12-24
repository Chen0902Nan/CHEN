import requests
from bs4 import BeautifulSoup
import time
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def crawl_douban_top_books(limit=10):
    url = "https://book.douban.com/top250"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        response.encoding = 'utf-8'
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        books = []
        book_items = soup.find_all('tr', class_='item')
        
        for i, item in enumerate(book_items[:limit]):
            try:
                title_elem = item.find('div', class_='pl2').find('a')
                title = title_elem.get('title', '').strip()
                
                info = item.find('p', class_='pl').text.strip()
                
                rating_elem = item.find('span', class_='rating_nums')
                rating = rating_elem.text.strip() if rating_elem else 'N/A'
                
                quote_elem = item.find('span', class_='inq')
                quote = quote_elem.text.strip() if quote_elem else ''
                
                books.append({
                    'rank': i + 1,
                    'title': title,
                    'info': info,
                    'rating': rating,
                    'quote': quote
                })
            except Exception as e:
                print(f"解析第 {i+1} 本书时出错: {e}")
                continue
        
        return books
        
    except requests.RequestException as e:
        print(f"请求失败: {e}")
        return []

if __name__ == "__main__":
    print("正在抓取豆瓣读书榜前十书籍...\n")
    
    books = crawl_douban_top_books(10)
    
    if books:
        for book in books:
            print(f"{book['rank']}. {book['title']}")
            print(f"   评分: {book['rating']}")
            print(f"   信息: {book['info']}")
            if book['quote']:
                print(f"   简介: {book['quote']}")
            print()
    else:
        print("未能获取到书籍信息")