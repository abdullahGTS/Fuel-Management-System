// script.js
function pageReady(callback) {
  if (document.readyState !== "loading") {
    callback();
  } else document.addEventListener("DOMContentLoaded", callback);
}

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

  setPosition: (targetElement, popoverBody) => {
    const updatePopoverPosition = () => {
      const targetRect = targetElement.getBoundingClientRect(); // Get the dimensions and position of the clicked element
      const targetBody = popoverBody.getBoundingClientRect(); // Get the dimensions and position of the popover body
      const targetX = targetRect.left + window.scrollX; // Get the X position
      const targetY = (targetRect.top - targetBody.height) + window.scrollY; // Get the Y position
  
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

const MobileNav = {
  init: () => {
    const navigation = document.querySelector("#side-bar");

    if (navigation && window.innerWidth < 769) {
      MobileNav.bindMenuEvents();  // Bind events only once
      console.log('Test');
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth < 769) {
        MobileNav.bindMenuEvents();  // Ensure events are bound on mobile
      } else {
        MobileNav.unbindMenuEvents();  // Unbind events for desktop
      }
    });
  },

  bindMenuEvents: () => {
    const mobileMenuTrigger = document.querySelector("#mobile-menu");
    const navWrapper = document.querySelector("#nav-wrapper");
    const navTag = navWrapper.querySelector('nav');

    navTag.style.display = "none";
    navTag.style.visibility = "hidden";
    navTag.style.opacity = "0"; 

    if (mobileMenuTrigger && navWrapper) {
      mobileMenuTrigger.addEventListener("click", MobileNav.openMenu);
      navTag.addEventListener("click", MobileNav.preventNavClose);
    }
  },

  unbindMenuEvents: () => {
    const mobileMenuTrigger = document.querySelector("#mobile-menu");
    const navWrapper = document.querySelector("#nav-wrapper");
    const navTag = navWrapper.querySelector('nav');
    navTag.style.display = "block";
    navTag.style.visibility = "visible";
    navTag.style.opacity = "1"; 

    if (mobileMenuTrigger && navWrapper) {
      mobileMenuTrigger.removeEventListener("click", MobileNav.openMenu);
      navTag.removeEventListener("click", MobileNav.preventNavClose);
    }
  },

  openMenu: () => {
    const navWrapper = document.querySelector("#nav-wrapper");
    const navTag = navWrapper.querySelector('nav');
    const navItems = navWrapper.querySelector('.nav-items');

    // Show the menu
      navTag.style.display = "block";
      navTag.style.visibility = "visible";
      navTag.style.opacity = "1"; 
      setTimeout(() => {
        navTag.classList.add('open');
      }, 0);

    // Create and append the backdrop
    const backdrop = document.createElement("div");
    backdrop.id = "navBackdrop";
    backdrop.style.display = "block";
    navItems.appendChild(backdrop);

    backdrop.addEventListener("click", MobileNav.closeMenu);
  },

  closeMenu: () => {
    const navWrapper = document.querySelector("#nav-wrapper");
    const backdrop = document.querySelector("#navBackdrop");
    const navTag = navWrapper.querySelector('nav');

    // Remove the backdrop first
    if (backdrop) {
      backdrop.remove();
    }

    // Hide the menu
    navTag.classList.remove('open');
    setTimeout(() => {
      navTag.style.display = "none";
      navTag.style.visibility = "hidden";
      navTag.style.opacity = "0"; 
    }, 320);
  },

  preventNavClose: (e) => {
    e.stopPropagation();  // Prevent nav clicks from closing the menu
  }
};

pageReady(() => {
  Button.init();
  Popover.init();
  MobileNav.init();
});