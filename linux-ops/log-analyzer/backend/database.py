#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sqlite3
import os
import json
from datetime import datetime, timedelta


class DatabaseManager:
    """数据库管理类"""

    def __init__(self, db_path="../data/log_analyzer.db"):
        """初始化数据库连接"""
        self.db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), db_path)
        self._init_database()

    def _get_connection(self):
        """获取数据库连接"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_database(self):
        """初始化数据库表"""
        conn = self._get_connection()
        cursor = conn.cursor()

        # 日志文件表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS log_files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_path TEXT NOT NULL,
                file_name TEXT NOT NULL,
                file_size INTEGER,
                last_modified TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # 日志分析结果表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS log_analysis (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                log_file_id INTEGER,
                analysis_type TEXT NOT NULL,
                result_data TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (log_file_id) REFERENCES log_files(id)
            )
        ''')

        # 告警规则表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS alert_rules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                rule_name TEXT NOT NULL,
                pattern TEXT NOT NULL,
                severity TEXT DEFAULT 'warning',
                description TEXT,
                enabled INTEGER DEFAULT 1,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # 告警记录表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                rule_id INTEGER,
                log_file_id INTEGER,
                line_number INTEGER,
                message TEXT,
                timestamp TEXT,
                resolved INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (rule_id) REFERENCES alert_rules(id),
                FOREIGN KEY (log_file_id) REFERENCES log_files(id)
            )
        ''')

        conn.commit()
        conn.close()

    def add_log_file(self, file_path, file_name, file_size=None, last_modified=None):
        """添加日志文件记录"""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO log_files (file_path, file_name, file_size, last_modified)
            VALUES (?, ?, ?, ?)
        ''', (file_path, file_name, file_size, last_modified))
        log_file_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return log_file_id

    def get_log_files(self):
        """获取所有日志文件记录"""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM log_files ORDER BY created_at DESC')
        files = cursor.fetchall()
        conn.close()
        return [dict(file) for file in files]

    def get_log_file(self, log_file_id):
        """获取单个日志文件记录"""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM log_files WHERE id = ?', (log_file_id,))
        file = cursor.fetchone()
        conn.close()
        return dict(file) if file else None

    def save_analysis_result(self, log_file_id, analysis_type, result_data):
        """保存分析结果"""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO log_analysis (log_file_id, analysis_type, result_data)
            VALUES (?, ?, ?)
        ''', (log_file_id, analysis_type, json.dumps(result_data, ensure_ascii=False)))
        analysis_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return analysis_id

    def get_analysis_results(self, log_file_id=None):
        """获取分析结果"""
        conn = self._get_connection()
        cursor = conn.cursor()
        if log_file_id:
            cursor.execute('SELECT * FROM log_analysis WHERE log_file_id = ? ORDER BY created_at DESC', (log_file_id,))
        else:
            cursor.execute('SELECT * FROM log_analysis ORDER BY created_at DESC')
        results = cursor.fetchall()
        conn.close()
        return [self._parse_analysis_result(result) for result in results]

    def _parse_analysis_result(self, row):
        """解析分析结果"""
        result = dict(row)
        if result['result_data']:
            result['result_data'] = json.loads(result['result_data'])
        return result

    def add_alert_rule(self, rule_name, pattern, severity='warning', description=None):
        """添加告警规则"""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO alert_rules (rule_name, pattern, severity, description)
            VALUES (?, ?, ?, ?)
        ''', (rule_name, pattern, severity, description))
        rule_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return rule_id

    def get_alert_rules(self, enabled_only=True):
        """获取告警规则"""
        conn = self._get_connection()
        cursor = conn.cursor()
        if enabled_only:
            cursor.execute('SELECT * FROM alert_rules WHERE enabled = 1 ORDER BY created_at DESC')
        else:
            cursor.execute('SELECT * FROM alert_rules ORDER BY created_at DESC')
        rules = cursor.fetchall()
        conn.close()
        return [dict(rule) for rule in rules]

    def add_alert(self, rule_id, log_file_id, line_number, message, timestamp):
        """添加告警记录"""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO alerts (rule_id, log_file_id, line_number, message, timestamp)
            VALUES (?, ?, ?, ?, ?)
        ''', (rule_id, log_file_id, line_number, message, timestamp))
        alert_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return alert_id

    def get_alerts(self, log_file_id=None, resolved=False, limit=100):
        """获取告警记录"""
        conn = self._get_connection()
        cursor = conn.cursor()
        query = 'SELECT a.*, r.rule_name FROM alerts a JOIN alert_rules r ON a.rule_id = r.id WHERE a.resolved = ?'
        params = [1 if resolved else 0]
        if log_file_id:
            query += ' AND a.log_file_id = ?'
            params.append(log_file_id)
        query += ' ORDER BY a.created_at DESC LIMIT ?'
        params.append(limit)
        cursor.execute(query, params)
        alerts = cursor.fetchall()
        conn.close()
        return [dict(alert) for alert in alerts]

    def resolve_alert(self, alert_id):
        """标记告警为已解决"""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('UPDATE alerts SET resolved = 1 WHERE id = ?', (alert_id,))
        conn.commit()
        conn.close()

    def cleanup_old_data(self, days=30):
        """清理旧数据"""
        cutoff_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d %H:%M:%S')
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM log_analysis WHERE created_at < ?', (cutoff_date,))
        cursor.execute('DELETE FROM alerts WHERE created_at < ? AND resolved = 1', (cutoff_date,))
        conn.commit()
        conn.close()
