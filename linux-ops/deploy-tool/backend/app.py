#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
部署工具后端服务
提供API接口用于项目部署管理
"""

import os
import sys
import json
import subprocess
import threading
import time
from datetime import datetime
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import yaml

# 初始化Flask应用
app = Flask(__name__, 
            template_folder='../frontend/templates',
            static_folder='../frontend/static')
CORS(app)

# 配置文件路径
CONFIG_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'config', 'config.yaml')
LOG_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs', 'deploy.log')

# 部署任务存储
deploy_tasks = []


def load_config():
    """加载配置文件"""
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    return {}


def save_config(config):
    """保存配置文件"""
    with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
        yaml.dump(config, f, allow_unicode=True, default_flow_style=False)


def write_log(message):
    """写入日志"""
    os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    with open(LOG_PATH, 'a', encoding='utf-8') as f:
        f.write(f"[{timestamp}] {message}\n")


def run_script(script_path, task_id):
    """执行部署脚本"""
    task = next((t for t in deploy_tasks if t['id'] == task_id), None)
    if not task:
        return

    try:
        task['status'] = 'running'
        task['start_time'] = datetime.now().isoformat()
        write_log(f"开始执行任务: {task['name']}, 脚本: {script_path}")

        result = subprocess.run(
            ['bash', script_path],
            capture_output=True,
            text=True,
            timeout=3600
        )

        task['stdout'] = result.stdout
        task['stderr'] = result.stderr
        task['return_code'] = result.returncode

        if result.returncode == 0:
            task['status'] = 'success'
            write_log(f"任务执行成功: {task['name']}")
        else:
            task['status'] = 'failed'
            write_log(f"任务执行失败: {task['name']}, 错误: {result.stderr}")

    except subprocess.TimeoutExpired:
        task['status'] = 'failed'
        task['stderr'] = '脚本执行超时'
        write_log(f"任务超时: {task['name']}")
    except Exception as e:
        task['status'] = 'failed'
        task['stderr'] = str(e)
        write_log(f"任务异常: {task['name']}, {str(e)}")
    finally:
        task['end_time'] = datetime.now().isoformat()


@app.route('/')
def index():
    """主页"""
    return render_template('index.html')


@app.route('/api/config', methods=['GET'])
def get_config():
    """获取配置"""
    config = load_config()
    return jsonify(config)


@app.route('/api/config', methods=['POST'])
def update_config():
    """更新配置"""
    config = request.json
    save_config(config)
    write_log("配置已更新")
    return jsonify({'success': True})


@app.route('/api/scripts', methods=['GET'])
def list_scripts():
    """列出所有部署脚本"""
    scripts_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'scripts')
    scripts = []
    if os.path.exists(scripts_dir):
        for file in os.listdir(scripts_dir):
            if file.endswith('.sh'):
                scripts.append({
                    'name': file,
                    'path': os.path.join(scripts_dir, file)
                })
    return jsonify(scripts)


@app.route('/api/deploy', methods=['POST'])
def deploy():
    """执行部署"""
    data = request.json
    script_name = data.get('script')
    script_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'scripts', script_name)

    if not os.path.exists(script_path):
        return jsonify({'success': False, 'error': '脚本不存在'}), 400

    task_id = len(deploy_tasks) + 1
    task = {
        'id': task_id,
        'name': script_name,
        'status': 'pending',
        'start_time': None,
        'end_time': None,
        'stdout': '',
        'stderr': '',
        'return_code': None
    }
    deploy_tasks.append(task)

    # 异步执行脚本
    thread = threading.Thread(target=run_script, args=(script_path, task_id))
    thread.start()

    return jsonify({'success': True, 'task_id': task_id})


@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """获取所有任务"""
    return jsonify(deploy_tasks)


@app.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    """获取单个任务详情"""
    task = next((t for t in deploy_tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({'error': '任务不存在'}), 404
    return jsonify(task)


@app.route('/api/logs', methods=['GET'])
def get_logs():
    """获取日志"""
    if os.path.exists(LOG_PATH):
        with open(LOG_PATH, 'r', encoding='utf-8') as f:
            logs = f.read()
        return jsonify({'logs': logs})
    return jsonify({'logs': ''})


if __name__ == '__main__':
    # 确保配置文件存在
    if not os.path.exists(CONFIG_PATH):
        default_config = {
            'server': {
                'host': '0.0.0.0',
                'port': 5000
            },
            'deploy': {
                'workspace': '/tmp/deploy'
            }
        }
        os.makedirs(os.path.dirname(CONFIG_PATH), exist_ok=True)
        save_config(default_config)

    app.run(host='0.0.0.0', port=5000, debug=True)
