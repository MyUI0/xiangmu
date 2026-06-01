// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏滚动效果
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 滚动动画观察器
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // 技能进度条动画
                entry.target.querySelectorAll('.skill-progress').forEach(progress => {
                    const width = progress.getAttribute('data-progress');
                    progress.style.width = width + '%';
                });
            }
        });
    }, observerOptions);

    // 给需要动画的元素添加fade-in类
    document.querySelectorAll('.skill-category, .project-card, .about-content, .contact-content').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // 技能进度条单独观察
    document.querySelectorAll('.skills').forEach(section => {
        observer.observe(section);
    });

    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 表单提交处理
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            console.log('表单提交:', data);
            
            // 显示成功提示（模拟）
            alert('感谢您的留言！我会尽快回复您。');
            contactForm.reset();
        });
    }

    // 移动端菜单
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            // 这里可以实现移动端菜单切换逻辑
            console.log('移动端菜单点击');
        });
    }

    // 项目卡片视差效果
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // 英雄区域鼠标跟随效果
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', function(e) {
            const shapes = document.querySelectorAll('.shape');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 20;
                const x = (mouseX - 0.5) * speed;
                const y = (mouseY - 0.5) * speed;
                shape.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    console.log('作品集网站已加载完成！');
});