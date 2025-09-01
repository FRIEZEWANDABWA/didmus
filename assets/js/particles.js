// ===== ADVANCED PARTICLES SYSTEM =====

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        this.isRunning = false;
        
        this.config = {
            particleCount: 80,
            maxDistance: 120,
            mouseRadius: 150,
            particleSpeed: 0.5,
            particleSize: { min: 1, max: 3 },
            colors: {
                primary: 'rgba(255, 215, 0, 0.8)',    // Gold
                secondary: 'rgba(34, 139, 34, 0.6)',   // Green
                accent: 'rgba(10, 25, 47, 0.4)',       // Navy
                connection: 'rgba(255, 215, 0, 0.2)'   // Gold for connections
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.createParticles();
        this.bindEvents();
        this.start();
    }
    
    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Recreate particles on resize
        if (this.particles.length > 0) {
            this.createParticles();
        }
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        const colors = Object.values(this.config.colors).slice(0, 3); // Exclude connection color
        
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * this.config.particleSpeed,
            vy: (Math.random() - 0.5) * this.config.particleSpeed,
            size: Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: Math.random() * 0.5 + 0.3,
            originalX: 0,
            originalY: 0,
            life: Math.random() * 100,
            maxLife: 100 + Math.random() * 100
        };
    }
    
    bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
        
        // Touch events for mobile
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mouse.x = touch.clientX - rect.left;
            this.mouse.y = touch.clientY - rect.top;
        });
        
        this.canvas.addEventListener('touchend', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
    }
    
    updateParticles() {
        this.particles.forEach((particle, index) => {
            // Update life
            particle.life++;
            
            // Regenerate particle if it's too old
            if (particle.life > particle.maxLife) {
                this.particles[index] = this.createParticle();
                return;
            }
            
            // Store original position for mouse interaction
            if (particle.life === 1) {
                particle.originalX = particle.x;
                particle.originalY = particle.y;
            }
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.config.mouseRadius) {
                const force = (this.config.mouseRadius - distance) / this.config.mouseRadius;
                const angle = Math.atan2(dy, dx);
                
                particle.vx -= Math.cos(angle) * force * 0.01;
                particle.vy -= Math.sin(angle) * force * 0.01;
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary collision with bounce
            if (particle.x <= 0 || particle.x >= this.canvas.width) {
                particle.vx *= -0.8;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            
            if (particle.y <= 0 || particle.y >= this.canvas.height) {
                particle.vy *= -0.8;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
            
            // Apply friction
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Gentle drift back to original area
            const returnForce = 0.001;
            particle.vx += (particle.originalX - particle.x) * returnForce;
            particle.vy += (particle.originalY - particle.y) * returnForce;
            
            // Update opacity based on life
            const lifeRatio = particle.life / particle.maxLife;
            particle.opacity = Math.sin(lifeRatio * Math.PI) * 0.5 + 0.3;
        });
    }
    
    drawParticles() {
        // Clear canvas with fade effect
        this.ctx.fillStyle = 'rgba(10, 25, 47, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections first (behind particles)
        this.drawConnections();
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.save();
            
            // Create gradient for particle
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 2
            );
            
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = gradient;
            
            // Draw particle with glow effect
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add inner glow
            this.ctx.globalAlpha = particle.opacity * 0.5;
            this.ctx.fillStyle = this.config.colors.primary;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
        
        // Draw mouse interaction effect
        this.drawMouseEffect();
    }
    
    drawConnections() {
        this.particles.forEach((particle, i) => {
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.maxDistance) {
                    const opacity = (1 - distance / this.config.maxDistance) * 0.3;
                    
                    this.ctx.save();
                    this.ctx.globalAlpha = opacity * Math.min(particle.opacity, otherParticle.opacity);
                    this.ctx.strokeStyle = this.config.colors.connection;
                    this.ctx.lineWidth = 1;
                    
                    // Create gradient line
                    const gradient = this.ctx.createLinearGradient(
                        particle.x, particle.y,
                        otherParticle.x, otherParticle.y
                    );
                    gradient.addColorStop(0, particle.color);
                    gradient.addColorStop(1, otherParticle.color);
                    this.ctx.strokeStyle = gradient;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                    
                    this.ctx.restore();
                }
            });
        });
    }
    
    drawMouseEffect() {
        if (this.mouse.x < 0 || this.mouse.y < 0) return;
        
        // Draw mouse glow
        const gradient = this.ctx.createRadialGradient(
            this.mouse.x, this.mouse.y, 0,
            this.mouse.x, this.mouse.y, this.config.mouseRadius
        );
        
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.1)');
        gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.05)');
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.save();
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.mouse.x, this.mouse.y, this.config.mouseRadius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
        
        // Draw ripple effect
        const time = Date.now() * 0.005;
        const rippleRadius = (Math.sin(time) * 0.5 + 0.5) * 30 + 20;
        
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        this.ctx.strokeStyle = this.config.colors.primary;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.mouse.x, this.mouse.y, rippleRadius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.updateParticles();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    destroy() {
        this.stop();
        window.removeEventListener('resize', this.resizeCanvas);
        this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
        this.canvas.removeEventListener('mouseleave', this.mouseLeaveHandler);
        this.canvas.removeEventListener('touchmove', this.touchMoveHandler);
        this.canvas.removeEventListener('touchend', this.touchEndHandler);
    }
}

// ===== FLOATING ELEMENTS SYSTEM =====
class FloatingElements {
    constructor(container) {
        this.container = container;
        this.elements = [];
        this.init();
    }
    
    init() {
        this.createElements();
        this.animate();
    }
    
    createElements() {
        const shapes = ['circle', 'triangle', 'square', 'diamond'];
        const colors = ['#FFD700', '#228B22', '#0A192F'];
        
        for (let i = 0; i < 15; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 20 + 10;
            
            element.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                opacity: ${Math.random() * 0.3 + 0.1};
                border-radius: ${shape === 'circle' ? '50%' : shape === 'diamond' ? '0' : '0'};
                transform: rotate(${Math.random() * 360}deg);
                pointer-events: none;
                z-index: 1;
            `;
            
            if (shape === 'triangle') {
                element.style.background = 'transparent';
                element.style.borderLeft = `${size/2}px solid transparent`;
                element.style.borderRight = `${size/2}px solid transparent`;
                element.style.borderBottom = `${size}px solid ${color}`;
                element.style.width = '0';
                element.style.height = '0';
            } else if (shape === 'diamond') {
                element.style.transform += ' rotate(45deg)';
            }
            
            // Random position
            element.style.left = Math.random() * 100 + '%';
            element.style.top = Math.random() * 100 + '%';
            
            // Animation properties
            element.animationData = {
                x: Math.random() * 100,
                y: Math.random() * 100,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 2
            };
            
            this.container.appendChild(element);
            this.elements.push(element);
        }
    }
    
    animate() {
        this.elements.forEach(element => {
            const data = element.animationData;
            
            // Update position
            data.x += data.vx;
            data.y += data.vy;
            data.rotation += data.rotationSpeed;
            
            // Boundary wrapping
            if (data.x > 100) data.x = -5;
            if (data.x < -5) data.x = 100;
            if (data.y > 100) data.y = -5;
            if (data.y < -5) data.y = 100;
            
            // Apply transforms
            element.style.left = data.x + '%';
            element.style.top = data.y + '%';
            element.style.transform = `rotate(${data.rotation}deg)`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const particleCanvas = document.getElementById('particleCanvas');
    if (particleCanvas) {
        window.particleSystem = new ParticleSystem(particleCanvas);
    }
    
    // Initialize floating elements for other sections
    const sectionsWithFloating = document.querySelectorAll('.newsletter, .quick-links');
    sectionsWithFloating.forEach(section => {
        if (!section.querySelector('.floating-elements')) {
            const container = document.createElement('div');
            container.className = 'floating-elements';
            container.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                pointer-events: none;
                z-index: 1;
            `;
            
            section.style.position = 'relative';
            section.appendChild(container);
            
            new FloatingElements(container);
        }
    });
});

// ===== PERFORMANCE OPTIMIZATION =====
// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (window.particleSystem) {
        if (document.hidden) {
            window.particleSystem.stop();
        } else {
            window.particleSystem.start();
        }
    }
});

// Reduce animations on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    // Reduce particle count for low-end devices
    if (window.particleSystem) {
        window.particleSystem.config.particleCount = 40;
        window.particleSystem.createParticles();
    }
}

// Respect user's motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable or reduce animations
    if (window.particleSystem) {
        window.particleSystem.stop();
    }
}