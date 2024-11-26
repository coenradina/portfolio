document.addEventListener('DOMContentLoaded', function() {
    const scrollDownArrow = document.getElementById('scroll-down-arrow');
    const nextSection = document.getElementById('about');

    scrollDownArrow.addEventListener('click', function() {
        const navHeight = document.querySelector('nav').offsetHeight;
        const targetPosition = nextSection.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });

    initNavAnimation();
    initGlassmorphism();
    initColorSwitcher();
});

function initNavAnimation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate distance from center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Magnetic effect
            const deltaX = (x - centerX) * 0.2;
            const deltaY = (y - centerY) * 0.2;
            
            link.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            
            // Update gradient position
            const gradientX = (x / rect.width) * 100;
            link.style.setProperty('--x', `${gradientX}%`);
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translate(0, 0)';
        });
    });
}

function initGlassmorphism() {
    const glassContainers = document.querySelectorAll('.glass-container');
    const glassBlur = document.querySelector('.glass-blur');

    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            if (glassBlur) {
                const x = (e.clientX / window.innerWidth) * 100;
                const y = (e.clientY / window.innerHeight) * 100;
                
                glassBlur.style.setProperty('--mouse-x', `${x}%`);
                glassBlur.style.setProperty('--mouse-y', `${y}%`);
            }

            glassContainers.forEach(container => {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Smooth the movement with lerp (linear interpolation)
                const currentX = parseFloat(container.style.getPropertyValue('--mouse-x')) || x;
                const currentY = parseFloat(container.style.getPropertyValue('--mouse-y')) || y;
                
                const newX = currentX + (x - currentX) * 0.1;
                const newY = currentY + (y - currentY) * 0.1;
                
                container.style.setProperty('--mouse-x', `${newX}px`);
                container.style.setProperty('--mouse-y', `${newY}px`);
            });
        });
    });

    // Add hover effect for touch devices
    glassContainers.forEach(container => {
        container.addEventListener('touchstart', () => {
            container.classList.add('hover');
        });
        
        container.addEventListener('touchend', () => {
            container.classList.remove('hover');
        });
    });
}

function initColorSwitcher() {
    const colorOptions = document.querySelectorAll('.color-option');
    const projectSection = document.getElementById('projects');
    
    // Store original colors to revert if needed
    const originalColors = {
        primary: getComputedStyle(document.documentElement)
            .getPropertyValue('--color-primary').trim(),
        secondary: getComputedStyle(document.documentElement)
            .getPropertyValue('--color-secondary').trim()
    };

    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            colorOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            const newColor = this.dataset.color;
            
            // Apply the color change with smooth transition
            const cards = projectSection.querySelectorAll('.card-base');
            cards.forEach(card => {
                // Create a liquid transition effect
                card.style.transition = 'border-color 0.5s ease, transform 0.5s ease, box-shadow 0.5s ease';
                
                // Update border color
                card.style.borderColor = newColor;
                
                // Update hover state in CSS
                const style = document.createElement('style');
                style.textContent = `
                    .card-base:hover {
                        border-color: ${newColor}!important;
                        box-shadow: 0 0 20px ${newColor}20;
                    }
                `;
                document.head.appendChild(style);
            });

            // Update explore link colors
            const exploreLinks = projectSection.querySelectorAll('.explore-link');
            exploreLinks.forEach(link => {
                link.style.transition = 'border-color 0.5s ease, background-color 0.5s ease';
                link.style.borderColor = newColor;
                
                // Add hover effect
                const style = document.createElement('style');
                style.textContent = `
                    .explore-link:hover {
                        border-color: ${newColor}!important;
                        background-color: ${newColor}10;
                    }
                `;
                document.head.appendChild(style);
            });
        });
    });
}