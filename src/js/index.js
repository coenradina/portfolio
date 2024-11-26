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

    // Trigger the default color
    const defaultColor = document.querySelector('.color-option.active');
    if (defaultColor) {
        defaultColor.click();
    }
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
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            colorOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            const newColor = this.dataset.color;
            const newColorRGB = hexToRGB(newColor);
            
            // Create dynamic styles for the color theme
            const styleSheet = document.createElement('style');
            styleSheet.textContent = `
                #projects {
                    --theme-primary: ${newColor};
                    --theme-primary-rgb: ${newColorRGB.r}, ${newColorRGB.g}, ${newColorRGB.b};
                }
                
                #projects .card-base {
                    border-color: ${newColor};
                    background-color: rgba(var(--theme-primary-rgb), 0.03);
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                #projects .card-base:hover {
                    border-color: ${newColor};
                    background-color: rgba(var(--theme-primary-rgb), 0.08);
                    box-shadow: 0 8px 32px rgba(var(--theme-primary-rgb), 0.15);
                }
                
                #projects h3 {
                    color: ${newColor};
                }
                
                #projects .explore-link {
                    background-color: ${newColor};
                    border-color: ${newColor};
                }
                
                #projects .explore-link:hover {
                    background-color: transparent;
                    border-color: ${newColor};
                    color: ${newColor};
                }
                
                #projects .explore-link:hover svg {
                    color: ${newColor};
                }
                
                #projects .px-2.py-1.bg-background-dark {
                    background-color: rgba(var(--theme-primary-rgb), 0.1);
                    color: ${newColor};
                }
            `;
            
            // Remove any previous color switcher styles
            const existingStyles = document.querySelectorAll('style[data-color-switcher]');
            existingStyles.forEach(style => style.remove());
            
            // Add the new styles
            styleSheet.setAttribute('data-color-switcher', '');
            document.head.appendChild(styleSheet);
            
            // Add liquid transition effect
            const cards = projectSection.querySelectorAll('.card-base');
            cards.forEach(card => {
                card.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 200);
            });
        });
    });
}

// Helper function to convert hex to RGB
function hexToRGB(hex) {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Convert to RGB values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
}