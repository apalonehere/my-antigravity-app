// Green Rising Barbados - Config & Interactivity Script

// Paste your deployed Google Apps Script Web App URL here to connect the registration form to a Google Sheet:
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbw7_Ferq7x7ULlFjHsOwSTihGYAU_qPqlPMzBKnEhT_J2hNxy5B70wNM3OqHiiEhyY5/exec'; 

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileMenu();
    initProgrammeSubTabs();
    initVillageTabs();
    initHashRouter();
    initScrollReveal();
    initRippleEffect();
});

// --- Organic/Fluid: Scroll-triggered reveal animations ---
function initScrollReveal() {
    // Add reveal class to key elements
    const revealTargets = [
        { selector: '.program-card',         delay: true },
        { selector: '.home-impact-brief',    delay: false },
        { selector: '.stat-item',            delay: true },
        { selector: '.glass',                delay: false },
        { selector: '.pinelands-card',       delay: true },
        { selector: '.matrix-item',          delay: true },
        { selector: '.wave-divider',         delay: false },
    ];

    revealTargets.forEach(({ selector, delay }) => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.classList.add('reveal');
            if (delay && i < 6) el.classList.add(`reveal-delay-${(i % 4) + 1}`);
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// --- Organic/Fluid: Liquid ripple on button clicks ---
function initRippleEffect() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn');
        if (!btn) return;

        const circle = document.createElement('span');
        circle.classList.add('ripple-circle');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        circle.style.width = circle.style.height = size + 'px';
        circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
        circle.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
        btn.appendChild(circle);
        circle.addEventListener('animationend', () => circle.remove());
    });
}

// --- 1. SPA Navigation & Router ---
const views = document.querySelectorAll('.app-view');
const navLinks = document.querySelectorAll('.nav-link');

function initNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const tabId = link.getAttribute('data-tab');
            if (tabId) {
                // If it's a link to a main tab view
                e.preventDefault();
                switchView(tabId);
                window.location.hash = tabId;
            }
        });
    });
}

function switchView(viewId) {
    views.forEach(view => {
        if (view.id === `view-${viewId}`) {
            view.classList.add('active');
        } else {
            view.classList.remove('active');
        }
    });

    navLinks.forEach(link => {
        if (link.getAttribute('data-tab') === viewId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Router using hash location
function initHashRouter() {
    const handleHash = () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            // Check if it's a focus area program
            if (['water', 'cyen', 'ecovillage', 'yots', 'pinelands'].includes(hash)) {
                switchView('programmes');
                openProgram(hash);
            } else if (['home', 'programmes', 'dashboard', 'quiz', 'apply'].includes(hash)) {
                switchView(hash);
            }
        }
    };
    
    window.addEventListener('hashchange', handleHash);
    // Initial check on load
    handleHash();
}

// Mobile navigation hamburger toggle
function initMobileMenu() {
    const mobileBtn = document.getElementById('mobile-toggle-btn');
    const mainNav = document.getElementById('main-navigation');
    
    if (mobileBtn && mainNav) {
        mobileBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileBtn.classList.toggle('open');
        });
        
        // Close menu on click of nav link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                mobileBtn.classList.remove('open');
            });
        });
    }
}

// --- 2. Programmes Sub-Tabs Switching ---
const subTabButtons = document.querySelectorAll('.sub-tab-btn');
const programPanes = document.querySelectorAll('.prog-detail-pane');

function initProgrammeSubTabs() {
    subTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetProg = btn.getAttribute('data-prog');
            openProgram(targetProg);
        });
    });
}

function openProgram(progId) {
    subTabButtons.forEach(btn => {
        if (btn.getAttribute('data-prog') === progId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    programPanes.forEach(pane => {
        if (pane.id === `prog-${progId}`) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });
    
    switchView('programmes');
}

// --- 3. Eco Village Zonal Tab Switching ---
const villageTabButtons = document.querySelectorAll('.village-tab-btn');
const villageZones = document.querySelectorAll('.village-zone-pane');

function initVillageTabs() {
    villageTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const zoneId = btn.getAttribute('data-zone');
            
            villageTabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            villageZones.forEach(pane => {
                if (pane.id === `zone-${zoneId}`) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });
}

// Accordion toggle helper (used in CYEN Skills section)
function toggleAccordion(button) {
    const activeHeader = button.parentElement.parentElement.querySelector('.accordion-header.active');
    if (activeHeader && activeHeader !== button) {
        activeHeader.classList.remove('active');
        activeHeader.nextElementSibling.classList.remove('show');
    }
    
    button.classList.toggle('active');
    const content = button.nextElementSibling;
    content.classList.toggle('show');
}
