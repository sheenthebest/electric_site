new Vue({
    el: '#app',
    data: {
        totalImages: 25,
        showGalleryModal: false,
        currentImageIndex: 0,
        currentYear: new Date().getFullYear()
    },
    computed: {
        galleryImages() {
            return Array.from({ length: this.totalImages }, (_, i) => `images/work/work${i + 1}.jpg`);
        },
        displayedImages() {
            return this.galleryImages.slice(0, 4);
        }
    },
    methods: {
        openGallery(index) {
            this.currentImageIndex = index;
            this.showGalleryModal = true;
        },
        closeGallery() {
            this.showGalleryModal = false;
        },
        prevImage() {
            this.currentImageIndex = (this.currentImageIndex - 1 + this.totalImages) % this.totalImages;
        },
        nextImage() {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.totalImages;
        },
        smoothScroll(event) {
            event.preventDefault();
            const targetId = event.target.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        },
        setupScrollAnimation() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const classes = entry.target.className.split(' ');
                        const delayClass = classes.find(cls => cls.startsWith('delay-'));
                        
                        if (delayClass) {
                            setTimeout(() => {
                                entry.target.classList.add('animate');
                            }, parseInt(delayClass.split('-')[1]) * 100);
                        } else {
                            entry.target.classList.add('animate');
                        }
                        
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                observer.observe(el);
            });
        }
    },
    mounted() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', this.smoothScroll);
        });
        this.setupScrollAnimation();

        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.querySelector('.scroll-progress').style.setProperty('--scroll-width', scrolled + '%');
        });
    }
});