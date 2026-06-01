// 文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initToc();
    initCopyButton();
});

// 初始化主题功能
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('pretext-theme') || 'light';
    
    // 设置初始主题
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // 主题切换按钮点击事件
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('pretext-theme', newTheme);
    });
}

// 初始化目录导航功能
function initToc() {
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('.doc-section');
    
    // 目录链接点击事件
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 移除所有激活状态
            tocLinks.forEach(l => l.parentElement.classList.remove('active'));
            
            // 添加当前链接的激活状态
            this.parentElement.classList.add('active');
        });
    });
    
    // 滚动监听，更新目录激活状态
    window.addEventListener('scroll', function() {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        if (currentSectionId) {
            tocLinks.forEach(link => {
                link.parentElement.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentSectionId) {
                    link.parentElement.classList.add('active');
                }
            });
        }
    });
}

// 初始化代码复制功能
function initCopyButton() {
    const copyBtn = document.getElementById('copyBtn');
    const codeElement = document.querySelector('.code-block code');
    
    if (copyBtn && codeElement) {
        copyBtn.addEventListener('click', function() {
            const code = codeElement.textContent;
            
            // 使用现代 API 复制到剪贴板
            navigator.clipboard.writeText(code).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '已复制!';
                
                // 2秒后恢复原文本
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('复制失败:', err);
                copyBtn.textContent = '复制失败';
                setTimeout(() => {
                    copyBtn.textContent = '复制';
                }, 2000);
            });
        });
    }
}

// 简单的代码高亮（基础版本）
function highlightCode() {
    const codeBlocks = document.querySelectorAll('code');
    
    codeBlocks.forEach(block => {
        let text = block.textContent;
        
        // 简单的 JavaScript 高亮
        if (block.classList.contains('language-javascript')) {
            // 注释
            text = text.replace(/(\/\/.*$)/gm, '<span style="color: #6b7280">$1</span>');
            
            // 关键字
            const keywords = ['class', 'constructor', 'function', 'return', 'const', 'let', 'var', 'if', 'else', 'for', 'while'];
            keywords.forEach(keyword => {
                const regex = new RegExp('\\b' + keyword + '\\b', 'g');
                text = text.replace(regex, '<span style="color: #c084fc">' + keyword + '</span>');
            });
            
            // 字符串
            text = text.replace(/(['"])(?:(?!\1|\\).|\\.)*\1/g, '<span style="color: #4ade80">$&</span>');
            
            block.innerHTML = text;
        }
    });
}

// 延迟执行代码高亮
setTimeout(highlightCode, 100);