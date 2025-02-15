document.addEventListener('DOMContentLoaded', () => {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.navbar-link');
    
    // Add click event listeners to each nav link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Get the target section
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Smooth scroll to target section
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
            
            // Update active section
            document.querySelectorAll('section[data-page]').forEach(section => {
                section.classList.remove('active');
            });
            targetSection.classList.add('active');
        });
    });
    
    // Handle scroll events to update active state
    window.addEventListener('scroll', () => {
        let current = '';
        
        document.querySelectorAll('section[data-page]').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
});
