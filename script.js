// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling para navegación
    initSmoothScrolling();
    
    // Configurar animaciones de scroll
    initScrollAnimations();
    
    // Efectos del header al hacer scroll
    initHeaderScrollEffect();
    
    // Efectos interactivos en cards de proyectos
    initProjectCardEffects();
    
    // Efectos adicionales de hover
    initHoverEffects();
});

/**
 * Inicializar navegación suave entre secciones
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Configurar Intersection Observer para animaciones al hacer scroll
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Agregar delay progresivo para elementos en grid
                if (entry.target.classList.contains('project-card') || 
                    entry.target.classList.contains('skill-category')) {
                    addStaggeredAnimation(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observar todos los elementos con clase fade-in
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Agregar animación escalonada a elementos de grid
 */
function addStaggeredAnimation(element) {
    const siblings = Array.from(element.parentNode.children);
    const index = siblings.indexOf(element);
    
    element.style.transitionDelay = `${index * 0.1}s`;
}

/**
 * Efectos del header al hacer scroll
 */
function initHeaderScrollEffect() {
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Cambiar el fondo del header
        if (scrollTop > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.9)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.1)';
            header.style.backdropFilter = 'blur(20px)';
        }
        
        // Ocultar/mostrar header al hacer scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });
}

/**
 * Efectos interactivos en cards de proyectos
 */
function initProjectCardEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Efecto de click
        card.addEventListener('click', function(e) {
            // Solo aplicar efecto si no se clickeó en un enlace
            if (!e.target.classList.contains('project-link') && 
                !e.target.closest('.project-link')) {
                
                // Efecto de "pulse"
                this.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // Agregar un efecto de ondas
                createRippleEffect(e, this);
            }
        });
        
        // Efecto parallax sutil en la imagen del proyecto
        const projectImage = card.querySelector('.project-image');
        if (projectImage) {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;
                
                projectImage.style.transform = 
                    `perspective(1000px) rotateX(${deltaY * 5}deg) rotateY(${deltaX * 5}deg)`;
            });
            
            card.addEventListener('mouseleave', function() {
                projectImage.style.transform = '';
            });
        }
    });
}

/**
 * Crear efecto de ondas al hacer click
 */
function createRippleEffect(event, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    // Agregar keyframes para la animación de ripple si no existe
    if (!document.querySelector('#ripple-keyframes')) {
        const style = document.createElement('style');
        style.id = 'ripple-keyframes';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    
    element.appendChild(ripple);
    
    // Remover el elemento después de la animación
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/**
 * Efectos adicionales de hover y interactividad
 */
function initHoverEffects() {
    // Efecto parallax en el hero
    initHeroParallax();
    
    // Efecto de seguimiento del cursor en botones
    initCursorFollowEffect();
    
    // Animación de las skills al hacer hover
    initSkillsHoverEffect();
    
    // Efecto de typing en el título principal
    initTypingEffect();
}

/**
 * Efecto parallax sutil en la sección hero
 */
function initHeroParallax() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            heroContent.style.transform = `translateY(${parallax}px)`;
        }, { passive: true });
    }
}

/**
 * Efecto de seguimiento del cursor en botones principales
 */
function initCursorFollowEffect() {
    const buttons = document.querySelectorAll('.cta-button, .contact-link');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--mouse-x', x + 'px');
            this.style.setProperty('--mouse-y', y + 'px');
        });
    });
    
    // Agregar CSS para el efecto
    if (!document.querySelector('#cursor-follow-styles')) {
        const style = document.createElement('style');
        style.id = 'cursor-follow-styles';
        style.textContent = `
            .cta-button::before,
            .contact-link::before {
                content: '';
                position: absolute;
                top: var(--mouse-y, 50%);
                left: var(--mouse-x, 50%);
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.3s ease, height 0.3s ease;
                pointer-events: none;
                z-index: -1;
            }
            
            .cta-button:hover::before,
            .contact-link:hover::before {
                width: 100%;
                height: 100%;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Animación hover para las habilidades
 */
function initSkillsHoverEffect() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Efecto de "bounce" en elementos vecinos
            const siblings = Array.from(this.parentNode.children);
            const index = siblings.indexOf(this);
            
            siblings.forEach((sibling, i) => {
                const distance = Math.abs(i - index);
                const delay = distance * 50;
                const intensity = Math.max(0, 1 - distance * 0.3);
                
                setTimeout(() => {
                    sibling.style.transform = `translateY(-${intensity * 5}px) scale(${1 + intensity * 0.1})`;
                }, delay);
            });
        });
        
        item.addEventListener('mouseleave', function() {
            const siblings = Array.from(this.parentNode.children);
            siblings.forEach(sibling => {
                sibling.style.transform = '';
            });
        });
    });
}

/**
 * Efecto de typing en el título principal
 */
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero h1');
    if (!heroTitle) return;
    
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let charIndex = 0;
    
    function typeWriter() {
        if (charIndex < originalText.length) {
            heroTitle.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 100);
        } else {
            // Agregar cursor parpadeante
            setTimeout(() => {
                heroTitle.style.borderRight = '3px solid #ffd700';
                heroTitle.style.animation = 'blink 1s infinite';
            }, 500);
        }
    }
    
    // Iniciar el efecto después de un pequeño delay
    setTimeout(typeWriter, 1000);
    
    // Agregar keyframes para el cursor parpadeante
    if (!document.querySelector('#blink-keyframes')) {
        const style = document.createElement('style');
        style.id = 'blink-keyframes';
        style.textContent = `
            @keyframes blink {
                0%, 50% { border-color: #ffd700; }
                51%, 100% { border-color: transparent; }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Utility functions
 */

// Función para detectar si el usuario prefiere animaciones reducidas
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Función para agregar efectos de partículas de fondo (opcional)
function initBackgroundParticles() {
    // Esta función puede expandirse para agregar partículas animadas de fondo
    // usando Canvas API o WebGL para efectos más avanzados
}

// Función para lazy loading de imágenes (si se agregan imágenes reales)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Función para manejar el cambio de tema (día/noche)
function initThemeToggle() {
    // Esta función puede expandirse para implementar un toggle de tema
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Aplicar tema basado en preferencias del sistema
    if (prefersDarkScheme.matches) {
        document.body.classList.add('dark-theme');
    }
}

// Función para manejar errores de carga de recursos
function initErrorHandling() {
    window.addEventListener('error', function(e) {
        console.warn('Error de carga:', e.target);
        // Aquí se pueden manejar errores de carga de imágenes, scripts, etc.
    });
}

// Función para optimizar el rendimiento
function initPerformanceOptimizations() {
    // Usar requestAnimationFrame para animaciones suaves
    let ticking = false;
    
    function updateAnimations() {
        // Actualizar animaciones aquí
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    }
    
    // Throttle scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(requestTick, 10);
    }, { passive: true });
}

// Función para analytics y tracking (opcional)
function initAnalytics() {
    // Agregar tracking de interacciones si es necesario
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('project-link')) {
            // Track project link clicks
            console.log('Project link clicked:', e.target.textContent);
        }
        
        if (e.target.classList.contains('contact-link')) {
            // Track contact link clicks
            console.log('Contact link clicked:', e.target.textContent);
        }
    });
}

// Inicializar funciones adicionales si se necesitan
// initBackgroundParticles();
// initLazyLoading();
// initThemeToggle();
// initErrorHandling();
// initPerformanceOptimizations();
// initAnalytics();