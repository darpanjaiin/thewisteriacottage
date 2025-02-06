document.addEventListener('DOMContentLoaded', function() {
    // Mobile view notice
    if (window.innerWidth > 480) {
        const notice = document.createElement('div');
        notice.className = 'mobile-view-notice';
        notice.innerHTML = '<i class="fas fa-mobile-alt"></i> This is a mobile view. For best experience, use your mobile device.';
        document.body.appendChild(notice);

        setTimeout(() => {
            notice.remove();
        }, 6000);
    }

    // Modal functions
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.classList.add('modal-open');
            
            // Initialize collapsible menus when rules or amenities modal opens
            if (modalId === 'rules-modal' || modalId === 'amenities-modal') {
                initializeCollapsible(modal);
            }
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }

    // Button click handlers
    const buttonMappings = {
        'book-now-btn': 'book-now-modal',
        'book-now-footer-btn': 'book-now-modal',
        'reviews-btn': 'reviews-modal',
        'nearby-btn': 'nearby-modal',
        'emergency-btn': 'emergency-modal',
        'rules-btn': 'rules-modal',
        'specials-btn': 'specials-modal',
        'host-favorites': 'host-favorites-modal',
        'gallery-card': 'gallery-modal',
        'amenities-card': 'amenities-modal',
        'live-tour-btn': 'live-tour-modal'
    };

    // Add click handlers for all buttons
    Object.entries(buttonMappings).forEach(([btnId, modalId]) => {
        const button = document.getElementById(btnId);
        if (button) {
            button.addEventListener('click', () => {
                console.log(`Button clicked: ${btnId} for modal: ${modalId}`);
                const modal = document.getElementById(modalId);
                if (modal) {
                    openModal(modalId);
                } else {
                    console.error(`Modal not found: ${modalId}`);
                }
            });
        } else {
            console.error(`Button not found: ${btnId}`);
        }
    });

    // Close button handlers
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });

    // Share button functionality
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: "Mrudhgandh PoolVilla - Digital Guidebook",
                        text: 'Check out this amazing property!',
                        url: window.location.href
                    });
                } catch (err) {
                    console.log('Error sharing:', err);
                    alert('Unable to share at this time');
                }
            } else {
                alert('Share via: [Copy URL functionality to be implemented]');
            }
        });
    }

    // Collapsible menu functionality
    function initializeCollapsible(modalElement) {
        const headers = modalElement.querySelectorAll('.category-header');
        
        headers.forEach(header => {
            // Remove existing event listeners
            header.replaceWith(header.cloneNode(true));
            const newHeader = modalElement.querySelector(`[data-category="${header.dataset.category}"]`);
            
            newHeader.addEventListener('click', function() {
                const category = this.parentElement;
                const content = category.querySelector('.category-content');
                const icon = this.querySelector('i');
                
                // Close other categories
                const otherCategories = modalElement.querySelectorAll('.rule-category.active, .amenity-category.active');
                otherCategories.forEach(otherCategory => {
                    if (otherCategory !== category) {
                        otherCategory.classList.remove('active');
                        otherCategory.querySelector('.category-content').style.display = 'none';
                        otherCategory.querySelector('i').style.transform = 'rotate(0deg)';
                    }
                });
                
                // Toggle current category
                category.classList.toggle('active');
                if (category.classList.contains('active')) {
                    content.style.display = 'block';
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    content.style.display = 'none';
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        });
    }

    // Gallery functionality
    function initializeGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                
                const lightboxImg = document.createElement('img');
                lightboxImg.src = img.src;
                
                const closeBtn = document.createElement('span');
                closeBtn.className = 'lightbox-close';
                closeBtn.innerHTML = '&times;';
                
                lightbox.appendChild(lightboxImg);
                lightbox.appendChild(closeBtn);
                document.body.appendChild(lightbox);
                
                setTimeout(() => lightbox.classList.add('active'), 10);
                
                const closeLightbox = () => {
                    lightbox.classList.remove('active');
                    setTimeout(() => lightbox.remove(), 300);
                };
                
                closeBtn.addEventListener('click', closeLightbox);
                lightbox.addEventListener('click', (e) => {
                    if (e.target === lightbox) closeLightbox();
                });
            });
        });
    }

    // Initialize gallery when gallery card is clicked
    const galleryCard = document.getElementById('gallery-card');
    if (galleryCard) {
        galleryCard.addEventListener('click', () => {
            setTimeout(initializeGallery, 100);
        });
    }

    // Gallery Filtering
    function initializeGalleryFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        // Show all items initially
        galleryItems.forEach(item => item.classList.add('show'));

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterValue = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter items
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        item.classList.add('show');
                    } else {
                        item.classList.remove('show');
                    }
                });
            });
        });
    }

    // Initialize filters when gallery modal opens
    document.getElementById('gallery-card').addEventListener('click', () => {
        setTimeout(() => {
            initializeGalleryFilters();
            // Show all items initially
            document.querySelectorAll('.gallery-item').forEach(item => item.classList.add('show'));
        }, 100);
    });

    // Add this with your other event listeners
    document.getElementById('rooms-card').addEventListener('click', function() {
        document.getElementById('rooms-modal').style.display = 'block';
    });

    // Room Gallery functionality
    function initializeRoomGalleries() {
        const galleries = document.querySelectorAll('.room-image-gallery');
        
        galleries.forEach(gallery => {
            const images = gallery.querySelectorAll('img');
            const dots = gallery.querySelectorAll('.dot');
            const prevBtn = gallery.querySelector('.prev');
            const nextBtn = gallery.querySelector('.next');
            let currentIndex = 0;

            function showImage(index) {
                images.forEach(img => img.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                images[index].classList.add('active');
                dots[index].classList.add('active');
            }

            function nextImage() {
                currentIndex = (currentIndex + 1) % images.length;
                showImage(currentIndex);
            }

            function prevImage() {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                showImage(currentIndex);
            }

            prevBtn.addEventListener('click', e => {
                e.stopPropagation();
                prevImage();
            });

            nextBtn.addEventListener('click', e => {
                e.stopPropagation();
                nextImage();
            });

            dots.forEach((dot, index) => {
                dot.addEventListener('click', e => {
                    e.stopPropagation();
                    currentIndex = index;
                    showImage(currentIndex);
                });
            });
        });
    }

    // Initialize galleries when rooms modal opens
    document.getElementById('rooms-card').addEventListener('click', () => {
        setTimeout(initializeRoomGalleries, 100);
    });

    // Live Tour Form Handler
    const liveTourForm = document.getElementById('liveTourForm');
    if (liveTourForm) {
        liveTourForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            // Get form data
            const guestName = document.getElementById('guestName').value;
            const guestPhone = document.getElementById('guestPhone').value;
            
            // Close the modal
            closeModal('live-tour-modal');
            
            // Reset form
            liveTourForm.reset();
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <div class="success-content">
                    <i class="fas fa-check-circle"></i>
                    <h3>Request Received!</h3>
                    <p>Thank you for your interest. Our caretaker will contact you shortly for a live video tour.</p>
                </div>
            `;
            document.body.appendChild(successMessage);
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);

            // Send WhatsApp message to caretaker (replace CARETAKER_NUMBER with actual number)
            const caretakerNumber = "918999915037"; // Format: country code without + (e.g., "918999915037")
            const message = encodeURIComponent(
                `New Live Tour Request:\n\nGuest Name: ${guestName}\nPhone: ${guestPhone}\n\nPlease contact the guest to schedule a video tour.`
            );
            
            // Send WhatsApp message silently using the WhatsApp API
            const whatsappLink = `https://api.whatsapp.com/send?phone=${caretakerNumber}&text=${message}`;
            
            try {
                // Use fetch to silently send the WhatsApp message
                await fetch(whatsappLink, { mode: 'no-cors' });
            } catch (error) {
                console.error('Error sending WhatsApp message:', error);
            }
        });
    }
}); 