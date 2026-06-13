// ============ 导航栏滚动效果 ============
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============ 移动端菜单切换 ============
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// 创建菜单背景遮罩
var navOverlay = document.createElement('div');
navOverlay.id = 'navOverlay';
navOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:998;display:none;opacity:0;transition:opacity 0.3s ease;';
document.body.appendChild(navOverlay);

function toggleNav(show) {
    if (show) {
        navLinks.classList.add('active');
        navOverlay.style.display = 'block';
        setTimeout(function() { navOverlay.style.opacity = '1'; }, 10);
        document.body.style.overflow = 'hidden';
    } else {
        navLinks.classList.remove('active');
        navOverlay.style.opacity = '0';
        setTimeout(function() { navOverlay.style.display = 'none'; }, 300);
        document.body.style.overflow = '';
    }
}

menuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    if (navLinks.classList.contains('active')) {
        toggleNav(false);
    } else {
        toggleNav(true);
    }
});

navOverlay.addEventListener('click', function() {
    toggleNav(false);
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        toggleNav(false);
    });
});

// ============ 加密信息解密功能 ============
(function initDecrypt() {
    const CORRECT_PASSWORD = 'Zyh@176200';

    const decryptBtn = document.getElementById('decryptBtn');
    const encryptedBody = document.getElementById('encryptedBody');
    const passwordScreen = document.getElementById('passwordScreen');
    const passwordInput = document.getElementById('passwordInput');
    const passwordSubmit = document.getElementById('passwordSubmit');
    const passwordError = document.getElementById('passwordError');
    const attemptsInfo = document.getElementById('attemptsInfo');
    const decryptAnim = document.getElementById('decryptAnim');
    const matrixText = document.getElementById('matrixText');
    const progressBar = document.getElementById('progressBar');
    const decryptHint = document.getElementById('decryptHint');
    const realInfo = document.getElementById('realInfo');
    const lockIcon = document.getElementById('lockIcon');
    const decryptLabel = document.getElementById('decryptLabel');
    const arrowIcon = document.getElementById('arrowIcon');
    const lockAgainBtn = document.getElementById('lockAgainBtn');

    if (!decryptBtn) return;

    let isDecrypted = false;
    let isDecrypting = false;
    let attempts = 0;
    const maxAttempts = 5;

    // 矩阵字符集
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*';

    function randomMatrix(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    // 提交密码
    function submitPassword() {
        const val = passwordInput.value;
        if (!val) return;

        if (val === CORRECT_PASSWORD) {
            // 密码正确 → 开始解密动画
            passwordScreen.style.display = 'none';
            decryptAnim.style.display = 'block';
            startDecryptAnimation();
        } else {
            // 密码错误
            attempts++;
            passwordInput.value = '';
            passwordInput.focus();

            if (attempts >= maxAttempts) {
                passwordError.textContent = '❌ 错误次数过多，请稍后再试';
                passwordInput.disabled = true;
                passwordSubmit.disabled = true;
                setTimeout(() => {
                    passwordInput.disabled = false;
                    passwordSubmit.disabled = false;
                    attempts = 0;
                    attemptsInfo.textContent = '';
                    passwordError.textContent = '';
                }, 30000); // 30秒后重置
            } else {
                passwordError.textContent = '❌ 密码错误，请重试（' + (maxAttempts - attempts) + ' 次机会剩余）';
                attemptsInfo.textContent = '已尝试 ' + attempts + '/' + maxAttempts + ' 次';
            }
        }
    }

    // 解密动画
    function startDecryptAnimation() {
        isDecrypting = true;
        let progress = 0;
        const totalSteps = 80;
        let currentStep = 0;

        progressBar.style.width = '0%';
        decryptHint.textContent = '正在初始化解密模块...';

        const interval = setInterval(() => {
            currentStep++;
            progress = Math.min(100, (currentStep / totalSteps) * 100);
            progressBar.style.width = progress + '%';

            // 矩阵文字
            let output = '';
            for (let l = 0; l < 3; l++) {
                output += randomMatrix(45 + Math.floor(Math.random() * 20)) + '\n';
            }
            matrixText.textContent = output;

            // 阶段提示
            if (progress < 15) {
                decryptHint.textContent = '🔄 正在连接加密服务器...';
            } else if (progress < 30) {
                decryptHint.textContent = '🔓 正在验证访问权限...';
            } else if (progress < 50) {
                decryptHint.textContent = '📦 正在解析加密数据...';
            } else if (progress < 70) {
                decryptHint.textContent = '🔍 正在还原原始信息...';
                if (progress > 55) {
                    const partial = '张███ | 海███大学 | 软件██'.split('');
                    let revealed = '';
                    for (let c of partial) {
                        if (c === ' ' || Math.random() < (progress - 55) / 15) {
                            revealed += c;
                        } else {
                            revealed += '█';
                        }
                    }
                    decryptHint.innerHTML = '🔍 正在还原原始信息...<br><small style="color:#0f0;">' + revealed + '</small>';
                }
            } else if (progress < 90) {
                decryptHint.textContent = '✅ 数据完整性验证通过...';
            } else {
                decryptHint.textContent = '🎉 解密完成！正在加载...';
            }

            if (currentStep >= totalSteps) {
                clearInterval(interval);
                setTimeout(() => {
                    decryptAnim.style.display = 'none';
                    realInfo.style.display = 'block';
                    isDecrypted = true;
                    isDecrypting = false;

                    // 更新按钮状态
                    lockIcon.className = 'fas fa-unlock';
                    decryptLabel.innerHTML = '🔓 已解密 — 点击收起';
                    arrowIcon.style.transform = 'rotate(90deg)';
                }, 600);
            }
        }, 50);
    }

    // 点击解密按钮 → 展开/收起
    decryptBtn.addEventListener('click', function(e) {
        e.stopPropagation();

        if (isDecrypted) {
            // 已解密：切换显示/隐藏真实信息
            if (realInfo.style.display === 'none') {
                realInfo.style.display = 'block';
                arrowIcon.style.transform = 'rotate(90deg)';
            } else {
                realInfo.style.display = 'none';
                arrowIcon.style.transform = 'rotate(0deg)';
            }
            return;
        }

        // 未解密：展开密码输入区
        if (encryptedBody.classList.contains('show')) {
            // 已展开 → 收起
            encryptedBody.classList.remove('show');
            decryptBtn.classList.remove('active');
            passwordInput.value = '';
            passwordError.textContent = '';
        } else {
            // 未展开 → 展开
            encryptedBody.classList.add('show');
            decryptBtn.classList.add('active');
            passwordInput.focus();
        }
    });

    // 提交密码（按钮点击）
    passwordSubmit.addEventListener('click', function(e) {
        e.stopPropagation();
        submitPassword();
    });

    // 提交密码（回车）
    passwordInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitPassword();
        }
    });

    // 重新锁定
    if (lockAgainBtn) {
        lockAgainBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            realInfo.style.display = 'none';
            passwordScreen.style.display = 'block';
            passwordInput.value = '';
            passwordError.textContent = '';
            isDecrypted = false;
            lockIcon.className = 'fas fa-lock';
            decryptLabel.innerHTML = '🔒 点击解密隐藏信息';
            arrowIcon.style.transform = 'rotate(0deg)';
        });
    }
})();

// ============ 滚动动画 ============
function checkFadeIn() {
    const fadeElements = document.querySelectorAll('.section, .skill-card, .portfolio-item, .blog-card, .contact-item');
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in', 'visible');
        }
    });
}

// ============ 数字动画 ============
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateNumber = () => {
            current += step;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = target;
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateNumber();
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(stat);
    });
}

// ============ 平滑滚动 ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// ============ 表单提交 ============
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('感谢您的消息！我会尽快回复您。');
        this.reset();
    });
}

// ============ 下载简历 ============
const downloadResumeBtn = document.getElementById('download-resume');
if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        alert('简历下载功能即将上线！目前请通过联系表单与我取得联系。');
    });
}

// ============ 页面初始化 ============
document.addEventListener('DOMContentLoaded', function() {
    // 移动端不启用 fade-in 动画（性能和兼容性考虑）
    if (window.innerWidth > 768) {
        const animateElements = document.querySelectorAll('.section, .skill-card, .portfolio-item, .blog-card, .contact-item');
        animateElements.forEach(el => {
            el.classList.add('fade-in');
        });
        checkFadeIn();
        window.addEventListener('scroll', checkFadeIn);
    }
    animateNumbers();
});

// ============ 页面加载动画 ============
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});

console.log('%c Zephyr 的个人网站 ', 'background: #00ff41; color: #0a0a0a; font-size: 18px; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
console.log('%c「用代码写诗，用AI作画」', 'color: #0099ff; font-size: 13px;');

// ============ 弹窗功能 ============
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto'; // 恢复背景滚动
    }
}

// 点击弹窗背景关闭弹窗
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });
});

// ESC键关闭弹窗
window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            closeModal(activeModal.id);
        }
    }
});
