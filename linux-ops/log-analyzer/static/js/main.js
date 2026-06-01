let currentLogFileId = null;

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initUpload();
    loadDashboard();
    loadLogFiles();
    loadAlerts();
    loadRules();
    initSearch();
    initRuleForm();
});

function initTabs() {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.getElementById(btn.dataset.tab).classList.add('active');
            
            if (btn.dataset.tab === 'dashboard') loadDashboard();
            if (btn.dataset.tab === 'logs') loadLogFiles();
            if (btn.dataset.tab === 'alerts') loadAlerts();
            if (btn.dataset.tab === 'rules') loadRules();
        });
    });
}

function initUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    
    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#667eea';
        uploadArea.style.background = '#f8f9ff';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.background = 'transparent';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.background = 'transparent';
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileUpload(e.target.files[0]);
        }
    });
}

async function handleFileUpload(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (data.success) {
            showToast('文件上传成功', 'success');
            loadLogFiles();
            loadDashboard();
        } else {
            showToast(data.error || '上传失败', 'error');
        }
    } catch (e) {
        showToast('上传失败: ' + e.message, 'error');
    }
}

async function loadDashboard() {
    try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        
        document.getElementById('total-files').textContent = data.total_files;
        document.getElementById('active-alerts').textContent = data.active_alerts;
        document.getElementById('recent-analyses').textContent = data.recent_analyses.length;
        
        const alertsList = document.getElementById('alerts-list');
        if (data.alerts.length === 0) {
            alertsList.innerHTML = '<div class="empty-state">暂无告警</div>';
        } else {
            alertsList.innerHTML = data.alerts.map(alert => `
                <div class="alert-item ${alert.severity || 'error'}">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span class="severity-badge ${alert.severity || 'error'}">${alert.rule_name}</span>
                        <small>${alert.created_at}</small>
                    </div>
                    <div style="font-size: 13px;">${escapeHtml(alert.message.substring(0, 200))}...</div>
                </div>
            `).join('');
        }
        
        const filesList = document.getElementById('files-list');
        const files = await (await fetch('/api/log-files')).json();
        if (files.files.length === 0) {
            filesList.innerHTML = '<div class="empty-state">暂无日志文件</div>';
        } else {
            filesList.innerHTML = files.files.slice(0, 5).map(file => `
                <div class="list-item">
                    <div style="font-weight: 500;">${escapeHtml(file.file_name)}</div>
                    <small style="color: #666;">${formatFileSize(file.file_size)} · ${file.created_at}</small>
                </div>
            `).join('');
        }
    } catch (e) {
        console.error(e);
    }
}

async function loadLogFiles() {
    try {
        const res = await fetch('/api/log-files');
        const data = await res.json();
        const table = document.getElementById('log-files-table');
        
        if (data.files.length === 0) {
            table.innerHTML = '<div class="empty-state">暂无日志文件，请上传</div>';
            return;
        }
        
        table.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>文件名</th>
                        <th>大小</th>
                        <th>上传时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.files.map(file => `
                        <tr>
                            <td>${escapeHtml(file.file_name)}</td>
                            <td>${formatFileSize(file.file_size)}</td>
                            <td>${file.created_at}</td>
                            <td>
                                <button class="btn btn-success" onclick="analyzeLog(${file.id})">分析</button>
                                <button class="btn" onclick="viewLog(${file.id})">查看</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (e) {
        console.error(e);
    }
}

async function analyzeLog(fileId) {
    try {
        showToast('正在分析...', 'success');
        const res = await fetch(`/api/analyze/${fileId}`, { method: 'POST' });
        const data = await res.json();
        
        if (data.success) {
            showToast('分析完成', 'success');
            displayAnalysisResult(data.result);
            loadDashboard();
            loadAlerts();
        } else {
            showToast(data.error || '分析失败', 'error');
        }
    } catch (e) {
        showToast('分析失败: ' + e.message, 'error');
    }
}

function displayAnalysisResult(result) {
    document.getElementById('analysis-result').style.display = 'block';
    const container = document.getElementById('analysis-data');
    
    const levels = result.log_levels || {};
    const total = Object.values(levels).reduce((a, b) => a + b, 0);
    const levelColors = {
        DEBUG: 'level-debug',
        INFO: 'level-info',
        WARN: 'level-warn',
        WARNING: 'level-warn',
        ERROR: 'level-error',
        FATAL: 'level-fatal',
        UNKNOWN: 'level-unknown'
    };
    
    let levelBarHtml = '';
    for (const [level, count] of Object.entries(levels)) {
        const width = total > 0 ? (count / total * 100) : 0;
        if (width > 0) {
            levelBarHtml += `<div class="level-segment ${levelColors[level] || 'level-unknown'}" style="width: ${width}%">${level} ${count}</div>`;
        }
    }
    
    container.innerHTML = `
        <div class="analysis-stats">
            <div class="analysis-stat">
                <div class="analysis-stat-value">${result.total_lines}</div>
                <div class="analysis-stat-label">总行数</div>
            </div>
            <div class="analysis-stat">
                <div class="analysis-stat-value">${result.error_count || 0}</div>
                <div class="analysis-stat-label">错误数</div>
            </div>
            <div class="analysis-stat">
                <div class="analysis-stat-value">${result.timestamp_count || 0}</div>
                <div class="analysis-stat-label">时间戳</div>
            </div>
        </div>
        
        <h3>日志级别分布</h3>
        <div class="level-bar">${levelBarHtml || '<div class="level-segment level-unknown" style="width: 100%">无数据</div>'}</div>
        
        ${(result.top_ips && result.top_ips.length > 0) ? `
            <h3>Top IP 地址</h3>
            <table>
                <thead><tr><th>IP</th><th>次数</th></tr></thead>
                <tbody>
                    ${result.top_ips.slice(0, 10).map(([ip, count]) => `
                        <tr><td>${escapeHtml(ip)}</td><td>${count}</td></tr>
                    `).join('')}
                </tbody>
            </table>
        ` : ''}
    `;
}

async function viewLog(fileId) {
    currentLogFileId = fileId;
    document.getElementById('log-viewer').style.display = 'block';
    
    try {
        const res = await fetch(`/api/log-content/${fileId}`);
        const data = await res.json();
        
        const container = document.getElementById('log-content');
        container.innerHTML = data.lines.map((line, i) => `
            <div class="log-line">
                <span class="log-line-number">${i + 1}</span>
                ${escapeHtml(line)}
            </div>
        `).join('');
    } catch (e) {
        showToast('加载日志失败', 'error');
    }
}

function initSearch() {
    document.getElementById('search-btn').addEventListener('click', performSearch);
    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    document.getElementById('close-viewer').addEventListener('click', () => {
        document.getElementById('log-viewer').style.display = 'none';
    });
    document.getElementById('show-resolved').addEventListener('change', loadAlerts);
}

async function performSearch() {
    const pattern = document.getElementById('search-input').value;
    if (!pattern || !currentLogFileId) return;
    
    try {
        const res = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ log_file_id: currentLogFileId, pattern })
        });
        const data = await res.json();
        
        const container = document.getElementById('log-content');
        if (data.results.length === 0) {
            container.innerHTML = '<div class="empty-state">未找到匹配结果</div>';
        } else {
            container.innerHTML = data.results.map(r => `
                <div class="log-line">
                    <span class="log-line-number">${r.line_number}</span>
                    ${escapeHtml(r.content)}
                </div>
            `).join('');
        }
    } catch (e) {
        showToast('搜索失败', 'error');
    }
}

async function loadAlerts() {
    const showResolved = document.getElementById('show-resolved').checked;
    try {
        const res = await fetch(`/api/alerts?resolved=${showResolved}`);
        const data = await res.json();
        const table = document.getElementById('alerts-table');
        
        if (data.alerts.length === 0) {
            table.innerHTML = '<div class="empty-state">暂无告警</div>';
            return;
        }
        
        table.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>规则</th>
                        <th>消息</th>
                        <th>时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.alerts.map(alert => `
                        <tr>
                            <td><span class="severity-badge ${alert.severity || 'warning'}">${escapeHtml(alert.rule_name)}</span></td>
                            <td style="max-width: 400px; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(alert.message.substring(0, 100))}...</td>
                            <td>${alert.created_at}</td>
                            <td>
                                ${!alert.resolved ? `<button class="btn btn-success" onclick="resolveAlert(${alert.id})">解决</button>` : '<span style="color: #27ae60;">已解决</span>'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (e) {
        console.error(e);
    }
}

async function resolveAlert(alertId) {
    try {
        await fetch(`/api/alerts/${alertId}/resolve`, { method: 'POST' });
        showToast('告警已标记为已解决', 'success');
        loadAlerts();
        loadDashboard();
    } catch (e) {
        showToast('操作失败', 'error');
    }
}

async function loadRules() {
    try {
        const res = await fetch('/api/alert-rules');
        const data = await res.json();
        const table = document.getElementById('rules-table');
        
        if (data.rules.length === 0) {
            table.innerHTML = '<div class="empty-state">暂无告警规则</div>';
            return;
        }
        
        table.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>规则名称</th>
                        <th>匹配模式</th>
                        <th>严重级别</th>
                        <th>描述</th>
                        <th>状态</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.rules.map(rule => `
                        <tr>
                            <td>${escapeHtml(rule.rule_name)}</td>
                            <td><code>${escapeHtml(rule.pattern)}</code></td>
                            <td><span class="severity-badge ${rule.severity}">${rule.severity}</span></td>
                            <td>${escapeHtml(rule.description || '-')}</td>
                            <td>${rule.enabled ? '启用' : '禁用'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (e) {
        console.error(e);
    }
}

function initRuleForm() {
    document.getElementById('add-rule-btn').addEventListener('click', () => {
        document.getElementById('add-rule-form').style.display = 'block';
    });
    document.getElementById('cancel-rule').addEventListener('click', () => {
        document.getElementById('add-rule-form').style.display = 'none';
    });
    document.getElementById('rule-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const res = await fetch('/api/alert-rules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rule_name: document.getElementById('rule-name').value,
                    pattern: document.getElementById('rule-pattern').value,
                    severity: document.getElementById('rule-severity').value,
                    description: document.getElementById('rule-description').value
                })
            });
            
            if ((await res.json()).success) {
                showToast('规则添加成功', 'success');
                document.getElementById('add-rule-form').style.display = 'none';
                document.getElementById('rule-form').reset();
                loadRules();
            }
        } catch (e) {
            showToast('添加规则失败', 'error');
        }
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function formatFileSize(bytes) {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
