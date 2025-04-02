/**
 * Zoomee - Minimal Product Image Gallery with Zoom
 */

// Simple configuration
const ZoomeeConfig = {
	thumbnailPosition: 'center',   // 'left', 'center', or 'right'
	enableZoomOnMobile: false      // Whether to enable zoom on mobile
  };
  
  class Zoomee {
	constructor(element) {
	  // Skip if already initialized
	  if (element.querySelector('.zoomee-slider')) return;
	  
	  this.container = element;
	  this.images = Array.from(element.querySelectorAll('img'));
	  
	  if (!this.images.length) return;
	  
	  this.currentIndex = 0;
	  // Initialize mobile detection based on current window width
	  this.isMobile = window.innerWidth <= 768;
	  
	  // Initialize
	  this.init();
	}
	
	init() {
	  // Create structure
	  this.createStructure();
	  
	  // Set up event listeners
	  this.setupEventListeners();
	  
	  // Set up ResizeObserver
	  if (window.ResizeObserver && this.thumbsContainer) {
		this.resizeObserver = new ResizeObserver(() => {
		  this.updateThumbnailNav();
		});
		this.resizeObserver.observe(this.thumbsContainer);
	  }
	  
	  // Update mobile status whenever window is resized
	  window.addEventListener('resize', () => {
		this.isMobile = window.innerWidth <= 768;
		// Update zoom prompt visibility
		this.updateZoomPrompt();
	  });
	  
	  // Initial update
	  this.updateThumbnailNav();
	  this.updateZoomPrompt();
	}
	
	// Update zoom prompt visibility
	updateZoomPrompt() {
	  if (this.zoomPrompt) {
		this.zoomPrompt.classList.toggle('hidden', this.isMobile && !ZoomeeConfig.enableZoomOnMobile);
	  }
	}
	
	createStructure() {
	  // Store original images
	  const originalImages = this.images.map(img => img.cloneNode(true));
	  
	  // Clear container
	  this.container.innerHTML = '';
	  
	  // Create main slider
	  this.slider = document.createElement('div');
	  this.slider.className = 'zoomee-slider';
	  
	  // Create track for slides
	  this.track = document.createElement('div');
	  this.track.className = 'zoomee-track';
	  
	  // Create slides
	  this.slides = originalImages.map((img, index) => {
		const slide = document.createElement('div');
		slide.className = 'zoomee-slide';
		slide.appendChild(img);
		this.track.appendChild(slide);
		return slide;
	  });
	  
	  // Add zoom prompt
	  this.zoomPrompt = document.createElement('div');
	  this.zoomPrompt.className = 'zoomee-prompt';
	  this.zoomPrompt.textContent = 'Click to enlarge image';
	  
	  // Add track to slider
	  this.slider.appendChild(this.track);
	  this.slider.appendChild(this.zoomPrompt);
	  
	  // Add navigation buttons if more than one image
	  if (this.images.length > 1) {
		this.prevButton = document.createElement('button');
		this.prevButton.className = 'zoomee-nav zoomee-prev';
		this.prevButton.setAttribute('aria-label', 'Previous image');
		this.prevButton.textContent = '<';
		
		this.nextButton = document.createElement('button');
		this.nextButton.className = 'zoomee-nav zoomee-next';
		this.nextButton.setAttribute('aria-label', 'Next image');
		this.nextButton.textContent = '>';
		
		this.slider.appendChild(this.prevButton);
		this.slider.appendChild(this.nextButton);
	  }
	  
	  // Create thumbnails if more than one image
	  if (this.images.length > 1) {
		this.thumbsContainer = document.createElement('div');
		this.thumbsContainer.className = 'zoomee-thumbs';
		
		this.thumbsTrack = document.createElement('div');
		this.thumbsTrack.className = 'zoomee-thumbs-track';
		
		// Create thumbnails
		this.thumbs = originalImages.map((img, index) => {
		  const thumb = document.createElement('button');
		  thumb.className = 'zoomee-thumb' + (index === 0 ? ' active' : '');
		  
		  const thumbImg = document.createElement('img');
		  thumbImg.src = img.src;
		  thumbImg.alt = '';
		  
		  thumb.appendChild(thumbImg);
		  this.thumbsTrack.appendChild(thumb);
		  
		  return thumb;
		});
		
		this.thumbsContainer.appendChild(this.thumbsTrack);
		
		// Thumb navigation buttons
		this.thumbPrev = document.createElement('button');
		this.thumbPrev.className = 'zoomee-thumb-nav zoomee-thumb-prev hidden';
		this.thumbPrev.textContent = '<';
		
		this.thumbNext = document.createElement('button');
		this.thumbNext.className = 'zoomee-thumb-nav zoomee-thumb-next hidden';
		this.thumbNext.textContent = '>';
		
		this.thumbsContainer.appendChild(this.thumbPrev);
		this.thumbsContainer.appendChild(this.thumbNext);
	  }
	  
	  // Create zoom overlay
	  this.overlay = document.createElement('div');
	  this.overlay.className = 'zoomee-overlay';
	  
	  this.overlayImg = document.createElement('img');
	  this.overlayImg.className = 'zoomee-overlay-img';
	  
	  this.closeButton = document.createElement('button');
	  this.closeButton.className = 'zoomee-overlay-close';
	  this.closeButton.textContent = '×';
	  
	  this.overlay.appendChild(this.overlayImg);
	  this.overlay.appendChild(this.closeButton);
	  
	  // Add elements to container
	  this.container.appendChild(this.slider);
	  
	  if (this.images.length > 1) {
		this.container.appendChild(this.thumbsContainer);
	  }
	  
	  // Add overlay to body
	  document.body.appendChild(this.overlay);
	}
	
	setupEventListeners() {
	  // Main navigation
	  if (this.images.length > 1) {
		this.prevButton.addEventListener('click', (e) => {
		  e.stopPropagation();
		  this.goToSlide(this.currentIndex - 1);
		});
		
		this.nextButton.addEventListener('click', (e) => {
		  e.stopPropagation();
		  this.goToSlide(this.currentIndex + 1);
		});
	  }
	  
	  // Thumbnail clicks
	  if (this.images.length > 1) {
		this.thumbs.forEach((thumb, index) => {
		  thumb.addEventListener('click', () => this.goToSlide(index));
		});
		
		// Thumbnail navigation
		this.thumbPrev.addEventListener('click', () => this.scrollThumbs(-1));
		this.thumbNext.addEventListener('click', () => this.scrollThumbs(1));
		
		// Update nav on scroll
		this.thumbsTrack.addEventListener('scroll', () => this.updateThumbnailNav());
	  }
	  
	  // Zoom
	  this.slider.addEventListener('click', () => {
		if (!this.isMobile || ZoomeeConfig.enableZoomOnMobile) {
		  this.openZoom();
		}
	  });
	  
	  // Close zoom
	  this.closeButton.addEventListener('click', () => this.closeZoom());
	  this.overlay.addEventListener('click', (e) => {
		if (e.target === this.overlay) {
		  this.closeZoom();
		}
	  });
	  
	  // Keyboard
	  document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
		  this.closeZoom();
		}
	  });
	  
	  // Touch
	  this.slider.addEventListener('touchstart', (e) => {
		this.touchStartX = e.changedTouches[0].screenX;
	  }, { passive: true });
	  
	  this.slider.addEventListener('touchend', (e) => {
		const touchEndX = e.changedTouches[0].screenX;
		const swipeDistance = touchEndX - this.touchStartX;
		
		if (Math.abs(swipeDistance) > 50) {
		  if (swipeDistance > 0) {
			this.goToSlide(this.currentIndex - 1);
		  } else {
			this.goToSlide(this.currentIndex + 1);
		  }
		}
	  }, { passive: true });
	}
	
	goToSlide(index) {
	  if (this.images.length <= 1) return;
	  
	  // Handle wrapping
	  if (index < 0) {
		index = this.images.length - 1;
	  } else if (index >= this.images.length) {
		index = 0;
	  }
	  
	  // Don't do anything if already on this slide
	  if (index === this.currentIndex) return;
	  
	  // Move track to new position
	  this.track.style.transform = `translateX(-${index * 100}%)`;
	  
	  // Update thumbnails
	  this.thumbs[this.currentIndex].classList.remove('active');
	  this.thumbs[index].classList.add('active');
	  
	  // Ensure active thumbnail is visible
	  this.scrollToThumb(index);
	  
	  // Update current index
	  this.currentIndex = index;
	}
	
	scrollToThumb(index) {
	  if (!this.thumbsTrack) return;
	  
	  const thumb = this.thumbs[index];
	  const thumbLeft = thumb.offsetLeft;
	  const thumbWidth = thumb.offsetWidth;
	  const trackWidth = this.thumbsTrack.offsetWidth;
	  const scrollLeft = this.thumbsTrack.scrollLeft;
	  
	  if (thumbLeft < scrollLeft) {
		this.thumbsTrack.scrollTo({
		  left: thumbLeft,
		  behavior: 'smooth'
		});
	  } else if (thumbLeft + thumbWidth > scrollLeft + trackWidth) {
		this.thumbsTrack.scrollTo({
		  left: thumbLeft + thumbWidth - trackWidth,
		  behavior: 'smooth'
		});
	  }
	  
	  this.updateThumbnailNav();
	}
	
	scrollThumbs(direction) {
	  const scrollAmount = this.thumbsTrack.offsetWidth * 0.8;
	  const newScrollLeft = this.thumbsTrack.scrollLeft + (direction * scrollAmount);
	  
	  this.thumbsTrack.scrollTo({
		left: newScrollLeft,
		behavior: 'smooth'
	  });
	  
	  setTimeout(() => this.updateThumbnailNav(), 300);
	}
	
	updateThumbnailNav() {
	  if (!this.thumbsTrack || !this.thumbPrev || !this.thumbNext) return;
	  
	  // Check if scrolling is possible
	  const hasOverflow = this.thumbsTrack.scrollWidth > this.thumbsTrack.clientWidth;
	  const atStart = this.thumbsTrack.scrollLeft <= 0;
	  const atEnd = this.thumbsTrack.scrollLeft + this.thumbsTrack.clientWidth >= this.thumbsTrack.scrollWidth - 5;
	  
	  // Show/hide navigation buttons based on overflow and scroll position
	  if (!hasOverflow) {
		this.thumbPrev.classList.add('hidden');
		this.thumbNext.classList.add('hidden');
		
		// When no overflow, use the configured position
		this.thumbsTrack.className = 'zoomee-thumbs-track ' + ZoomeeConfig.thumbnailPosition;
	  } else {
		// When we have overflow, show appropriate buttons
		this.thumbPrev.classList.toggle('hidden', atStart);
		this.thumbNext.classList.toggle('hidden', atEnd);
		
		// Use left alignment when there's overflow
		this.thumbsTrack.className = 'zoomee-thumbs-track left';
	  }
	}
	
	openZoom() {
	  const currentImg = this.slides[this.currentIndex].querySelector('img');
	  this.overlayImg.src = currentImg.src;
	  this.overlayImg.alt = currentImg.alt;
	  
	  this.overlay.classList.add('active');
	  document.body.style.overflow = 'hidden';
	}
	
	closeZoom() {
	  this.overlay.classList.remove('active');
	  document.body.style.overflow = '';
	}
  }
  
  // Initialize galleries
  document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.zoomee').forEach(gallery => new Zoomee(gallery));
  });
  
  // Detect new galleries
  const observer = new MutationObserver(mutations => {
	for (const mutation of mutations) {
	  if (mutation.type === 'childList') {
		for (const node of mutation.addedNodes) {
		  if (node.nodeType === 1) {
			if (node.classList && node.classList.contains('zoomee') && !node.querySelector('.zoomee-slider')) {
			  new Zoomee(node);
			}
		  }
		}
	  }
	}
  });
  
  // Start observing
  observer.observe(document.body, { childList: true, subtree: true });