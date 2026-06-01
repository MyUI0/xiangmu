from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime, timedelta
import os

app = Flask(__name__)
CORS(app)

DATABASE = 'blog.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            category TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'draft',
            views INTEGER DEFAULT 0,
            comments INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('SELECT COUNT(*) FROM articles')
    if cursor.fetchone()[0] == 0:
        sample_articles = [
            ('如何学习 Python 编程', '这是一篇关于 Python 学习的文章...', '技术', 'published', 1250, 23),
            ('React Hooks 深入解析', '探索 React Hooks 的使用方法...', '技术', 'published', 890, 15),
            ('我的 2024 年计划', '新的一年，新的开始...', '生活', 'draft', 0, 0),
            ('UI 设计原则与实践', '分享一些 UI 设计的心得...', '设计', 'published', 567, 8),
            ('Flask 入门指南', '从零开始学习 Flask...', '技术', 'published', 789, 12),
        ]
        
        for article in sample_articles:
            cursor.execute('''
                INSERT INTO articles (title, content, category, status, views, comments)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', article)
    
    conn.commit()
    conn.close()

@app.route('/api/articles', methods=['GET'])
def get_articles():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM articles ORDER BY updated_at DESC')
    articles = cursor.fetchall()
    conn.close()
    return jsonify([dict(article) for article in articles])

@app.route('/api/articles/<int:id>', methods=['GET'])
def get_article(id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM articles WHERE id = ?', (id,))
    article = cursor.fetchone()
    conn.close()
    if article:
        return jsonify(dict(article))
    return jsonify({'error': 'Article not found'}), 404

@app.route('/api/articles', methods=['POST'])
def create_article():
    data = request.get_json()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO articles (title, content, category, status, views, comments)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        data['title'],
        data['content'],
        data['category'],
        data['status'],
        data.get('views', 0),
        data.get('comments', 0)
    ))
    conn.commit()
    article_id = cursor.lastrowid
    cursor.execute('SELECT * FROM articles WHERE id = ?', (article_id,))
    article = cursor.fetchone()
    conn.close()
    return jsonify(dict(article)), 201

@app.route('/api/articles/<int:id>', methods=['PUT'])
def update_article(id):
    data = request.get_json()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE articles 
        SET title = ?, content = ?, category = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ''', (
        data['title'],
        data['content'],
        data['category'],
        data['status'],
        id
    ))
    conn.commit()
    cursor.execute('SELECT * FROM articles WHERE id = ?', (id,))
    article = cursor.fetchone()
    conn.close()
    if article:
        return jsonify(dict(article))
    return jsonify({'error': 'Article not found'}), 404

@app.route('/api/articles/<int:id>', methods=['DELETE'])
def delete_article(id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM articles WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return '', 204

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM articles')
    total_articles = cursor.fetchone()[0]
    
    cursor.execute('SELECT SUM(views) FROM articles')
    total_views = cursor.fetchone()[0] or 0
    
    cursor.execute('SELECT SUM(comments) FROM articles')
    total_comments = cursor.fetchone()[0] or 0
    
    today_views = 342
    
    conn.close()
    
    return jsonify({
        'totalArticles': total_articles,
        'totalViews': total_views,
        'todayViews': today_views,
        'totalComments': total_comments
    })

@app.route('/api/trends', methods=['GET'])
def get_trends():
    base_date = datetime.now()
    trends = []
    for i in range(7):
        date = base_date - timedelta(days=6 - i)
        views = 100 + (i * 50) + (i % 3 * 20)
        trends.append({
            'date': date.strftime('%m-%d'),
            'views': views
        })
    return jsonify(trends)

@app.route('/api/categories', methods=['GET'])
def get_categories():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT category as name, COUNT(*) as value 
        FROM articles 
        GROUP BY category
    ''')
    categories = cursor.fetchall()
    conn.close()
    return jsonify([dict(cat) for cat in categories])

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
