#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
import os
from collections import Counter, defaultdict
from datetime import datetime
import json


class LogAnalyzer:
    """日志分析器"""

    def __init__(self):
        """初始化分析器"""
        self.log_level_patterns = {
            'DEBUG': re.compile(r'\bDEBUG\b'),
            'INFO': re.compile(r'\bINFO\b'),
            'WARN': re.compile(r'\bWARN(?:ING)?\b'),
            'ERROR': re.compile(r'\bERROR\b'),
            'FATAL': re.compile(r'\bFATAL\b')
        }
        self.ip_pattern = re.compile(r'\b(?:\d{1,3}\.){3}\d{1,3}\b')
        self.url_pattern = re.compile(r'https?://[^\s]+')
        self.datetime_patterns = [
            re.compile(r'\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?'),
            re.compile(r'\d{2}/\d{2}/\d{4} \d{2}:\d{2}:\d{2}'),
            re.compile(r'\w+ \d+ \d{2}:\d{2}:\d{2}')
        ]

    def read_log_file(self, file_path, max_lines=10000):
        """读取日志文件"""
        lines = []
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                for i, line in enumerate(f):
                    if i >= max_lines:
                        break
                    lines.append(line.rstrip('\n'))
        except Exception as e:
            raise Exception(f'读取文件失败: {e}')
        return lines

    def analyze_log_levels(self, lines):
        """分析日志级别分布"""
        levels = Counter()
        for line in lines:
            found = False
            for level, pattern in self.log_level_patterns.items():
                if pattern.search(line):
                    levels[level] += 1
                    found = True
                    break
            if not found:
                levels['UNKNOWN'] += 1
        return dict(levels)

    def find_errors(self, lines, max_errors=100):
        """查找错误日志"""
        errors = []
        error_pattern = re.compile(r'\b(?:ERROR|FATAL|EXCEPTION)\b', re.IGNORECASE)
        for i, line in enumerate(lines):
            if error_pattern.search(line):
                errors.append({
                    'line_number': i + 1,
                    'content': line
                })
                if len(errors) >= max_errors:
                    break
        return errors

    def extract_ips(self, lines):
        """提取IP地址"""
        ips = []
        for line in lines:
            ips.extend(self.ip_pattern.findall(line))
        return Counter(ips)

    def extract_urls(self, lines):
        """提取URL"""
        urls = []
        for line in lines:
            urls.extend(self.url_pattern.findall(line))
        return Counter(urls)

    def extract_timestamps(self, lines):
        """提取时间戳并分析时间分布"""
        timestamps = []
        for line in lines:
            for pattern in self.datetime_patterns:
                match = pattern.search(line)
                if match:
                    timestamps.append(match.group())
                    break
        return timestamps

    def analyze_temporal_distribution(self, timestamps):
        """分析时间分布"""
        hourly_dist = defaultdict(int)
        for ts in timestamps:
            try:
                dt = self._parse_timestamp(ts)
                if dt:
                    key = dt.strftime('%Y-%m-%d %H:00')
                    hourly_dist[key] += 1
            except:
                continue
        return dict(hourly_dist)

    def _parse_timestamp(self, ts_str):
        """解析时间戳"""
        formats = [
            '%Y-%m-%d %H:%M:%S',
            '%Y-%m-%dT%H:%M:%S',
            '%d/%m/%Y %H:%M:%S',
            '%b %d %H:%M:%S',
            '%Y-%m-%d %H:%M:%S.%f'
        ]
        for fmt in formats:
            try:
                return datetime.strptime(ts_str, fmt)
            except ValueError:
                continue
        return None

    def search_pattern(self, lines, pattern):
        """搜索模式"""
        results = []
        regex = re.compile(pattern, re.IGNORECASE)
        for i, line in enumerate(lines):
            if regex.search(line):
                results.append({
                    'line_number': i + 1,
                    'content': line
                })
        return results

    def get_top_patterns(self, lines, pattern, top_n=10):
        """获取高频模式"""
        matches = []
        regex = re.compile(pattern)
        for line in lines:
            matches.extend(regex.findall(line))
        return Counter(matches).most_common(top_n)

    def full_analysis(self, file_path):
        """完整分析"""
        lines = self.read_log_file(file_path)
        if not lines:
            return {'error': '日志文件为空或无法读取'}

        timestamps = self.extract_timestamps(lines)
        levels = self.analyze_log_levels(lines)
        errors = self.find_errors(lines)
        ips = self.extract_ips(lines)
        urls = self.extract_urls(lines)

        result = {
            'total_lines': len(lines),
            'file_size': os.path.getsize(file_path),
            'log_levels': levels,
            'errors': errors,
            'error_count': len(errors),
            'top_ips': ips.most_common(20),
            'top_urls': urls.most_common(20),
            'temporal_distribution': self.analyze_temporal_distribution(timestamps),
            'timestamp_count': len(timestamps)
        }
        return result

    def check_alerts(self, lines, log_file_id, rules, db_manager):
        """检查告警规则"""
        alerts = []
        for rule in rules:
            try:
                pattern = re.compile(rule['pattern'], re.IGNORECASE)
                for i, line in enumerate(lines):
                    if pattern.search(line):
                        ts = self._extract_line_timestamp(line)
                        alert = {
                            'rule_id': rule['id'],
                            'log_file_id': log_file_id,
                            'line_number': i + 1,
                            'message': line[:500],
                            'timestamp': ts
                        }
                        db_manager.add_alert(**alert)
                        alerts.append(alert)
            except Exception as e:
                print(f'规则 {rule["rule_name"]} 执行失败: {e}')
        return alerts

    def _extract_line_timestamp(self, line):
        """从单行提取时间戳"""
        for pattern in self.datetime_patterns:
            match = pattern.search(line)
            if match:
                return match.group()
        return datetime.now().strftime('%Y-%m-%d %H:%M:%S')
