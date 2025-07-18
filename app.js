// Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });

    // Smooth scrolling for anchor links - Fixed implementation
    function smoothScrollTo(target) {
        if (!target) return;
        
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const targetPosition = target.offsetTop - navbarHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // Add click handlers for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                smoothScrollTo(target);
                
                // Update active nav link
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function highlightActiveSection() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveSection);
    highlightActiveSection(); // Initial call

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system - Enhanced implementation
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        // Set notification styles
        const baseStyles = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: 8px;
            padding: 16px 20px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            z-index: 9999;
            max-width: 400px;
            min-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            font-family: var(--font-family-base);
            font-size: 14px;
            color: var(--color-text);
        `;
        
        let typeStyles = '';
        if (type === 'success') {
            typeStyles = 'border-left: 4px solid var(--color-success); background: rgba(33, 128, 141, 0.05);';
        } else if (type === 'error') {
            typeStyles = 'border-left: 4px solid var(--color-error); background: rgba(192, 21, 47, 0.05);';
        }
        
        notification.style.cssText = baseStyles + typeStyles;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: var(--color-text-secondary); 
                               font-size: 18px; cursor: pointer; padding: 0; width: 20px; height: 20px; 
                               display: flex; align-items: center; justify-content: center;">Ã—</button>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show notification with animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto close after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // Contact form handling - Fixed implementation
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const subject = formData.get('subject').trim();
            const message = formData.get('message').trim();
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Create and execute mailto link
            setTimeout(() => {
                const emailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
                const mailtoLink = `mailto:architgarg2108@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
                
                // Create a temporary link element and click it
                const tempLink = document.createElement('a');
                tempLink.href = mailtoLink;
                tempLink.style.display = 'none';
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                
                // Reset form and button
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Show success notification
                showNotification('Thank you for your message! Your email client should open shortly.', 'success');
            }, 1000);
        });
    }

    // Resume download functionality
    const downloadResumeBtn = document.getElementById('download-resume');
    
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create resume content
            const resumeContent = generateResumeContent();
            
            // Create and download file
            const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Archit_Garg_Resume.txt';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showNotification('Resume downloaded successfully!', 'success');
        });
    }

    // Generate resume content
    function generateResumeContent() {
        return `ARCHIT GARG
Principal Engineer

Contact Information:
Email: architgarg2108@gmail.com
Phone: +91-9013802628
GitHub: https://github.com/architgarg2108
LinkedIn: https://linkedin.com/in/architgarg2108
Location: India

PROFESSIONAL SUMMARY
Principal Engineer with 7+ years of experience designing scalable backend systems, migrating infrastructure, and driving observability initiatives. Proficient in JAVA, Spring Boot, Node.js, and cloud platforms like AWS and Azure. Passionate about technical leadership, system architecture, and delivering high-impact engineering solutions.

TECHNICAL SKILLS
Frontend: JavaScript, TypeScript, ReactJS, AngularJS, HTML5, CSS3
Backend: Java, Spring Boot, Node.js, C#, .NET, RESTful APIs, GraphQL
Databases: PostgreSQL, MySQL, Oracle, CosmosDB, AWS Redshift, Azure Storage
Cloud: AWS, Azure, AWS S3, Azure Blob Storage, Azure Table Storage
Tools: Docker, Kubernetes, Redis, RabbitMQ, Kafka, Elasticsearch, Git
Monitoring: OpenTelemetry, Grafana, Application Insights, New Relic

PROFESSIONAL EXPERIENCE

Principal Engineer | Caastle (formerly Gwynniebee) | June 2023 â€“ Present | Remote
â€¢ Implemented observability for all JAVA services using OpenTelemetry and Grafana Cloud across frontend and backend apps, improving incident response time by 30%
â€¢ Developed JAVA and Node.js libraries to auto-switch S3 buckets based on dynamic config, enabling seamless migration to updated naming standards
â€¢ Introduced GraphQL to reduce reliance on JAVA/Node.js middleware, cutting AWS costs by 25%
â€¢ Migrated Shopify-hosted tenant pages to a custom Liquid.js server, improving flexibility and reducing vendor lock-in
â€¢ Led migration of core functionalities to ReactJS for better user experience

Software Engineer 2 | Microsoft | June 2021 â€“ December 2022 | Hyderabad, India
â€¢ Built a comprehensive system to detect and classify 3rd-party trackers for GDPR compliance
â€¢ Developed frontend features using ReactJS for enhanced user experience
â€¢ Collaborated across teams to deploy full-stack solutions for privacy insights
â€¢ Contributed to Microsoft's compliance and privacy initiatives

Software Development Engineer | Fareye | August 2017 â€“ May 2021 | Noida, India
â€¢ Designed and implemented a rule-based Order Assignment and Driver Scoring engine for delivery optimization
â€¢ Led migration from AngularJS to ReactJS for improved performance and maintainability
â€¢ Created comprehensive KPI dashboards for clients using PERISCOPE analytics platform
â€¢ Developed multi-tenant CRUD system and platform integrations with 3PL partners, reducing custom code by 70% per client
â€¢ Implemented a configuration control system that significantly reduced config and testing time

EDUCATION
B.Tech in Computer Science
Guru Gobind Singh Indraprastha University, Delhi, India

KEY ACHIEVEMENTS
â€¢ Led observability initiatives reducing incident response time by 30%
â€¢ Architected systems that cut AWS costs by 25% through GraphQL optimization
â€¢ Expertise in microservices, cloud migration, and infrastructure modernization
â€¢ Strong background in both frontend and backend development
â€¢ Experience with enterprise-scale applications and system design

CERTIFICATIONS
â€¢ AWS Certified Solutions Architect
â€¢ Microsoft Azure Fundamentals
â€¢ Spring Professional Certification`;
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.skill-category, .experience-item, .project-card, .stat-item');
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Skill tags hover effect
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Performance optimization - throttle scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Apply throttling to scroll events
    window.addEventListener('scroll', throttle(highlightActiveSection, 16));

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
            
            // Close any open notifications
            const notifications = document.querySelectorAll('.notification');
            notifications.forEach(notification => {
                notification.remove();
            });
        }
    });

    // Console welcome message
    console.log(`
    â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
    â•‘                                                              â•‘
    â•‘                    Welcome to Archit Garg's                 â•‘
    â•‘                    Portfolio Website!                       â•‘
    â•‘                                                              â•‘
    â•‘     ðŸ‘‹ Hi there! Thanks for checking out my portfolio.      â•‘
    â•‘     If you're interested in collaborating or have any       â•‘
    â•‘     questions, feel free to reach out!                      â•‘
    â•‘                                                              â•‘
    â•‘     ðŸ“§ architgarg2108@gmail.com                             â•‘
    â•‘     ðŸ”— linkedin.com/in/architgarg2108                       â•‘
    â•‘     ðŸ™ github.com/architgarg2108                            â•‘
    â•‘                                                              â•‘
    â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    `);
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        console.log('Service Worker support detected');
    });
}
