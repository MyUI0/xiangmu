function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}天 ${hours}小时 ${minutes}分钟`;
}

function getProgressClass(percent) {
    if (percent >= 90) return 'danger';
    if (percent >= 70) return 'warning';
    return '';
}

function updateMetrics(data) {
    document.getElementById('hostname').textContent = data.system.hostname;
    document.getElementById('update-time').textContent = data.timestamp;

    document.getElementById('info-hostname').textContent = data.system.hostname;
    document.getElementById('info-ip').textContent = data.system.ip_address;
    document.getElementById('info-system').textContent = `${data.system.system} ${data.system.release}`;
    document.getElementById('info-uptime').textContent = formatUptime(data.system.uptime);

    const cpuBar = document.getElementById('cpu-bar');
    const cpuPercent = data.cpu.percent;
    cpuBar.style.width = cpuPercent + '%';
    cpuBar.className = 'progress-bar ' + getProgressClass(cpuPercent);
    document.getElementById('cpu-text').textContent = cpuPercent + '%';
    document.getElementById('cpu-cores').textContent = data.cpu.cores;
    document.getElementById('cpu-freq').textContent = (data.cpu.freq_current / 1000).toFixed(2) + ' GHz';

    const memBar = document.getElementById('memory-bar');
    const memPercent = data.memory.percent;
    memBar.style.width = memPercent + '%';
    memBar.className = 'progress-bar ' + getProgressClass(memPercent);
    document.getElementById('memory-text').textContent = memPercent + '%';
    document.getElementById('memory-used').textContent = formatBytes(data.memory.used);
    document.getElementById('memory-total').textContent = formatBytes(data.memory.total);

    const diskList = document.getElementById('disk-list');
    diskList.innerHTML = '';
    data.disk.partitions.forEach(disk => {
        const diskItem = document.createElement('div');
        diskItem.className = 'disk-item';
        const diskClass = getProgressClass(disk.percent);
        diskItem.innerHTML = `
            <div class="disk-header">
                <span class="disk-mount">${disk.mountpoint}</span>
                <span>${formatBytes(disk.used)} / ${formatBytes(disk.total)}</span>
            </div>
            <div class="disk-progress">
                <div class="disk-progress-bar ${diskClass}" style="width: ${disk.percent}%">
                    ${disk.percent}%
                </div>
            </div>
        `;
        diskList.appendChild(diskItem);
    });

    document.getElementById('network-sent').textContent = formatBytes(data.network.bytes_sent);
    document.getElementById('network-recv').textContent = formatBytes(data.network.bytes_recv);
    document.getElementById('network-conn').textContent = data.network.connections;

    const processList = document.getElementById('process-list');
    processList.innerHTML = '';
    data.processes.forEach(proc => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${proc.pid}</td>
            <td>${proc.name}</td>
            <td>${proc.username}</td>
            <td>${proc.cpu_percent}%</td>
            <td>${formatBytes(proc.memory_rss)}</td>
        `;
        processList.appendChild(row);
    });
}

function fetchMetrics() {
    fetch('/api/metrics')
        .then(response => response.json())
        .then(data => {
            updateMetrics(data);
        })
        .catch(error => {
            console.error('获取数据失败:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    fetchMetrics();
    setInterval(fetchMetrics, 5000);
});
