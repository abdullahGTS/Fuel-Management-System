// script.js
function pageReady(callback) {
  if (document.readyState !== "loading") {
    callback();
  } else document.addEventListener("DOMContentLoaded", callback);
}

const PageLoader = {
  progress: 0, // To keep track of current progress

  init: () => {
    const progressBar = document.querySelector('.gts-progress-bar');

    if (progressBar) {
      // Initially start at 0%
      PageLoader.updateProgress(0);

      // Gradually increase progress until the DOM is ready
      const slowLoading = setInterval(() => {
        if (PageLoader.progress < 80) {
          PageLoader.updateProgress(PageLoader.progress + 1); // Increase slowly
        }
      }, 100); // Adjust the speed of the increase (100ms)

      // Track when the DOM is interactive (50%)
      document.onreadystatechange = () => {
        if (document.readyState === 'interactive') {
          clearInterval(slowLoading); // Stop the slow loading process
          PageLoader.slowIncreaseTo(90); // Slow increase to 90%
        } else if (document.readyState === 'complete') {
          PageLoader.slowIncreaseTo(100); // Finish loading (100%)

          // Hide the loader after a short delay
          setTimeout(() => {
            document.body.classList.add('loaded');
          }, 1400); // 1400ms delay before hiding
        }
      };

      // Track full page load (assets like images are loaded)
      window.addEventListener('load', () => {
        PageLoader.slowIncreaseTo(100); // Final increase to 100% when fully loaded
      });
    }
  },

  // Function to update progress bar width
  updateProgress: (percent) => {
    PageLoader.progress = percent;
    const progressBar = document.querySelector('.gts-progress-bar');
    progressBar.style.width = `${percent}%`;
  },

  // Gradually increase the progress bar to a target value
  slowIncreaseTo: (target) => {
    const incrementSpeed = 20; // How long each step takes (in ms)
    const interval = setInterval(() => {
      if (PageLoader.progress < target) {
        PageLoader.updateProgress(PageLoader.progress + 1); // Increment by 1% at a time
      } else {
        clearInterval(interval); // Stop when target is reached
      }
    }, incrementSpeed);
  }
};

const Button = {
  init: () => {
    const buttonsNodeList = document.querySelectorAll(".btn");
    if (buttonsNodeList.length) {
      Button.rippleEffectMovement();
    }
  },

  rippleEffectMovement: () => {
    const buttonsNodeList = document.querySelectorAll(".btn");
    buttonsNodeList.forEach((btn) => {
      // Hover event
      btn.addEventListener("mouseenter", Button.createRipple);
      // Click event
      btn.addEventListener("click", Button.createRipple);
    });
  },

  createRipple: function (e) {
    const target = e.target; // The button element
    const x = e.clientX - target.getBoundingClientRect().left;
    const y = e.clientY - target.getBoundingClientRect().top;
    const rEffect = document.createElement("span");

    rEffect.style.left = `${x}px`;
    rEffect.style.top = `${y}px`;
    rEffect.classList.add("ripple"); // Add a class to the span for styling

    target.appendChild(rEffect);
    setTimeout(() => {
      rEffect.remove(); // Remove the ripple after the animation
    }, 850);
  },
};

const Popover = {
  init: () => {
    const popoverNodeList = document.querySelectorAll(".popover-wrapper");
    if (popoverNodeList.length) {
      Popover.openPopover();
      Popover.closePopover();
    }
  },

  // Set the width of the popover to match the target element's width
  setWidth: (targetElement, popoverBody) => {
    const updatePopoverWidth = () => {
      const targetRect = targetElement.getBoundingClientRect();
      popoverBody.style.width = `${targetRect.width - 20}px`; // Offset of 10px
    }

    // Set the initial width when the popover is created
    updatePopoverWidth();

    // Adjust the width on window resize
    window.addEventListener("resize", updatePopoverWidth);

  },

  // setPosition: (targetElement, popoverBody) => {
  //   const updatePopoverPosition = () => {
  //     const targetRect = targetElement.getBoundingClientRect(); // Get the dimensions and position of the clicked element
  //     const targetBody = popoverBody.getBoundingClientRect(); // Get the dimensions and position of the popover body
  //     const targetX = targetRect.left + window.scrollX; // Get the X position
  //     const targetY = (targetRect.top - targetBody.height) + window.scrollY; // Get the Y position

  //     // Set the initial position of the popover
  //     popoverBody.style.position = "absolute";
  //     popoverBody.style.top = `${targetY + 10}px`; // Offset of 10px from the target element
  //     popoverBody.style.left = `${targetX + 10}px`; // Offset of 10px from the target element

  //     // Check if the popover goes beyond the right edge of the screen
  //     const popoverRightEdge = targetX + 10 + popoverBody.offsetWidth;
  //     const viewportWidth = window.innerWidth + window.scrollX;
  //     if (popoverRightEdge > viewportWidth) {
  //       // If the popover exceeds the screen width, move it to the left to fit within the screen
  //       popoverBody.style.left = `${viewportWidth - popoverBody.offsetWidth - 10}px`;
  //     }

  //     // Check if the popover goes beyond the left edge of the screen
  //     const popoverLeftEdge = targetX + 10;
  //     if (popoverLeftEdge < window.scrollX) {
  //       // If the popover is less than 0 (off-screen), adjust it to 10px from the left
  //       popoverBody.style.left = `10px`;
  //     }
  //   };

  //   // Set the initial position when the popover is created
  //   updatePopoverPosition();

  //   // Adjust the position on window resize
  //   window.addEventListener("resize", updatePopoverPosition);
  // },

  setPosition: (targetElement, popoverBody) => {
    const updatePopoverPosition = () => {
        const targetRect = targetElement.getBoundingClientRect(); // Get dimensions of the clicked element
        const targetBody = popoverBody.getBoundingClientRect(); // Get dimensions of the popover body
        const targetX = targetRect.left + window.scrollX; // Get the X position
        let targetY = (targetRect.top - targetBody.height) + window.scrollY; // Get the default Y position (top)
        
        const parentWrapper = popoverBody.closest('.popover-wrapper'); // Find the parent with class 'popover-wrapper'
        
        // Check if the 'popover-wrapper' has the 'data-position' attribute and if it's set to 'bottom'
        if (parentWrapper && parentWrapper.dataset.position === 'bottom') {
            targetY = (targetRect.bottom + window.scrollY); // Adjust Y for bottom position
        }

        // Set the initial position of the popover
        popoverBody.style.position = "absolute";
        popoverBody.style.top = `${targetY + 10}px`; // Offset of 10px from the target element
        popoverBody.style.left = `${targetX + 10}px`; // Offset of 10px from the target element

        // Check if the popover goes beyond the right edge of the screen
        const popoverRightEdge = targetX + 10 + popoverBody.offsetWidth;
        const viewportWidth = window.innerWidth + window.scrollX;
        if (popoverRightEdge > viewportWidth) {
            // If the popover exceeds the screen width, move it to the left to fit within the screen
            popoverBody.style.left = `${viewportWidth - popoverBody.offsetWidth - 10}px`;
        }

        // Check if the popover goes beyond the left edge of the screen
        const popoverLeftEdge = targetX + 10;
        if (popoverLeftEdge < window.scrollX) {
            // If the popover is less than 0 (off-screen), adjust it to 10px from the left
            popoverBody.style.left = `10px`;
        }
    };

    // Set the initial position when the popover is created
    updatePopoverPosition();

    // Adjust the position on window resize
    window.addEventListener("resize", updatePopoverPosition);
},
  
  
  // Show the popover when clicking on the element with `data-target`
  openPopover: () => {
    const popoverTriggers = document.querySelectorAll("[data-popover-target]");

    popoverTriggers.forEach(trigger => {
      trigger.addEventListener("click", (e) => {
        const targetSelector = trigger.getAttribute("data-popover-target");
        const popoverWrapper = document.querySelector(targetSelector);
        const popoverBody = popoverWrapper.querySelector(".popover-body");

        // Make the popover visible
        popoverWrapper.style.display = "block";

        Popover.setWidth(trigger, popoverBody);
        Popover.setPosition(trigger, popoverBody);
      });
    });
  },

  // Hide the popover when clicking the close button or outside the popover
  closePopover: () => {
    const popoverWrappers = document.querySelectorAll(".popover-wrapper");
    popoverWrappers.forEach(popoverWrapper => {
      const popoverBody = popoverWrapper.querySelector('.popover-body');

      // Prevent the popover from closing when the popover body is clicked
      popoverBody.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent click from reaching the popoverWrapper
      });
      popoverWrapper.addEventListener("click", (e) => {
        popoverWrapper.style.display = "none";
      });
    });
  }
};

pageReady(() => {
  PageLoader.init();
  Button.init();
  Popover.init();
});