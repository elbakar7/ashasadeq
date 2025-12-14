/**
 * ASHA ABDULRAHMAN - CFO Portfolio
 * Minimal JavaScript for subtle interactions
 */

(function() {
    'use strict';

    // Mark JS support early so CSS can safely animate without "blank hero" risk
    document.documentElement.classList.add('js');

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

    // ================================================
    // LUXURY ANIMATED BACKGROUND
    // Elegant floating particles with golden bokeh effect (hero-only)
    // ================================================
    const luxuryBackground = (function() {
        const canvas = document.getElementById('luxury-bg');
        const hero = document.getElementById('hero');
        if (!canvas || !hero) return { init: () => {}, destroy: () => {} };

        const ctx = canvas.getContext('2d');
        let particles = [];
        let width, height;
        let dpr = 1;
        let rafId = null;
        let lastTime = 0;
        let running = false;
        let resizeObserver = null;
        let intersectionObserver = null;

        // Luxury color palette
        const colors = {
            gold: 'rgba(184, 151, 126,',      // Primary gold
            goldLight: 'rgba(212, 175, 55,',   // Bright gold
            champagne: 'rgba(247, 231, 206,',  // Soft champagne
            navy: 'rgba(30, 42, 58,',          // Deep navy accent
        };

        // Particle class for elegant floating elements
        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.35;
                this.speedY = (Math.random() - 0.5) * 0.35;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.opacitySpeed = (Math.random() - 0.5) * 0.005;
                this.colorType = Math.random();
                this.pulsePhase = Math.random() * Math.PI * 2;
                this.pulseSpeed = 0.01 + Math.random() * 0.02;
            }

            update(dt) {
                // Gentle floating movement
                const s = dt / 16.67; // normalize to ~60fps
                this.x += this.speedX * s;
                this.y += this.speedY * s;

                // Subtle pulse effect
                this.pulsePhase += this.pulseSpeed * s;
                const pulse = Math.sin(this.pulsePhase) * 0.2 + 1;
                this.currentSize = this.size * pulse;

                // Opacity breathing effect
                this.opacity += this.opacitySpeed * s;
                if (this.opacity > 0.6 || this.opacity < 0.05) {
                    this.opacitySpeed *= -1;
                }

                // Wrap around screen edges
                if (this.x < -10) this.x = width + 10;
                if (this.x > width + 10) this.x = -10;
                if (this.y < -10) this.y = height + 10;
                if (this.y > height + 10) this.y = -10;
            }

            draw() {
                // Choose color based on particle type
                let color;
                if (this.colorType < 0.5) {
                    color = colors.gold;
                } else if (this.colorType < 0.75) {
                    color = colors.goldLight;
                } else if (this.colorType < 0.9) {
                    color = colors.champagne;
                } else {
                    color = colors.navy;
                }

                // Draw soft bokeh circle with gradient
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.currentSize * 3
                );
                gradient.addColorStop(0, color + this.opacity + ')');
                gradient.addColorStop(0.5, color + (this.opacity * 0.5) + ')');
                gradient.addColorStop(1, color + '0)');

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.currentSize * 3, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Add bright center point
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.currentSize * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = color + (this.opacity * 1.5) + ')';
                ctx.fill();
            }
        }

        // Larger floating orb class for bokeh effect
        class BokehOrb {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 80 + 40;
                this.speedX = (Math.random() - 0.5) * 0.12;
                this.speedY = (Math.random() - 0.5) * 0.12;
                this.opacity = Math.random() * 0.08 + 0.02;
                this.colorType = Math.random();
                this.phase = Math.random() * Math.PI * 2;
                this.phaseSpeed = 0.002 + Math.random() * 0.004;
            }

            update(dt) {
                const s = dt / 16.67;
                this.x += this.speedX * s;
                this.y += this.speedY * s;
                this.phase += this.phaseSpeed * s;

                // Gentle boundary bounce
                if (this.x < -this.size || this.x > width + this.size) {
                    this.speedX *= -1;
                }
                if (this.y < -this.size || this.y > height + this.size) {
                    this.speedY *= -1;
                }
            }

            draw() {
                const color = this.colorType < 0.7 ? colors.gold : colors.champagne;
                const breathe = Math.sin(this.phase) * 0.12 + 1;
                
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size
                );
                gradient.addColorStop(0, color + (this.opacity * 0.8) + ')');
                gradient.addColorStop(0.4, color + (this.opacity * 0.3) + ')');
                gradient.addColorStop(1, color + '0)');

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * breathe, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        }

        // Elegant connecting line between nearby particles
        function drawConnections() {
            const maxDistance = Math.min(160, Math.max(120, Math.floor(Math.min(width, height) * 0.2)));
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = colors.gold + opacity + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        let bokehOrbs = [];

        function resize() {
            const rect = hero.getBoundingClientRect();
            width = Math.max(1, Math.floor(rect.width));
            height = Math.max(1, Math.floor(rect.height));

            dpr = Math.min(2, window.devicePixelRatio || 1);
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function createParticles() {
            particles = [];
            bokehOrbs = [];
            
            // Create small floating particles
            const particleCount = Math.min(85, Math.floor((width * height) / 16000));
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }

            // Create large bokeh orbs
            const orbCount = Math.min(10, Math.max(5, Math.floor(width / 180)));
            for (let i = 0; i < orbCount; i++) {
                bokehOrbs.push(new BokehOrb());
            }
        }

        function drawLuxSweep(t) {
            // A very subtle moving highlight sweep for "luxury" feel
            const x = (t * 0.02) % (width + 400) - 200;
            const sweep = ctx.createLinearGradient(x - 200, 0, x + 200, height);
            sweep.addColorStop(0, 'rgba(255, 255, 255, 0)');
            sweep.addColorStop(0.5, 'rgba(255, 255, 255, 0.06)');
            sweep.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = sweep;
            ctx.fillRect(0, 0, width, height);
        }

        function renderFrame(dt, now) {
            ctx.clearRect(0, 0, width, height);

            // Update motion
            bokehOrbs.forEach(orb => orb.update(dt));
            particles.forEach(particle => particle.update(dt));

            // Draw large bokeh orbs first (background layer)
            bokehOrbs.forEach(orb => orb.draw());

            // Draw connecting lines
            drawConnections();

            // Draw particles
            particles.forEach(particle => particle.draw());

            // Top highlight sweep
            drawLuxSweep(now);
        }

        function loop(now) {
            if (!running) return;
            const dt = Math.min(48, Math.max(8, now - lastTime || 16.67));
            lastTime = now;
            renderFrame(dt, now);
            rafId = window.requestAnimationFrame(loop);
        }

        function init() {
            resize();
            createParticles();

            // Use ResizeObserver when available to match the hero size exactly
            if ('ResizeObserver' in window) {
                resizeObserver = new ResizeObserver(() => {
                    resize();
                    createParticles();
                });
                resizeObserver.observe(hero);
            } else {
                window.addEventListener('resize', onWindowResize, { passive: true });
            }

            // Pause when hero is off-screen
            if ('IntersectionObserver' in window) {
                intersectionObserver = new IntersectionObserver((entries) => {
                    const entry = entries[0];
                    const shouldRun = !!entry && entry.isIntersecting;
                    if (shouldRun) start();
                    else stop();
                }, { root: null, threshold: 0.05 });
                intersectionObserver.observe(hero);
            }

            start();
        }

        function onWindowResize() {
            resize();
            createParticles();
        }

        function start() {
            if (running) return;
            running = true;
            lastTime = performance.now();
            rafId = window.requestAnimationFrame(loop);
        }

        function stop() {
            running = false;
            if (rafId) window.cancelAnimationFrame(rafId);
            rafId = null;
        }

        function destroy() {
            stop();
            if (resizeObserver) {
                resizeObserver.disconnect();
                resizeObserver = null;
            } else {
                window.removeEventListener('resize', onWindowResize);
            }
            if (intersectionObserver) {
                intersectionObserver.disconnect();
                intersectionObserver = null;
            }
        }

        return { init, destroy };
    })();

    // Initialize luxury background
    if (!prefersReducedMotion || !prefersReducedMotion.matches) luxuryBackground.init();

    // ================================================
    // DOM Elements
    // ================================================
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contact-form');
    const sections = document.querySelectorAll('.section');

    // ================================================
    // Navigation - Scroll Effect
    // ================================================
    function handleNavScroll() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ================================================
    // Mobile Navigation Toggle
    // ================================================
    function toggleMobileNav() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileNav() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', toggleMobileNav);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    // Close mobile nav on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileNav();
        }
    });

    // ================================================
    // Smooth Scroll with Offset
    // ================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = nav.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ================================================
    // Subtle Fade-in Animation on Scroll
    // ================================================
    function initFadeInAnimations() {
        const fadeElements = document.querySelectorAll(
            '.section-header, .about-text, .about-values, .timeline-item, ' +
            '.competency-card, .education-card, .contact-info, .contact-form'
        );

        fadeElements.forEach(el => el.classList.add('fade-in'));

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => observer.observe(el));
    }

    // Check for reduced motion preference
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        initFadeInAnimations();
    }

    // ================================================
    // Contact Form Handling
    // ================================================
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Simple validation
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const message = formData.get('message').trim();
            
            if (!name || !email || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent';
                submitBtn.style.backgroundColor = '#4a7c59';
                
                // Reset form
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                }, 3000);
            }, 1500);
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFormMessage(message, type) {
        // Remove existing message if any
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message--${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            padding: 0.75rem 1rem;
            margin-bottom: 1rem;
            font-size: 0.875rem;
            border-radius: 2px;
            background-color: ${type === 'error' ? 'rgba(220, 53, 69, 0.1)' : 'rgba(40, 167, 69, 0.1)'};
            color: ${type === 'error' ? '#dc3545' : '#28a745'};
            border: 1px solid ${type === 'error' ? 'rgba(220, 53, 69, 0.2)' : 'rgba(40, 167, 69, 0.2)'};
        `;
        
        contactForm.insertBefore(messageEl, contactForm.firstChild);
        
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }

    // ================================================
    // Active Navigation Link on Scroll
    // ================================================
    function highlightActiveNavLink() {
        const scrollPosition = window.scrollY + nav.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveNavLink, { passive: true });

    // ================================================
    // Initialize on DOM Ready
    // ================================================
    function onReady() {
        // Initial scroll check
        handleNavScroll();
        highlightActiveNavLink();
        
        // Add loaded class to body for any CSS transitions
        window.requestAnimationFrame(() => {
            document.body.classList.add('loaded');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
    } else {
        onReady();
    }

    // ================================================
    // Handle page visibility for performance
    // ================================================
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            luxuryBackground.destroy();
        } else {
            if (!prefersReducedMotion || !prefersReducedMotion.matches) luxuryBackground.init();
        }
    });

})();
