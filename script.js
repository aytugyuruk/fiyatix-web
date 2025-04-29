// DOM Elements (performans için önbelleğe alınıyor)
document.addEventListener('DOMContentLoaded', () => {
    // AOS (Animate On Scroll) - daha performanslı ayarlar
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true, // Animasyonları bir kez çalıştır
        offset: 100,
        disable: window.innerWidth < 768 ? true : false // Mobilde devre dışı bırak
    });

    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const faqItems = document.querySelectorAll('.faq-item');
    const faqQuestions = document.querySelectorAll('.faq-question');
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');
    const heroImage = document.querySelector('#hero .md\\:w-1\\/2.relative');

    // Resize olayı için debounce - performans iyileştirmesi
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Mobilde AOS'u devre dışı bırak
            if (window.innerWidth < 768) {
                AOS.refreshHard();
            }
        }, 250);
    });

    // Mobile Menu Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const icon = menuToggle.querySelector('i');
            
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.remove('hidden');
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                mobileMenu.classList.add('hidden');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // FAQ Accordion - Event delegation için optimize edildi
    const faqContainer = document.querySelector('.faq-container');
    if (faqContainer) {
        faqContainer.addEventListener('click', (e) => {
            const question = e.target.closest('.faq-question');
            if (!question) return;
            
            const faqItem = question.parentElement;
            
            // Close all other FAQs
            faqItems.forEach((item) => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-question').classList.remove('active');
                }
            });
            
            // Toggle current FAQ
            faqItem.classList.toggle('active');
            question.classList.toggle('active');
        });
    }

    // Smooth scroll için event delegation
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        
        // Mobil menüyü kapat
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });

    // İlk FAQ'yu aç
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
        faqQuestions[0].classList.add('active');
    }

    // Lazy load images that are not visible at first
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src') || img.src;
                    img.onload = () => img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}); 