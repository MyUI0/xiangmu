// 自动部署工具前端脚本

let currentTaskId = null;

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    loadScripts();
    loadConfig();
    loadTasks();
    loadLogs();

    // 定时刷新任务和日志
    setInterval(loadTasks, 3000);
    setInterval(loadLogs, 5000);
});

// 加载部署脚本列表
async function loadScripts() {
    try {
        const response = await fetch('/api/scripts');
        const scripts = await response.json();
        const listEl = document.getElementById('script-list');
        listEl.innerHTML = '';

        scripts.forEach(script => {
            const div = document.createElement('div');
            div.className = 'script-item';
            div.innerHTML = `
                <span>${script.name}</span>
                <button class="btn btn-success" onclick="deploy('${script.name}')">部署</button>
            `;
            listEl.appendChild(div);
        });
    } catch (error) {
        console.error('加载脚本失败:', error);
    }
}

// 加载配置
async function loadConfig() {
    try {
        const response = await fetch('/api/config');
        const config = await response.json();
        if (config.server) {
            document.getElementById('config-port').value = config.server.port || 5000;
        }
        if (config.deploy) {
            document.getElementById('config-workspace').value = config.deploy.workspace || '/tmp/deploy';
        }
    } catch (error) {
        console.error('加载配置失败:', error);
    }
}

// 保存配置
async function saveConfig() {
    const config = {
        server: {
            port: parseInt(document.getElementById('config-port').value)
        },
        deploy: {
            workspace: document.getElementById('config-workspace').value
        }
    };

    try {
        const response = await fetch('/api/config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(config)
        });
        const result = await response.json();
        if (result.success) {
            alert('配置保存成功');
        }
    } catch (error) {
        console.error('保存配置失败:', error);
        alert('保存配置失败');
    }
}

// 执行部署
async function deploy(scriptName) {
    if (!confirm(`确定要部署 ${scriptName} 吗？`)) {
        return;
    }

    try {
        const response = await fetch('/api/deploy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ script: scriptName })
        });
        const result = await response.json();
        if (result.success) {
            alert('部署任务已启动，任务ID: ' + result.task_id);
            loadTasks();
        } else {
            alert('部署失败: ' + result.error);
        }
    } catch (error) {
        console.error('部署失败:', error);
        alert('部署失败');
    }
}

// 加载任务列表
async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        const listEl = document.getElementById('task-list');
        listEl.innerHTML = '';

        if (tasks.length === 0) {
            listEl.innerHTML = '<p style="color: #999; padding: 20px; text-align: center;">暂无任务</p>';
            return;
        }

        tasks.reverse().forEach(task => {
            const div = document.createElement('div');
            div.className = 'task-item';
            div.onclick = () => loadTaskDetail(task.id);
            div.innerHTML = `
                <div>
                    <strong>${task.name}</strong>
                    <br>
                    <small>ID: ${task.id}</small>
                </div>
                <span class="status-${task.status}">${getStatusText(task.status)}</span>
            `;
            listEl.appendChild(div);
        });
    } catch (error) {
        console.error('加载任务失败:', error);
    }
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'pending': '等待中',
        'running': '运行中',
        'success': '成功',
        'failed': '失败'
    };
    return statusMap[status] || status;
}

// 加载任务详情
async function loadTaskDetail(taskId) {
    currentTaskId = taskId;
    try {
        const response = await fetch(`/api/tasks/${taskId}`);
        const task = await response.json();
        const detailEl = document.getElementById('task-detail');

        detailEl.innerHTML = `
            <div class="task-detail">
                <h3>${task.name}</h3>
                <p><strong>状态:</strong> <span class="status-${task.status}">${getStatusText(task.status)}</span></p>
                <p><strong>开始时间:</strong> ${task.start_time || '-'}</p>
                <p><strong>结束时间:</strong> ${task.end_time || '-'}</p>
                ${task.return_code !== null ? `<p><strong>返回码:</strong> ${task.return_code}</p>` : ''}
                ${task.stdout ? `<p><strong>标准输出:</strong></p><pre style="background: #f0f0f0; padding: 10px; border-radius: 4px; max-height: 150px; overflow-y: auto;">${escapeHtml(task.stdout)}</pre>` : ''}
                ${task.stderr ? `<p><strong>错误输出:</strong></p><pre style="background: #ffe6e6; padding: 10px; border-radius: 4px; max-height: 150px; overflow-y: auto;">${escapeHtml(task.stderr)}</pre>` : ''}
            </div>
        `;
    } catch (error) {
        console.error('加载任务详情失败:', error);
    }
}

// 刷新任务
function refreshTasks() {
    loadTasks();
    loadLogs();
}

// 加载日志
async function loadLogs() {
    try {
        const response = await fetch('/api/logs');
        const result = await response.json();
        document.getElementById('log-content').textContent = result.logs || '暂无日志';
    } catch (error) {
        console.error('加载日志失败:', error);
    }
}

// HTML转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
