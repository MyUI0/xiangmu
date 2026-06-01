const express = require('express');
const cors = require('cors');
const Docker = require('dockerode');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 初始化Docker客户端
const docker = new Docker();

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname, '../frontend')));

// API路由

// 获取所有容器
app.get('/api/containers', async (req, res) => {
  try {
    const containers = await docker.listContainers({ all: true });
    res.json(containers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个容器详情
app.get('/api/containers/:id', async (req, res) => {
  try {
    const container = docker.getContainer(req.params.id);
    const data = await container.inspect();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 启动容器
app.post('/api/containers/:id/start', async (req, res) => {
  try {
    const container = docker.getContainer(req.params.id);
    await container.start();
    res.json({ message: '容器启动成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 停止容器
app.post('/api/containers/:id/stop', async (req, res) => {
  try {
    const container = docker.getContainer(req.params.id);
    await container.stop();
    res.json({ message: '容器停止成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 重启容器
app.post('/api/containers/:id/restart', async (req, res) => {
  try {
    const container = docker.getContainer(req.params.id);
    await container.restart();
    res.json({ message: '容器重启成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除容器
app.delete('/api/containers/:id', async (req, res) => {
  try {
    const container = docker.getContainer(req.params.id);
    await container.remove({ force: req.query.force === 'true' });
    res.json({ message: '容器删除成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取所有镜像
app.get('/api/images', async (req, res) => {
  try {
    const images = await docker.listImages();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取Docker系统信息
app.get('/api/system/info', async (req, res) => {
  try {
    const info = await docker.info();
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 执行Docker命令
app.post('/api/exec', (req, res) => {
  const { command } = req.body;
  if (!command) {
    return res.status(400).json({ error: '命令不能为空' });
  }

  exec(`docker ${command}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message, stderr });
    }
    res.json({ output: stdout, stderr });
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Docker管理平台后端服务运行在 http://localhost:${PORT}`);
});
