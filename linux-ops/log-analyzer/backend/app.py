#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, render_template, jsonify, request, send_from_directory
import os
import sys
from werkzeug.utils import secure_filename

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from analyzer import LogAnalyzer
from database import DatabaseManager

app = Flask(__name__, template_folder='../templates', static_folder='../static')
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../logs')
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB

analyzer = LogAnalyzer()
db = DatabaseManager()

# 初始化默认告警规则
def init_default_rules():
    rules = db.get_alert_rules(enabled_only=False)
    if not rules:
        db.add_alert_rule('错误日志', r'ERROR|FATAL|EXCEPTION', 'error', '检测到错误或异常')
        db.add_alert_rule('警告日志', r'WARN(?:ING)?', 'warning', '检测到警告信息')
        db.add_alert_rule('404错误', r'404\s+Not\s+Found', 'warning', '检测到404错误')
        db.add_alert_rule('500错误', r'500\s+Internal\s+Server\s+Error', 'error', '检测到服务器内部错误')

init_default_rules()


@app.route('/')
def index():
    """主页"""
    return render_template('index.html')


@app.route('/api/log-files', methods=['GET'])
def get_log_files():
    """获取日志文件列表"""
    files = db.get_log_files()
    return jsonify({'files': files})


@app.route('/api/upload', methods=['POST'])
def upload_log_file():
    """上传日志文件"""
    if 'file' not in request.files:
        return jsonify({'error': '没有上传文件'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': '未选择文件'}), 400
    if file:
        filename = secure_filename(file.filename)
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(save_path)
        file_size = os.path.getsize(save_path)
        last_modified = os.path.getmtime(save_path)
        log_file_id = db.add_log_file(save_path, filename, file_size, str(last_modified))
        return jsonify({'success': True, 'log_file_id': log_file_id, 'filename': filename})


@app.route('/api/analyze/<int:log_file_id>', methods=['POST'])
def analyze_log_file(log_file_id):
    """分析日志文件"""
    log_file = db.get_log_file(log_file_id)
    if not log_file:
        return jsonify({'error': '日志文件不存在'}), 404
    try:
        result = analyzer.full_analysis(log_file['file_path'])
        db.save_analysis_result(log_file_id, 'full', result)
        # 检查告警
        lines = analyzer.read_log_file(log_file['file_path'])
        rules = db.get_alert_rules()
        analyzer.check_alerts(lines, log_file_id, rules, db)
        return jsonify({'success': True, 'result': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/analysis/<int:log_file_id>', methods=['GET'])
def get_analysis_result(log_file_id):
    """获取分析结果"""
    results = db.get_analysis_results(log_file_id)
    return jsonify({'results': results})


@app.route('/api/log-content/<int:log_file_id>', methods=['GET'])
def get_log_content(log_file_id):
    """获取日志内容"""
    log_file = db.get_log_file(log_file_id)
    if not log_file:
        return jsonify({'error': '日志文件不存在'}), 404
    try:
        offset = request.args.get('offset', 0, type=int)
        limit = request.args.get('limit', 500, type=int)
        lines = analyzer.read_log_file(log_file['file_path'])
        return jsonify({
            'total': len(lines),
            'lines': lines[offset:offset+limit]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/search', methods=['POST'])
def search_logs():
    """搜索日志"""
    data = request.json
    log_file_id = data.get('log_file_id')
    pattern = data.get('pattern', '')
    if not pattern:
        return jsonify({'error': '搜索模式不能为空'}), 400
    log_file = db.get_log_file(log_file_id)
    if not log_file:
        return jsonify({'error': '日志文件不存在'}), 404
    try:
        lines = analyzer.read_log_file(log_file['file_path'])
        results = analyzer.search_pattern(lines, pattern)
        return jsonify({'results': results, 'count': len(results)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """获取告警列表"""
    log_file_id = request.args.get('log_file_id', type=int)
    resolved = request.args.get('resolved', 'false').lower() == 'true'
    limit = request.args.get('limit', 100, type=int)
    alerts = db.get_alerts(log_file_id, resolved, limit)
    return jsonify({'alerts': alerts})


@app.route('/api/alerts/<int:alert_id>/resolve', methods=['POST'])
def resolve_alert(alert_id):
    """标记告警为已解决"""
    db.resolve_alert(alert_id)
    return jsonify({'success': True})


@app.route('/api/alert-rules', methods=['GET'])
def get_alert_rules():
    """获取告警规则"""
    rules = db.get_alert_rules(enabled_only=False)
    return jsonify({'rules': rules})


@app.route('/api/alert-rules', methods=['POST'])
def add_alert_rule():
    """添加告警规则"""
    data = request.json
    rule_id = db.add_alert_rule(
        data['rule_name'],
        data['pattern'],
        data.get('severity', 'warning'),
        data.get('description')
    )
    return jsonify({'success': True, 'rule_id': rule_id})


@app.route('/api/dashboard', methods=['GET'])
def get_dashboard():
    """获取仪表盘数据"""
    log_files = db.get_log_files()
    alerts = db.get_alerts(limit=50)
    recent_analyses = db.get_analysis_results()
    return jsonify({
        'total_files': len(log_files),
        'active_alerts': len(alerts),
        'recent_analyses': recent_analyses[:10],
        'alerts': alerts
    })


if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(host='0.0.0.0', port=5001, debug=True)
