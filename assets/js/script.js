'use strict';

// Element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// Sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// Sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { 
    elementToggleFunc(sidebar);
    // Toggle button text
    const btnText = this.querySelector("span");
    btnText.textContent = btnText.textContent === "Show Contacts" ? "Hide Contacts" : "Show Contacts";
});

// Navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Function to handle section navigation
function showSection(sectionName) {
    if (!sectionName) return;
    
    // Convert section name to lowercase for consistency
    sectionName = sectionName.toLowerCase();
    
    // Hide all sections and remove active class from nav links
    pages.forEach(page => page.classList.remove("active"));
    navigationLinks.forEach(link => link.classList.remove("active"));

    // Show the target section
    const targetSection = document.querySelector(`[data-page="${sectionName}"]`);
    if (targetSection) {
        targetSection.classList.add("active");
        // Scroll to top of the section
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Find and activate the corresponding nav link
        navigationLinks.forEach(link => {
            if (link.textContent.toLowerCase() === sectionName) {
                link.classList.add("active");
            }
        });
        
        // Update URL hash
        history.pushState(null, '', `#${sectionName}`);
    }
}

// Add click event to all nav links
navigationLinks.forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        const section = this.textContent.toLowerCase();
        showSection(section);
    });
});

// Handle URL hash changes
window.addEventListener('hashchange', () => {
    const section = window.location.hash.replace('#', '') || 'about';
    showSection(section);
});

// Handle initial page load
window.addEventListener('load', () => {
    const section = window.location.hash.replace('#', '') || 'about';
    showSection(section);
    document.body.classList.add('loaded');
});

// Add smooth scrolling to all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const section = this.getAttribute('href').replace('#', '');
        showSection(section);
    });
});

// Handle social media links
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function(e) {
        if (!this.target) {
            this.target = '_blank';
            this.rel = 'noopener noreferrer';
        }
    });
});

// Add animation to skill bars
const skillBars = document.querySelectorAll('.skills-progress');
const animateSkills = () => {
    skillBars.forEach(skill => {
        const percentage = skill.dataset.progress;
        skill.style.width = percentage;
    });
};

// Animate skills when in viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkills();
        }
    });
});

skillBars.forEach(skill => observer.observe(skill));

// Form submission handling
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        let isValid = true;
        let formValues = {};
        
        // Validate form fields
        formData.forEach((value, key) => {
            formValues[key] = value.trim();
            if (!value.trim()) {
                isValid = false;
                const input = this.querySelector(`[name="${key}"]`);
                input.classList.add('error');
            }
        });

        if (!isValid) {
            alert('Please fill in all required fields');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formValues.email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon><span>Sending...</span>';

        try {
            // Send email using EmailJS
            const response = await emailjs.send(
                'service_ndzkyze', // EmailJS service ID
                'template_i0cw1tk', // EmailJS template ID
                {
                    from_name: formValues.fullname,
                    from_email: formValues.email,
                    message: formValues.message,
                    to_name: 'Nayan Bhadane', // Your name
                    reply_to: formValues.email,
                }
            );

            if (response.status === 200) {
                // Show success message
                alert('Thank you for your message! I will get back to you soon.');
                
                // Reset form
                this.reset();
                
                // Remove any error classes
                this.querySelectorAll('.error').forEach(input => {
                    input.classList.remove('error');
                });
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Sorry, there was an error sending your message. Please try again later or contact me directly at nayanbhadane72@gmail.com');
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });

    // Remove error class on input focus
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('focus', function() {
            this.classList.remove('error');
        });
    });
}

// Create scroll to top button
const createScrollTopButton = () => {
    if (!document.querySelector('.scroll-top')) {
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.classList.add('scroll-top');
        scrollTopBtn.innerHTML = '↑';
        scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        document.body.appendChild(scrollTopBtn);
    }
};

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    }
});

// Initialize scroll to top button
createScrollTopButton();
