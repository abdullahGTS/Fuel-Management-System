"use strict";

// script.js
function pageReady(callback) {
  if (document.readyState !== "loading") {
    callback();
  } else document.addEventListener("DOMContentLoaded", callback);
}

var PageLoader = {
  progress: 0,
  // To keep track of current progress
  init: function init() {
    // Initially start at 0%
    PageLoader.updateProgress(0); // Gradually increase progress until the DOM is ready

    var slowLoading = setInterval(function () {
      if (PageLoader.progress < 80) {
        PageLoader.updateProgress(PageLoader.progress + 1); // Increase slowly
      }
    }, 100); // Adjust the speed of the increase (100ms)
    // Track when the DOM is interactive (50%)

    document.onreadystatechange = function () {
      if (document.readyState === 'interactive') {
        clearInterval(slowLoading); // Stop the slow loading process

        PageLoader.slowIncreaseTo(90); // Slow increase to 90%
      } else if (document.readyState === 'complete') {
        PageLoader.slowIncreaseTo(100); // Finish loading (100%)
        // Hide the loader after a short delay

        setTimeout(function () {
          document.body.classList.add('loaded');
        }, 1400); // 700ms delay before hiding
      }
    }; // Track full page load (assets like images are loaded)


    window.addEventListener('load', function () {
      PageLoader.slowIncreaseTo(100); // Final increase to 100% when fully loaded
    });
  },
  // Function to update progress bar width
  updateProgress: function updateProgress(percent) {
    PageLoader.progress = percent;
    var progressBar = document.querySelector('.gts-progress-bar');
    progressBar.style.width = "".concat(percent, "%");
  },
  // Gradually increase the progress bar to a target value
  slowIncreaseTo: function slowIncreaseTo(target) {
    var incrementSpeed = 20; // How long each step takes (in ms)

    var interval = setInterval(function () {
      if (PageLoader.progress < target) {
        PageLoader.updateProgress(PageLoader.progress + 1); // Increment by 1% at a time
      } else {
        clearInterval(interval); // Stop when target is reached
      }
    }, incrementSpeed);
  }
};
var Button = {
  init: function init() {
    var buttonsNodeList = document.querySelectorAll(".btn");

    if (buttonsNodeList.length) {
      Button.rippleEffectMovement();
    }
  },
  rippleEffectMovement: function rippleEffectMovement() {
    var buttonsNodeList = document.querySelectorAll(".btn");
    buttonsNodeList.forEach(function (btn) {
      // Hover event
      btn.addEventListener("mouseenter", Button.createRipple); // Click event

      btn.addEventListener("click", Button.createRipple);
    });
  },
  createRipple: function createRipple(e) {
    var target = e.target; // The button element

    var x = e.clientX - target.getBoundingClientRect().left;
    var y = e.clientY - target.getBoundingClientRect().top;
    var rEffect = document.createElement("span");
    rEffect.style.left = "".concat(x, "px");
    rEffect.style.top = "".concat(y, "px");
    rEffect.classList.add("ripple"); // Add a class to the span for styling

    target.appendChild(rEffect);
    setTimeout(function () {
      rEffect.remove(); // Remove the ripple after the animation
    }, 850);
  }
};
var Popover = {
  init: function init() {
    var popoverNodeList = document.querySelectorAll(".popover-wrapper");

    if (popoverNodeList.length) {
      Popover.openPopover();
      Popover.closePopover();
    }
  },
  // Set the width of the popover to match the target element's width
  setWidth: function setWidth(targetElement, popoverBody) {
    var updatePopoverWidth = function updatePopoverWidth() {
      var targetRect = targetElement.getBoundingClientRect();
      popoverBody.style.width = "".concat(targetRect.width - 20, "px"); // Offset of 10px
    }; // Set the initial width when the popover is created


    updatePopoverWidth(); // Adjust the width on window resize

    window.addEventListener("resize", updatePopoverWidth);
  },
  setPosition: function setPosition(targetElement, popoverBody) {
    var updatePopoverPosition = function updatePopoverPosition() {
      var targetRect = targetElement.getBoundingClientRect(); // Get the dimensions and position of the clicked element

      var targetBody = popoverBody.getBoundingClientRect(); // Get the dimensions and position of the popover body

      var targetX = targetRect.left + window.scrollX; // Get the X position

      var targetY = targetRect.top - targetBody.height + window.scrollY; // Get the Y position
      // Set the initial position of the popover

      popoverBody.style.position = "absolute";
      popoverBody.style.top = "".concat(targetY + 10, "px"); // Offset of 10px from the target element

      popoverBody.style.left = "".concat(targetX + 10, "px"); // Offset of 10px from the target element
      // Check if the popover goes beyond the right edge of the screen

      var popoverRightEdge = targetX + 10 + popoverBody.offsetWidth;
      var viewportWidth = window.innerWidth + window.scrollX;

      if (popoverRightEdge > viewportWidth) {
        // If the popover exceeds the screen width, move it to the left to fit within the screen
        popoverBody.style.left = "".concat(viewportWidth - popoverBody.offsetWidth - 10, "px");
      } // Check if the popover goes beyond the left edge of the screen


      var popoverLeftEdge = targetX + 10;

      if (popoverLeftEdge < window.scrollX) {
        // If the popover is less than 0 (off-screen), adjust it to 10px from the left
        popoverBody.style.left = "10px";
      }
    }; // Set the initial position when the popover is created


    updatePopoverPosition(); // Adjust the position on window resize

    window.addEventListener("resize", updatePopoverPosition);
  },
  // Show the popover when clicking on the element with `data-target`
  openPopover: function openPopover() {
    var popoverTriggers = document.querySelectorAll("[data-popover-target]");
    popoverTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        var targetSelector = trigger.getAttribute("data-popover-target");
        var popoverWrapper = document.querySelector(targetSelector);
        var popoverBody = popoverWrapper.querySelector(".popover-body"); // Make the popover visible

        popoverWrapper.style.display = "block";
        Popover.setWidth(trigger, popoverBody);
        Popover.setPosition(trigger, popoverBody);
      });
    });
  },
  // Hide the popover when clicking the close button or outside the popover
  closePopover: function closePopover() {
    var popoverWrappers = document.querySelectorAll(".popover-wrapper");
    popoverWrappers.forEach(function (popoverWrapper) {
      var popoverBody = popoverWrapper.querySelector('.popover-body'); // Prevent the popover from closing when the popover body is clicked

      popoverBody.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent click from reaching the popoverWrapper
      });
      popoverWrapper.addEventListener("click", function (e) {
        popoverWrapper.style.display = "none";
      });
    });
  }
};
var MobileNav = {
  init: function init() {
    var navigation = document.querySelector("#side-bar");

    if (navigation && window.innerWidth < 769) {
      MobileNav.bindMenuEvents(); // Bind events only once

      console.log('Test');
    }

    window.addEventListener('resize', function () {
      if (window.innerWidth < 769) {
        MobileNav.bindMenuEvents(); // Ensure events are bound on mobile
      } else {
        MobileNav.unbindMenuEvents(); // Unbind events for desktop
      }
    });
  },
  bindMenuEvents: function bindMenuEvents() {
    var mobileMenuTrigger = document.querySelector("#mobile-menu");
    var navWrapper = document.querySelector("#nav-wrapper");
    var navTag = navWrapper.querySelector('nav');
    navTag.style.display = "none";
    navTag.style.visibility = "hidden";
    navTag.style.opacity = "0";

    if (mobileMenuTrigger && navWrapper) {
      mobileMenuTrigger.addEventListener("click", MobileNav.openMenu);
      navTag.addEventListener("click", MobileNav.preventNavClose);
    }
  },
  unbindMenuEvents: function unbindMenuEvents() {
    var mobileMenuTrigger = document.querySelector("#mobile-menu");
    var navWrapper = document.querySelector("#nav-wrapper");
    var navTag = navWrapper.querySelector('nav');
    navTag.style.display = "block";
    navTag.style.visibility = "visible";
    navTag.style.opacity = "1";

    if (mobileMenuTrigger && navWrapper) {
      mobileMenuTrigger.removeEventListener("click", MobileNav.openMenu);
      navTag.removeEventListener("click", MobileNav.preventNavClose);
    }
  },
  openMenu: function openMenu() {
    var navWrapper = document.querySelector("#nav-wrapper");
    var navTag = navWrapper.querySelector('nav');
    var navItems = navWrapper.querySelector('.nav-items'); // Show the menu

    navTag.style.display = "block";
    navTag.style.visibility = "visible";
    navTag.style.opacity = "1";
    setTimeout(function () {
      navTag.classList.add('open');
    }, 0); // Create and append the backdrop

    var backdrop = document.createElement("div");
    backdrop.id = "navBackdrop";
    backdrop.style.display = "block";
    navItems.appendChild(backdrop);
    backdrop.addEventListener("click", MobileNav.closeMenu);
  },
  closeMenu: function closeMenu() {
    var navWrapper = document.querySelector("#nav-wrapper");
    var backdrop = document.querySelector("#navBackdrop");
    var navTag = navWrapper.querySelector('nav'); // Remove the backdrop first

    if (backdrop) {
      backdrop.remove();
    } // Hide the menu


    navTag.classList.remove('open');
    setTimeout(function () {
      navTag.style.display = "none";
      navTag.style.visibility = "hidden";
      navTag.style.opacity = "0";
    }, 320);
  },
  preventNavClose: function preventNavClose(e) {
    e.stopPropagation(); // Prevent nav clicks from closing the menu
  }
};
pageReady(function () {
  PageLoader.init();
  Button.init();
  Popover.init();
  MobileNav.init();
});