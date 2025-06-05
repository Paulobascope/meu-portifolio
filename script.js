
// Portfolio JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Loading animation
    const loading = document.getElementById('loading');
    
    // Hide loading after content loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.style.display = 'none';
            }, 300);
        }, 1000);
    });

    // Typing animation for hero section
    const typedTextElement = document.getElementById('typed-text');
    const typingCursor = document.getElementById('typing-cursor');
    
    const professions = [
        'Técnico em Informática',
        'Especialista em Suporte Técnico',
        'Profissional de Vendas',
        'Gestor de Equipes',
        'Especialista em Atendimento',
        'Entusiasta de Tecnologia'
    ];
    
    let currentProfessionIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    function typeWriter() {
        const currentProfession = professions[currentProfessionIndex];
        
        if (isDeleting) {
            // Apagando caracteres
            typedTextElement.textContent = currentProfession.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            
            if (currentCharIndex === 0) {
                isDeleting = false;
                currentProfessionIndex = (currentProfessionIndex + 1) % professions.length;
                setTimeout(typeWriter, 500); // Pausa antes de começar a escrever
                return;
            }
        } else {
            // Escrevendo caracteres
            typedTextElement.textContent = currentProfession.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            
            if (currentCharIndex === currentProfession.length) {
                setTimeout(() => {
                    isDeleting = true;
                    typeWriter();
                }, 2000); // Pausa com texto completo
                return;
            }
        }
        
        // Velocidade de digitação
        const typingSpeed = isDeleting ? 50 : 100;
        setTimeout(typeWriter, typingSpeed);
    }
    
    // Iniciar animação de digitação após um pequeno delay
    setTimeout(() => {
        typeWriter();
    }, 1500);

    // Dark mode functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    const html = document.documentElement;

    // Check for saved dark mode preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.classList.toggle('dark', savedTheme === 'dark');
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        html.classList.toggle('dark', prefersDark);
    }

    darkModeToggle.addEventListener('click', function() {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Add theme switch animation
        darkModeToggle.style.transform = 'scale(0.8)';
        setTimeout(() => {
            darkModeToggle.style.transform = 'scale(1)';
            lucide.createIcons();
        }, 150);
    });

    // Mobile menu functionality
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
        
        // Animate menu icon
        const icon = mobileMenuToggle.querySelector('[data-lucide]');
        if (mobileMenu.classList.contains('hidden')) {
            icon.setAttribute('data-lucide', 'menu');
        } else {
            icon.setAttribute('data-lucide', 'x');
        }
        lucide.createIcons();
    });

    // Close mobile menu when clicking on links
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuToggle.querySelector('[data-lucide]');
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });

    // Enhanced smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                // Add smooth scroll with easing
                smoothScrollTo(offsetTop, 800);
                
                // Add ripple effect to clicked link
                createRipple(this, e);
            }
        });
    });

    // Smooth scroll function with easing
    function smoothScrollTo(target, duration) {
        const start = window.pageYOffset;
        const distance = target - start;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, start, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // Ripple effect for buttons
    function createRipple(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Add ripple CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Active navigation highlighting with smooth transitions
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');

    function highlightActiveSection() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinksAll.forEach(link => {
                    link.classList.remove('text-primary-600', 'dark:text-primary-400');
                    link.classList.add('text-gray-700', 'dark:text-gray-300');
                    
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.remove('text-gray-700', 'dark:text-gray-300');
                        link.classList.add('text-primary-600', 'dark:text-primary-400');
                    }
                });
            }
        });
    }

    // Enhanced scroll animations with intersection observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });

    // Counter animation
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }

    // Trigger counter animation when counters come into view
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    });

    const counterSection = document.querySelector('#about');
    if (counterSection) {
        counterObserver.observe(counterSection);
    }

    // Parallax effect for hero section
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Enhanced scroll event listener with throttling
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                highlightActiveSection();
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll);

    // Welcome toast notification with enhanced styling
    function showToast() {
        const toast = document.getElementById('toast');
        setTimeout(() => {
            toast.style.transform = 'translateY(0) scale(1)';
            toast.style.opacity = '1';
            
            setTimeout(() => {
                toast.style.transform = 'translateY(100%) scale(0.8)';
                toast.style.opacity = '0';
            }, 4000);
        }, 2000);
    }

    showToast();

    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Contact form interaction enhancement
    const contactButtons = document.querySelectorAll('a[href^="mailto"], a[href^="https://wa.me"]');
    contactButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add a brief animation feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Create ripple effect
            createRipple(this, e);
        });
    });

    // Email copy functionality with enhanced feedback
    function copyEmail() {
        const email = 'paulobascope69@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
            showNotification('Email copiado para a área de transferência! 📧', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = email;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Email copiado para a área de transferência! 📧', 'success');
        });
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-500' : 'bg-blue-500';
        notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full opacity-0 transition-all duration-300`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i data-lucide="check" class="w-5 h-5 mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);

        // Initialize icon
        lucide.createIcons();

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Add click to copy email functionality
    const emailElements = document.querySelectorAll('a[href^="mailto:"], span, p');
    emailElements.forEach(element => {
        if (element.textContent.includes('paulobascope69@gmail.com')) {
            element.style.cursor = 'pointer';
            element.addEventListener('click', (e) => {
                e.preventDefault();
                copyEmail();
            });
            element.title = 'Clique para copiar o email';
        }
    });

    // Enhanced accessibility improvements
    document.addEventListener('keydown', function(e) {
        // ESC key to close mobile menu
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuToggle.querySelector('[data-lucide]');
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        }

        // Enter or Space to trigger button clicks
        if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('button, a')) {
            e.target.click();
        }
    });

    // Touch gesture support for mobile
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeDistance = touchStartY - touchEndY;
        const minSwipeDistance = 50;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            // Add swipe-based navigation if needed
            console.log(swipeDistance > 0 ? 'Swipe up detected' : 'Swipe down detected');
        }
    }

    // Initialize scroll animations on load
    highlightActiveSection();

    // Console welcome message
    console.log(`
    🎉 Bem-vindo ao portfólio de Paulo Bascope!
    
    📧 Contato: paulobascope69@gmail.com
    📱 WhatsApp: (69) 99907-7267
    
    Desenvolvido com ❤️ usando HTML, CSS, JavaScript e Tailwind CSS
    Agora com animações aprimoradas e interações modernas!
    `);

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`⚡ Página carregada em ${loadTime}ms`);
        });
    }

    // Add floating animation to decorative elements
    const floatingElements = document.querySelectorAll('.float');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
    });

    // Enhanced card interactions
    const cards = document.querySelectorAll('.card-hover, .experience-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScroll = debounce(() => {
    // Handle scroll-based animations here
}, 10);

window.addEventListener('scroll', optimizedScroll);

// Add viewport height fix for mobile
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewportHeight();
window.addEventListener('resize', setViewportHeight);
