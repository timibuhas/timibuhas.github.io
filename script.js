/* ==================== TYPED TEXT ==================== */
const typedStrings = [
    'Frontend Developer',
    'Backend Developer',
    'Passionate about clean code',
    'Problem Solver',
    'Always Learning & Growing'
];

let typeIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed');

function type() {
    const current = typedStrings[typeIndex];

    if (isDeleting) {
        typedEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
    }

    let delay = isDeleting ? 75 : 115;

    if (!isDeleting && charIndex === current.length) {
        delay = 2200;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        typeIndex = (typeIndex + 1) % typedStrings.length;
        delay = 450;
    }

    setTimeout(type, delay);
}

type();

/* ==================== NAVBAR ==================== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active link tracking
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
});

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
    });
});

/* ==================== SCROLL REVEAL ==================== */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const siblings = entry.target.parentElement.querySelectorAll('.reveal');
            const index = Array.from(siblings).indexOf(entry.target);
            const delay = Math.min(index * 90, 350);

            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, delay);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* ==================== SKILL BARS ==================== */
const skillBars = document.querySelectorAll('.skill-progress');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 250);
            skillObserver.unobserve(bar);
        }
    });
}, { threshold: 0.2 });

skillBars.forEach(bar => skillObserver.observe(bar));

/* ==================== PROJECT FILTER ==================== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        let visibleIndex = 0;

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const matches = filter === 'all' || category === filter;

            if (matches) {
                card.classList.remove('hidden');
                card.style.animation = 'none';
                card.offsetHeight; // reflow
                card.style.animation = `fadeUp 0.45s ${visibleIndex * 0.08}s cubic-bezier(0.4,0,0.2,1) both`;
                visibleIndex++;
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

/* ==================== EMAILJS INIT ==================== */
emailjs.init('ZXTyRb8M7bdB_9c5k');

const EMAILJS_SERVICE_ID  = 'service_5ad73mk';
const EMAILJS_TEMPLATE_ID = 'template_ku0aerd';

/* ==================== CONTACT FORM ==================== */
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formSuccess = document.getElementById('form-success');

function validateField(field, errorId, customMsg) {
    const errorEl = document.getElementById(errorId);
    const value = field.value.trim();

    const clearError = () => {
        field.classList.remove('error');
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
    };

    const setError = (msg) => {
        field.classList.add('error');
        errorEl.textContent = msg;
        errorEl.classList.add('visible');
    };

    if (!value) {
        setError(customMsg || 'Acest câmp este obligatoriu.');
        return false;
    }

    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setError('Te rugăm să introduci o adresă de email validă.');
            return false;
        }
    }

    if (field.id === 'message' && value.length < 20) {
        setError('Mesajul trebuie să aibă cel puțin 20 de caractere.');
        return false;
    }

    clearError();
    return true;
}

// Live validation on input
['name', 'email', 'subject', 'message'].forEach(id => {
    const field = document.getElementById(id);
    field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
            validateField(field, `${id}-error`);
        }
    });
    field.addEventListener('blur', () => {
        validateField(field, `${id}-error`);
    });
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    const isValid = [
        validateField(name, 'name-error', 'Te rugăm să introduci numele tău.'),
        validateField(email, 'email-error', 'Te rugăm să introduci emailul tău.'),
        validateField(subject, 'subject-error', 'Te rugăm să introduci subiectul.'),
        validateField(message, 'message-error', 'Te rugăm să introduci un mesaj.')
    ].every(Boolean);

    if (!isValid) return;

    const btnIcon = submitBtn.querySelector('.btn-icon');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    btnIcon.style.display = 'none';
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;

    const templateParams = {
        from_name:  document.getElementById('name').value.trim(),
        from_email: document.getElementById('email').value.trim(),
        subject:    document.getElementById('subject').value.trim(),
        message:    document.getElementById('message').value.trim(),
        to_email:   'timoteibuhas@gmail.com'
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
            form.reset();
            formSuccess.style.display = 'flex';
            setTimeout(() => { formSuccess.style.display = 'none'; }, 5500);
        })
        .catch((err) => {
            console.error('EmailJS error:', err);
            alert('A apărut o eroare la trimitere. Te rugăm să încerci din nou sau scrie direct la timoteibuhas@gmail.com');
        })
        .finally(() => {
            btnIcon.style.display = '';
            btnText.style.display = '';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        });
});

/* ==================== BACK TO TOP ==================== */
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ==================== SMOOTH SCROLL ==================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || href === '') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ==================== PARTICLES ==================== */
(function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0%   { transform: translateY(0) translateX(0); opacity: 0; }
            10%  { opacity: 1; }
            90%  { opacity: 0.6; }
            100% { transform: translateY(-80vh) translateX(var(--drift)); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    for (let i = 0; i < 28; i++) {
        const p = document.createElement('div');
        const size = Math.random() * 3 + 1;
        const drift = (Math.random() - 0.5) * 120;

        p.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(57, 62, 70, ${Math.random() * 0.18 + 0.05});
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            --drift: ${drift}px;
            animation: floatParticle ${Math.random() * 14 + 10}s linear infinite;
            animation-delay: ${Math.random() * 12}s;
            pointer-events: none;
        `;
        container.appendChild(p);
    }
})();

/* ==================== STAT COUNTER ANIMATION ==================== */
function animateCounter(el, target, duration) {
    let start = null;

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target) + '+';
        if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

const statNumbers = document.querySelectorAll('.stat-number[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'));
            if (!isNaN(target)) animateCounter(el, target, 1800);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.6 });

statNumbers.forEach(el => counterObserver.observe(el));
