#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sqlite3
import json
import os
from datetime import datetime, timedelta


class DatabaseManager:
    """数据库管理类，负责监控数据的存储和查询"""

    def __init__(self, db_path='../data/monitor.db'):
        self.db_path = db_path
        self._init_database()

    def _init_database(self):
        """初始化数据库表结构"""
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)

        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                data TEXT NOT NULL
            )
        ''')

        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_timestamp ON metrics(timestamp)
        ''')

        conn.commit()
        conn.close()

    def insert_metrics(self, metrics_data):
        """插入监控数据"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute(
            'INSERT INTO metrics (timestamp, data) VALUES (?, ?)',
            (metrics_data['timestamp'], json.dumps(metrics_data))
        )

        conn.commit()
        conn.close()

    def get_latest_metrics(self):
        """获取最新的监控数据"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('SELECT data FROM metrics ORDER BY id DESC LIMIT 1')
        result = cursor.fetchone()

        conn.close()

        if result:
            return json.loads(result[0])
        return None

    def get_metrics_history(self, hours=24):
        """获取指定小时数内的历史数据"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        start_time = (datetime.now() - timedelta(hours=hours)).strftime('%Y-%m-%d %H:%M:%S')

        cursor.execute(
            'SELECT data FROM metrics WHERE timestamp >= ? ORDER BY id',
            (start_time,)
        )

        results = cursor.fetchall()
        conn.close()

        return [json.loads(row[0]) for row in results]

    def cleanup_old_data(self, days=7):
        """清理指定天数前的旧数据"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cutoff_time = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d %H:%M:%S')

        cursor.execute('DELETE FROM metrics WHERE timestamp < ?', (cutoff_time,))
        deleted_count = cursor.rowcount

        conn.commit()
        conn.close()

        return deleted_count


def main():
    """测试数据库功能"""
    db = DatabaseManager()

    from monitor import SystemMonitor
    monitor = SystemMonitor()
    metrics = monitor.get_all_metrics()

    db.insert_metrics(metrics)
    print('数据已插入')

    latest = db.get_latest_metrics()
    print('最新数据:', json.dumps(latest, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
