// Function to check if an element is overflowing
function isTextOverflowing(element) {
    return element.scrollHeight > element.clientHeight;
}

// Function to apply or remove "Read more" functionality
function applyReadMore(container) {
    // Remove existing button if present
    const existingButton = container.nextElementSibling;
    if (existingButton && existingButton.classList.contains('read-more-wrapper')) {
        existingButton.remove();
    }

    // Check if the container is overflowing
    if (isTextOverflowing(container)) {
        // Create the wrapper div
        const wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('text-right', 'read-more-wrapper');

        // Create and insert the "Read more" button
        const toggleButton = document.createElement('button');
        toggleButton.classList.add('read-more', 'fs-sm', 'mt-1');
        toggleButton.textContent = 'Read more';
        wrapperDiv.appendChild(toggleButton);

        // Insert the wrapper div after the container
        container.parentElement.insertBefore(wrapperDiv, container.nextSibling);

        // Toggle the text visibility
        toggleButton.addEventListener('click', () => {
            const maxLinesClass = Array.from(container.classList).find(cls => cls.startsWith('max-lines-'));
            if (maxLinesClass) {
                container.classList.remove(maxLinesClass);
            }
            wrapperDiv.style.display = 'none';
        });
    }
}

// Function to initialize "Read more" functionality
function initializeReadMore() {
    const containers = document.querySelectorAll('.readMore');

    if (containers.length > 0) {
        containers.forEach(container => {
            applyReadMore(container);
        });

        // Reapply "Read more" on window resize or orientation change
        window.addEventListener('resize', initializeReadMore);
        window.addEventListener('orientationchange', initializeReadMore);
    }
}

// Initialize "Read more" on page load if there are elements with the class "readMore"
//document.addEventListener('DOMContentLoaded', initializeReadMore);
initializeReadMore();