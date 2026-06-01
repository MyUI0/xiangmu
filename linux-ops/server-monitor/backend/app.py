#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, render_template, jsonify, request
import threading
import time
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from monitor import SystemMonitor
from database import DatabaseManager

app = Flask(__name__, template_folder='../templates', static_folder='../static')

monitor = SystemMonitor()
db = DatabaseManager()


def collect_data_periodically(interval=5):
    """定期收集监控数据"""
    while True:
        try:
            metrics = monitor.get_all_metrics()
            db.insert_metrics(metrics)
            db.cleanup_old_data(days=7)
        except Exception as e:
            print(f'数据收集错误: {e}')
        time.sleep(interval)


@app.route('/')
def index():
    """主页"""
    return render_template('index.html')


@app.route('/api/metrics')
def get_metrics():
    """获取最新监控数据API"""
    metrics = db.get_latest_metrics()
    if not metrics:
        metrics = monitor.get_all_metrics()
    return jsonify(metrics)


@app.route('/api/history')
def get_history():
    """获取历史数据API"""
    hours = request.args.get('hours', 24, type=int)
    history = db.get_metrics_history(hours=hours)
    return jsonify(history)


if __name__ == '__main__':
    data_thread = threading.Thread(target=collect_data_periodically, daemon=True)
    data_thread.start()

    app.run(host='0.0.0.0', port=5000, debug=True)
