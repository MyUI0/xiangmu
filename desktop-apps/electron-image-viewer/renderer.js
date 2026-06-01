const { ipcRenderer } = require('electron');
const path = require('path');

let images = [];
let currentIndex = -1;
let originalImageData = null;
let currentImageData = null;
let img = new Image();
let zoom = 100;
let rotation = 0;
let filters = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  grayscale: false,
  invert: false
};

const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');

// 打开文件按钮
document.getElementById('openBtn').addEventListener('click', async () => {
  const result = await ipcRenderer.invoke('open-file-dialog');
  if (!result.canceled && result.filePaths.length > 0) {
    loadImages(result.filePaths);
  }
});

// 保存图片按钮
document.getElementById('saveBtn').addEventListener('click', async () => {
  if (currentIndex === -1) return;
  
  const dataURL = canvas.toDataURL('image/png');
  const base64 = dataURL.replace(/^data:image\/png;base64,/, '');
  
  const fileName = path.basename(images[currentIndex].path);
  const result = await ipcRenderer.invoke('save-image', base64, fileName);
  
  if (result.success) {
    alert('图片保存成功！');
  }
});

// 重置图片按钮
document.getElementById('resetBtn').addEventListener('click', () => {
  resetFilters();
  redrawImage();
});

// 缩放按钮
document.getElementById('zoomInBtn').addEventListener('click', () => {
  zoom = Math.min(zoom + 25, 400);
  updateZoom();
});

document.getElementById('zoomOutBtn').addEventListener('click', () => {
  zoom = Math.max(zoom - 25, 25);
  updateZoom();
});

// 旋转按钮
document.getElementById('rotateLeftBtn').addEventListener('click', () => {
  rotation = (rotation - 90) % 360;
  redrawImage();
});

document.getElementById('rotateRightBtn').addEventListener('click', () => {
  rotation = (rotation + 90) % 360;
  redrawImage();
});

// 滤镜滑动条
document.getElementById('brightness').addEventListener('input', (e) => {
  filters.brightness = parseInt(e.target.value);
  document.getElementById('brightnessValue').textContent = e.target.value;
  applyFilters();
});

document.getElementById('contrast').addEventListener('input', (e) => {
  filters.contrast = parseInt(e.target.value);
  document.getElementById('contrastValue').textContent = e.target.value;
  applyFilters();
});

document.getElementById('saturation').addEventListener('input', (e) => {
  filters.saturation = parseInt(e.target.value);
  document.getElementById('saturationValue').textContent = e.target.value;
  applyFilters();
});

// 滤镜按钮
document.getElementById('grayscaleBtn').addEventListener('click', () => {
  filters.grayscale = !filters.grayscale;
  applyFilters();
});

document.getElementById('invertBtn').addEventListener('click', () => {
  filters.invert = !filters.invert;
  applyFilters();
});

// 加载图片
function loadImages(filePaths) {
  images = filePaths.map((filePath, index) => ({
    path: filePath,
    name: path.basename(filePath)
  }));
  
  currentIndex = 0;
  renderThumbnails();
  loadCurrentImage();
}

// 渲染缩略图
function renderThumbnails() {
  const list = document.getElementById('thumbnailList');
  list.innerHTML = '';
  
  images.forEach((image, index) => {
    const thumb = document.createElement('div');
    thumb.className = 'thumbnail' + (index === currentIndex ? ' active' : '');
    
    const img = document.createElement('img');
    img.src = 'file://' + image.path;
    
    thumb.appendChild(img);
    thumb.addEventListener('click', () => {
      currentIndex = index;
      loadCurrentImage();
      renderThumbnails();
    });
    
    list.appendChild(thumb);
  });
}

// 加载当前图片
function loadCurrentImage() {
  if (currentIndex === -1) return;
  
  img = new Image();
  img.src = 'file://' + images[currentIndex].path;
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    
    ctx.drawImage(img, 0, 0);
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    resetFilters();
    zoom = 100;
    rotation = 0;
    
    document.getElementById('fileName').textContent = images[currentIndex].name;
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('imageContainer').style.display = 'block';
    document.getElementById('zoomControls').style.display = 'flex';
    
    updateZoom();
  };
}

// 重置滤镜
function resetFilters() {
  filters = {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    grayscale: false,
    invert: false
  };
  
  document.getElementById('brightness').value = 0;
  document.getElementById('brightnessValue').textContent = '0';
  document.getElementById('contrast').value = 0;
  document.getElementById('contrastValue').textContent = '0';
  document.getElementById('saturation').value = 0;
  document.getElementById('saturationValue').textContent = '0';
}

// 应用滤镜
function applyFilters() {
  if (!originalImageData) return;
  
  const data = new Uint8ClampedArray(originalImageData.data);
  
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    
    // 亮度调整
    const brightness = filters.brightness * 2.55;
    r += brightness;
    g += brightness;
    b += brightness;
    
    // 对比度调整
    const factor = (259 * (filters.contrast + 255)) / (255 * (259 - filters.contrast));
    r = factor * (r - 128) + 128;
    g = factor * (g - 128) + 128;
    b = factor * (b - 128) + 128;
    
    // 饱和度调整
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const saturation = filters.saturation / 100;
    r = gray + saturation * (r - gray);
    g = gray + saturation * (g - gray);
    b = gray + saturation * (b - gray);
    
    // 黑白滤镜
    if (filters.grayscale) {
      const avg = (r + g + b) / 3;
      r = g = b = avg;
    }
    
    // 反相滤镜
    if (filters.invert) {
      r = 255 - r;
      g = 255 - g;
      b = 255 - b;
    }
    
    // 限制范围
    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }
  
  currentImageData = new ImageData(data, originalImageData.width, originalImageData.height);
  redrawImage();
}

// 重绘图片
function redrawImage() {
  if (!currentImageData) return;
  
  canvas.width = currentImageData.width;
  canvas.height = currentImageData.height;
  ctx.putImageData(currentImageData, 0, 0);
  
  const container = document.getElementById('imageContainer');
  container.style.transform = `rotate(${rotation}deg) scale(${zoom / 100})`;
}

// 更新缩放显示
function updateZoom() {
  document.getElementById('zoomLevel').textContent = zoom + '%';
  redrawImage();
}
