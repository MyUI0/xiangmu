// 状态管理
let state = {
    containers: [],
    images: [],
    systemInfo: null
};

// API 基础 URL
const API_BASE = '/api';

// 工具函数
async function fetchAPI(url, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${url}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || '请求失败');
        }
        return data;
    } catch (error) {
        console.error('API 请求错误:', error);
        alert(error.message);
        throw error;
    }
}

// 格式化字节大小
function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 格式化时间
function formatDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleString('zh-CN');
}

// 获取容器列表
async function loadContainers() {
    try {
        const containers = await fetchAPI('/containers');
        state.containers = containers;
        renderContainers();
    } catch (error) {
        console.error('加载容器列表失败:', error);
    }
}

// 渲染容器列表
function renderContainers() {
    const container = document.getElementById('containers-list');
    container.innerHTML = '';

    if (state.containers.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888; grid-column: 1/-1;">暂无容器</p>';
        return;
    }

    state.containers.forEach(containerData => {
        const card = createContainerCard(containerData);
        container.appendChild(card);
    });
}

// 创建容器卡片
function createContainerCard(container) {
    const div = document.createElement('div');
    div.className = 'card';

    const status = container.State;
    const statusClass = `status-${status}`;
    const containerName = container.Names[0].replace('/', '');
    const containerId = container.Id.substring(0, 12);

    div.innerHTML = `
        <div class="card-header">
            <div>
                <div class="card-title">${containerName}</div>
                <div class="card-id">${containerId}</div>
            </div>
            <span class="status-badge ${statusClass}">${status}</span>
        </div>
        <div class="card-body">
            <div class="card-info">
                <div class="info-item">
                    <span class="info-label">镜像</span>
                    <span class="info-value">${container.Image}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">创建时间</span>
                    <span class="info-value">${formatDate(container.Created)}</span>
                </div>
                ${container.Ports && container.Ports.length > 0 ? `
                <div class="info-item">
                    <span class="info-label">端口</span>
                    <span class="info-value">${container.Ports.map(p => `${p.PublicPort || '-'}:${p.PrivatePort}`).join(', ')}</span>
                </div>
                ` : ''}
            </div>
        </div>
        <div class="card-actions">
            ${status === 'running' ? `
                <button class="btn btn-warning" onclick="restartContainer('${container.Id}')">重启</button>
                <button class="btn btn-danger" onclick="stopContainer('${container.Id}')">停止</button>
            ` : `
                <button class="btn btn-success" onclick="startContainer('${container.Id}')">启动</button>
            `}
            <button class="btn btn-info" onclick="viewContainerDetail('${container.Id}')">详情</button>
            <button class="btn btn-danger" onclick="deleteContainer('${container.Id}')">删除</button>
        </div>
    `;

    return div;
}

// 启动容器
async function startContainer(id) {
    try {
        await fetchAPI(`/containers/${id}/start`, { method: 'POST' });
        alert('容器启动成功');
        loadContainers();
    } catch (error) {
        console.error('启动容器失败:', error);
    }
}

// 停止容器
async function stopContainer(id) {
    try {
        await fetchAPI(`/containers/${id}/stop`, { method: 'POST' });
        alert('容器停止成功');
        loadContainers();
    } catch (error) {
        console.error('停止容器失败:', error);
    }
}

// 重启容器
async function restartContainer(id) {
    try {
        await fetchAPI(`/containers/${id}/restart`, { method: 'POST' });
        alert('容器重启成功');
        loadContainers();
    } catch (error) {
        console.error('重启容器失败:', error);
    }
}

// 删除容器
async function deleteContainer(id) {
    if (!confirm('确定要删除这个容器吗？')) return;
    try {
        await fetchAPI(`/containers/${id}?force=true`, { method: 'DELETE' });
        alert('容器删除成功');
        loadContainers();
    } catch (error) {
        console.error('删除容器失败:', error);
    }
}

// 查看容器详情
async function viewContainerDetail(id) {
    try {
        const detail = await fetchAPI(`/containers/${id}`);
        document.getElementById('containerDetailContent').textContent = JSON.stringify(detail, null, 2);
        document.getElementById('containerDetailModal').classList.add('show');
    } catch (error) {
        console.error('获取容器详情失败:', error);
    }
}

// 获取镜像列表
async function loadImages() {
    try {
        const images = await fetchAPI('/images');
        state.images = images;
        renderImages();
    } catch (error) {
        console.error('加载镜像列表失败:', error);
    }
}

// 渲染镜像列表
function renderImages() {
    const container = document.getElementById('images-list');
    container.innerHTML = '';

    if (state.images.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888; grid-column: 1/-1;">暂无镜像</p>';
        return;
    }

    state.images.forEach(imageData => {
        const card = createImageCard(imageData);
        container.appendChild(card);
    });
}

// 创建镜像卡片
function createImageCard(image) {
    const div = document.createElement('div');
    div.className = 'card';

    const imageName = image.RepoTags && image.RepoTags.length > 0 ? image.RepoTags[0] : '<none>';
    const imageId = image.Id.substring(7, 19);

    div.innerHTML = `
        <div class="card-header">
            <div>
                <div class="card-title">${imageName}</div>
                <div class="card-id">${imageId}</div>
            </div>
        </div>
        <div class="card-body">
            <div class="card-info">
                <div class="info-item">
                    <span class="info-label">大小</span>
                    <span class="info-value">${formatBytes(image.Size)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">创建时间</span>
                    <span class="info-value">${formatDate(image.Created)}</span>
                </div>
            </div>
        </div>
    `;

    return div;
}

// 获取系统信息
async function loadSystemInfo() {
    try {
        const info = await fetchAPI('/system/info');
        state.systemInfo = info;
        renderSystemInfo();
    } catch (error) {
        console.error('加载系统信息失败:', error);
    }
}

// 渲染系统信息
function renderSystemInfo() {
    const container = document.getElementById('system-info');
    if (!state.systemInfo) {
        container.innerHTML = '<p>加载中...</p>';
        return;
    }

    const info = state.systemInfo;
    container.innerHTML = `
        <div class="info-grid">
            <div class="info-card">
                <h4>Docker 版本</h4>
                <p>${info.ServerVersion || '-'}</p>
            </div>
            <div class="info-card">
                <h4>操作系统</h4>
                <p>${info.OperatingSystem || '-'}</p>
            </div>
            <div class="info-card">
                <h4>架构</h4>
                <p>${info.Architecture || '-'}</p>
            </div>
            <div class="info-card">
                <h4>容器数量</h4>
                <p>${info.Containers || 0}</p>
            </div>
            <div class="info-card">
                <h4>运行中容器</h4>
                <p>${info.ContainersRunning || 0}</p>
            </div>
            <div class="info-card">
                <h4>已停止容器</h4>
                <p>${info.ContainersStopped || 0}</p>
            </div>
            <div class="info-card">
                <h4>镜像数量</h4>
                <p>${info.Images || 0}</p>
            </div>
            <div class="info-card">
                <h4>内存总量</h4>
                <p>${info.MemTotal ? formatBytes(info.MemTotal) : '-'}</p>
            </div>
            <div class="info-card">
                <h4>CPU 数量</h4>
                <p>${info.NCPU || 0}</p>
            </div>
        </div>
    `;
}

// 标签页切换
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;

            // 更新标签状态
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 更新内容显示
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabId}-tab`).classList.add('active');

            // 加载对应数据
            if (tabId === 'containers') loadContainers();
            if (tabId === 'images') loadImages();
            if (tabId === 'system') loadSystemInfo();
        });
    });
}

// 弹窗管理
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    const cancelBtn = document.getElementById('cancelBtn');

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('show');
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.getElementById('createContainerModal').classList.remove('show');
        });
    }
}

// 创建容器
function initCreateContainer() {
    const createBtn = document.getElementById('createContainerBtn');
    const confirmBtn = document.getElementById('confirmCreateBtn');

    if (createBtn) {
        createBtn.addEventListener('click', () => {
            document.getElementById('createContainerModal').classList.add('show');
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', async () => {
            const imageName = document.getElementById('imageName').value.trim();
            const containerName = document.getElementById('containerName').value.trim();
            const portMapping = document.getElementById('portMapping').value.trim();

            if (!imageName) {
                alert('请输入镜像名称');
                return;
            }

            try {
                let command = `run -d`;
                if (containerName) {
                    command += ` --name ${containerName}`;
                }
                if (portMapping) {
                    command += ` -p ${portMapping}`;
                }
                command += ` ${imageName}`;

                await fetchAPI('/exec', {
                    method: 'POST',
                    body: JSON.stringify({ command })
                });

                alert('容器创建成功');
                document.getElementById('createContainerModal').classList.remove('show');
                document.getElementById('imageName').value = '';
                document.getElementById('containerName').value = '';
                document.getElementById('portMapping').value = '';
                loadContainers();
            } catch (error) {
                console.error('创建容器失败:', error);
            }
        });
    }
}

// 刷新按钮
function initRefresh() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const activeTab = document.querySelector('.tab.active');
            if (activeTab) {
                const tabId = activeTab.dataset.tab;
                if (tabId === 'containers') loadContainers();
                if (tabId === 'images') loadImages();
                if (tabId === 'system') loadSystemInfo();
            }
        });
    }
}

// 初始化应用
async function init() {
    initTabs();
    initModals();
    initCreateContainer();
    initRefresh();

    // 初始加载容器列表
    await loadContainers();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 暴露全局函数
window.startContainer = startContainer;
window.stopContainer = stopContainer;
window.restartContainer = restartContainer;
window.deleteContainer = deleteContainer;
window.viewContainerDetail = viewContainerDetail;
