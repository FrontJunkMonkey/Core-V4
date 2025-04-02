const slideSpeed = 5000;
document.addEventListener('DOMContentLoaded', () => {
	// Function to find and display the current breakpoint dynamically
	let parsedBreakpoints = {}; // Cache breakpoints to avoid re-parsing

	function getBreakpointsOnce() {
		// Iterate over all stylesheets
		for (const sheet of document.styleSheets) {
			if (!sheet.cssRules) continue;

			// Iterate over all rules in the stylesheet
			for (const rule of sheet.cssRules) {
				if (rule.selectorText === ':root') {
					const style = rule.style;

					// Extract variables starting with --breakpoint-
					for (let i = 0; i < style.length; i++) {
						const property = style[i];
						if (property.startsWith('--breakpoint-')) {
							const breakpointName = property.replace('--breakpoint-', '');
							const breakpointValue = parseInt(style.getPropertyValue(property).trim(), 10);
							parsedBreakpoints[breakpointName] = breakpointValue;
						}
					}
				}
			}
		}
	}
	// Run breakpoint detection once and cache results
	getBreakpointsOnce();

	// Function to get the current breakpoint based on screen width
	function getCurrentBreakpoint() {
		const screenWidth = window.innerWidth;
		let currentBreakpoint = '';
	
		for (const [breakpoint, value] of Object.entries(parsedBreakpoints)) {
			if (screenWidth >= value) {
				currentBreakpoint = breakpoint;
			}
		}
	
		return currentBreakpoint;
	}

    document.querySelectorAll('.slider').forEach(slider => {
        const sliderWrapper = document.createElement('div');

        // Helper function to convert padding classes to margin classes
        function convertPaddingToMargin(classes) {
            const convertedClasses = [];
            const uniqueClasses = new Set(); // Avoid duplicates

            classes.forEach(cls => {
                if (cls.startsWith('p-')) {
                    uniqueClasses.add(cls.replace('p-', 'm-'));
                } else if (cls.startsWith('px-')) {
                    uniqueClasses.add(cls.replace('px-', 'mx-'));
                } else if (cls.startsWith('py-')) {
                    uniqueClasses.add(cls.replace('py-', 'my-'));
                } else if (cls.startsWith('pt-')) {
                    uniqueClasses.add(cls.replace('pt-', 'mt-'));
                } else if (cls.startsWith('pb-')) {
                    uniqueClasses.add(cls.replace('pb-', 'mb-'));
                } else if (cls.startsWith('pl-')) {
                    uniqueClasses.add(cls.replace('pl-', 'ml-'));
                } else if (cls.startsWith('pr-')) {
                    uniqueClasses.add(cls.replace('pr-', 'mr-'));
                } else {
                    uniqueClasses.add(cls);
                }
            });

            return Array.from(uniqueClasses);
        }

        // Extract padding/margin-related classes
        const paddingMarginClasses = Array.from(slider.classList).filter(cls =>
			/^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr)-/.test(cls) && cls !== 'm-auto'
		  );

        // Convert padding classes to margin classes
        const convertedMarginClasses = convertPaddingToMargin(paddingMarginClasses);

        // Add converted classes to the wrapper
        sliderWrapper.classList.add(...convertedMarginClasses);

        // Remove original padding/margin classes from the slider
        slider.classList.remove(...paddingMarginClasses);

        // Transfer all slider-prefixed classes to the new wrapper
        Array.from(slider.classList).filter(cls => cls.startsWith('slider')).forEach(cls => {
            sliderWrapper.classList.add(cls);
            slider.classList.remove(cls);
        });

        // Insert the wrapper and append the slider to it
        slider.parentNode.insertBefore(sliderWrapper, slider);
        sliderWrapper.appendChild(slider);

        // Detect and handle slide-mxw-xxx class
        const mxwClass = slider.className.match(/slide-mxw-(\d+)/);
        if (mxwClass) {
            const maxWidth = mxwClass[1]; // Extract the xxx value

            // Wrap each child of the slider in a slide-inner div
            Array.from(slider.children).forEach(child => {
                const innerWrapper = document.createElement('div');
                innerWrapper.classList.add('slide-inner');
                innerWrapper.style.flex = '0 0 100%'; // Ensure the wrapper takes full width

                // Apply max-width and centering to the original child
                child.style.maxWidth = `${maxWidth}px`;
                child.style.margin = '0 auto';

                // Move the current child into the inner wrapper
                innerWrapper.appendChild(child);
                slider.appendChild(innerWrapper);
            });
        }

		// Get any div.slider classes ending on or off
		const sliderClasses = Array.from(sliderWrapper.classList).filter(cls => /-(on|off)$/.test(cls));

		// Function to determine if the slider should be on or off
		function isSliderOn() {
			const screenSize = getCurrentBreakpoint();
		  
			// Sort the classes based on the order of breakpoints
			const breakpointKeys = Object.keys(parsedBreakpoints);
			const sortedClasses = sliderClasses.sort((a, b) => {
				const aIndex = breakpointKeys.findIndex(bp => a.includes(bp));
				const bIndex = breakpointKeys.findIndex(bp => b.includes(bp));
				return aIndex - bIndex;
			});
		  		  
			// Check if sortedClasses is not empty
			let isOn;
			if (sortedClasses.length === 0) {
				isOn = true;
			}else{
				// Determine the default state based on the first class
				isOn = !sortedClasses[0].endsWith('-on');
			}
		  
			// Check each class against the screen size
			for (const cls of sortedClasses) {
				const [prefix, state] = cls.split('-').slice(-2);
				const breakpointIndex = Object.keys(parsedBreakpoints).indexOf(prefix);
			
				if (breakpointIndex !== -1 && breakpointIndex <= Object.keys(parsedBreakpoints).indexOf(screenSize)) {
				isOn = state === 'on';
				}
			}
		  
			return isOn;
		}

		let currentBreakpoint = getCurrentBreakpoint();

		window.addEventListener('resize', () => {
		const newBreakpoint = getCurrentBreakpoint();
			if (newBreakpoint !== currentBreakpoint) {
				currentBreakpoint = newBreakpoint;
				const sliderState = isSliderOn();
				toggleSlider(sliderState);
			}
		});
	
		// Determine the slider state based on the current screen size
		const sliderState = isSliderOn();

		let interval;
		let sliderActive = false; // Track the current state of the slider
		function toggleSlider(status) {
			if (status == true && !sliderActive) {
			  sliderActive = true;
			  // Handle slide duplication for seamless looping
			  if (!slider.classList.contains('duplicated')) {
				const firstChild = slider.firstElementChild.cloneNode(true);
				slider.appendChild(firstChild);
				slider.classList.add('duplicated');
			  }
		  
			  const slides = Array.from(slider.children);
			  const totalSlides = slides.length - 1; // Exclude duplicate
			  let currentSlide = 0;
		  
			  // Add dots or progress bar based on the slider class
			  if (sliderWrapper.classList.contains('slider-dots')) {
				const dotsContainer = document.createElement('div');
				dotsContainer.classList.add('dots');
		  
				// Create a dot for each original slide
				for (let i = 0; i < totalSlides; i++) {
				  const dot = document.createElement('div');
				  dot.classList.add('dot');
				  if (i === 0) dot.classList.add('active'); // Mark the first dot as active
				  dotsContainer.appendChild(dot);
				}
				sliderWrapper.appendChild(dotsContainer);
			  } else if (sliderWrapper.classList.contains('slider-bar')) {
				const progressBarContainer = document.createElement('div');
				progressBarContainer.classList.add('progress-bar');
			  
				const progressBarTrack = document.createElement('div');
				progressBarTrack.classList.add('track');
				progressBarTrack.style.width = `${30 * totalSlides}px`; // Track width based on slide count
				progressBarTrack.style.margin = '0 auto'; // Center the track
			  
				const progressBarIndicator = document.createElement('div');
				progressBarIndicator.classList.add('indicator');
			  
				progressBarTrack.appendChild(progressBarIndicator);
				progressBarContainer.appendChild(progressBarTrack);
				sliderWrapper.appendChild(progressBarContainer);
			  
				function updateBar(index) {
				  const position = index * 30; // Move 30px per slide
				  progressBarIndicator.style.transform = `translateX(${position}px)`;
				}
			  
				updateBar(0);
			  }
		  
			  function updateIndicators(index) {
				if (sliderWrapper.classList.contains('slider-dots')) {
				  const dots = sliderWrapper.querySelectorAll('.dot');
				  dots.forEach((dot, i) => {
					dot.classList.toggle('active', i === index);
				  });
				} else if (sliderWrapper.classList.contains('slider-bar')) {
				  const progressBarIndicator = sliderWrapper.querySelector('.progress-bar .indicator');
				  const position = index * 30; // Move 30px per slide
				  progressBarIndicator.style.transform = `translateX(${position}px)`;
				}
			  }
		  
			  // Handle slide animation
			  function setActiveSlide(index, noTransition = false) {
				if (noTransition) {
				  slider.style.transition = 'none';
				}
		  
				const offset = -index * 100;
				slider.style.transform = `translateX(${offset}%)`;
		  
				if (noTransition) {
				  slider.offsetWidth;  // Triggers a reflow
				  slider.style.transition = '';
				}
		  
				currentSlide = index;
				updateIndicators(index % totalSlides);
			  }
		  
			  slider.classList.add('slide-container');
			  setActiveSlide(0);
		  
			  interval = setInterval(() => {
				let nextSlide = (currentSlide + 1) % slides.length;
				if (nextSlide === totalSlides) {
				  setActiveSlide(nextSlide);
				  setTimeout(() => {
					setActiveSlide(0, true);
				  }, 500); // Matches the transition duration
				} else {
				  setActiveSlide(nextSlide);
				}
			  }, slideSpeed);
			} else if (status == false && sliderActive) {
			  sliderActive = false;
			  // Clear the interval
			  clearInterval(interval);
		  
			  // Remove duplicated slide
			  if (slider.classList.contains('duplicated')) {
				slider.removeChild(slider.lastElementChild);
				slider.classList.remove('duplicated');
			  }
		  
			  // Remove dots or progress bar
			  const dotsContainer = sliderWrapper.querySelector('.dots');
			  if (dotsContainer) {
				sliderWrapper.removeChild(dotsContainer);
			  }
		  
			  const progressBarContainer = sliderWrapper.querySelector('.progress-bar');
			  if (progressBarContainer) {
				sliderWrapper.removeChild(progressBarContainer);
			  }
		  
			  // Reset slider styles
			  slider.style.transform = '';
			  slider.style.transition = '';
		  
			  // Remove slide-container class
			  slider.classList.remove('slide-container');
			}
		  }
		toggleSlider(sliderState);
	  });
	  
});