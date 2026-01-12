// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animate skill bars on scroll
const observerOptions = {
    threshold: 0,
    rootMargin: '0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const skillsSection = document.querySelector('.skills-section');
if (skillsSection) {
    skillObserver.observe(skillsSection);
}

// Form submission handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = this.querySelector('input[placeholder="NAME *"]').value;
        const surname = this.querySelector('input[placeholder="SURNAME *"]').value;
        const email = this.querySelector('input[placeholder="EMAIL *"]').value;
        const subject = this.querySelector('input[placeholder="SUBJECT *"]').value;
        const message = this.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !surname || !email || !subject || !message) {
            alert('Please fill in all required fields.');
            return;
        }

        // Construct mailto link
        const recipient = 'sifisoreginald.ndlovu@gmail.com';
        const emailSubject = `Portfolio Contact: ${subject}`;
        const emailBody = `Name: ${name} ${surname}\nEmail: ${email}\n\nMessage:\n${message}`;
        
        const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Open default email client
        window.location.href = mailtoLink;
        
        // Show confirmation and reset
        alert('Thank you! This will open your default email client to send the message.');
        this.reset();
    });
}

// Download CV button handler
// Code removed to allow default anchor tag behavior (download)
/*
const downloadCvBtn = document.querySelector('.download-cv-btn');
if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', function() {
        // In a real implementation, this would download an actual CV file
        alert('CV download would be triggered here. Please link this to your actual CV file.');
    });
}
*/

// Hire Me button handler
const hireBtn = document.querySelector('.hire-btn');
if (hireBtn) {
    hireBtn.addEventListener('click', function() {
        // Scroll to contact section
        const contactSection = document.querySelector('.contact-section');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// Load More buttons handler
const loadMoreBtns = document.querySelectorAll('.load-more-btn');
loadMoreBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // In a real implementation, this would load more items
        alert('Load more functionality would be implemented here.');
    });
});

// Read More buttons handler
const readMoreBtns = document.querySelectorAll('.read-more-btn');
readMoreBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // In a real implementation, this would navigate to the full blog post
        alert('Read more functionality would navigate to the full blog post.');
    });
});

// Add scroll animation to timeline items
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 100);
            timelineObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach(item => {
    item.style.opacity = '0';
    if (item.classList.contains('left')) {
        item.style.transform = 'translateX(-50px)';
    } else {
        item.style.transform = 'translateX(50px)';
    }
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    timelineObserver.observe(item);
    
    // Fallback: Ensure visibility after 1 second if observer doesn't trigger
    setTimeout(() => {
        if (item.style.opacity === '0') {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }
    }, 1000);
});

// Add fade-in animation to sections on scroll
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0,
    rootMargin: '0px'
});

const sections = document.querySelectorAll('section');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    sectionObserver.observe(section);
    
    // Fallback for sections
    setTimeout(() => {
        if (section.style.opacity === '0') {
             section.style.opacity = '1';
             section.style.transform = 'translateY(0)';
        }
    }, 1000);
});

// Hero section should be visible immediately
const heroSection = document.querySelector('.hero-section');
if (heroSection) {
    heroSection.style.opacity = '1';
    heroSection.style.transform = 'translateY(0)';
}







/* Back-to-top moving button behavior
   - Follows the centre of the currently visible section (smoothly)
   - Appears after a small scroll threshold
   - Smooth-scrolls to top when clicked
*/
(() => {
    const btn = document.getElementById('backToTopBtn');
    const sections = Array.from(document.querySelectorAll('section'));
    if (!btn || sections.length === 0) return;

    let ticking = false;

    function updateButtonPosition() {
        // find section whose center is closest to viewport center
        const viewportCenter = window.innerHeight / 2;
        let best = {dist: Infinity, rect: null};
        sections.forEach(sec => {
            const r = sec.getBoundingClientRect();
            const secCenter = r.top + r.height / 2;
            const dist = Math.abs(secCenter - viewportCenter);
            if (dist < best.dist) {
                best = {dist, rect: r};
            }
        });

        if (best.rect) {
            // target y coordinate for the button's center relative to viewport
            let targetY = best.rect.top + best.rect.height / 2;
            // clamp to viewport bounds so button never leaves viewport
            const min = 50; // px from top
            const max = window.innerHeight - 50; // px from top
            targetY = Math.max(min, Math.min(max, targetY));

            // set top so that transform translateY(-50%) keeps button center aligned
            btn.style.top = `${targetY}px`;
        }
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateButtonPosition();
                ticking = false;
            });
            ticking = true;
        }

        // show/hide button based on scrollY
        if (window.scrollY > 200) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    }

    // initial placement
    updateButtonPosition();

    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', () => updateButtonPosition());

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

