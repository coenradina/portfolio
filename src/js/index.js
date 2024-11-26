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

            container.style.setProperty('--mouse-x', `${x}px`);
            container.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}