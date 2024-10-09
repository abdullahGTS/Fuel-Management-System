"use strict";

// script.js
function pageReady(callback) {
  if (document.readyState !== "loading") {
    callback();
  } else document.addEventListener("DOMContentLoaded", callback);
}

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
    var targetRect = targetElement.getBoundingClientRect();
    popoverBody.style.width = "".concat(targetRect.width - 20, "px"); // Offset of 10px
  },
  // setPosition: (targetElement, popoverBody) => {
  //   const targetRect = targetElement.getBoundingClientRect(); // Get the dimensions and position of the clicked element
  //   const targetBody = popoverBody.getBoundingClientRect(); // Get the dimensions and position of the clicked element
  //   const targetX = targetRect.left + window.scrollX; // Get the X position
  //   const targetY = ( targetRect.top - targetBody.height)  + window.scrollY; // Get the Y position
  //   // Set the initial position of the popover
  //   popoverBody.style.position = "absolute";
  //   popoverBody.style.top = `${targetY + 10}px`; // Offset of 10px from the target element
  //   popoverBody.style.left = `${targetX + 10}px`; // Offset of 10px from the target element
  //   // Check if the popover goes beyond the right edge of the screen
  //   const popoverRightEdge = targetX + 10 + popoverBody.offsetWidth;
  //   const viewportWidth = window.innerWidth + window.scrollX;
  //   if (popoverRightEdge > viewportWidth) {
  //     // If the popover exceeds the screen width, move it to the left to fit within the screen
  //     popoverBody.style.left = `${viewportWidth - popoverBody.offsetWidth - 10}px`;
  //   }
  //   // Check if the popover goes beyond the left edge of the screen
  //   const popoverLeftEdge = targetX + 10;
  //   if (popoverLeftEdge < window.scrollX) {
  //     // If the popover is less than 0 (off-screen), adjust it to 10px from the left
  //     popoverBody.style.left = `10px`;
  //   }
  // },
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

    if (navigation) {
      MobileNav.openMenu();
      MobileNav.closeMenu();
    }
  },
  openMenu: function openMenu() {
    var mobileMenuTrigger = document.querySelector("#mobile-menu"); // The element that opens the menu

    var navWrapper = document.querySelector("#nav-wrapper"); // The container that holds the navigation menu

    var navTag = navWrapper.querySelector('nav');
    var navItems = navWrapper.querySelector('.nav-items');

    if (mobileMenuTrigger && navWrapper) {
      mobileMenuTrigger.addEventListener("click", function () {
        // Display the nav menu
        navTag.style.display = "flex"; // Create a backdrop

        var backdrop = document.createElement("div");
        backdrop.id = "navBackdrop";
        backdrop.style.display = "block"; // Append the backdrop to the body

        navItems.appendChild(backdrop);
        navTag.addEventListener("click", function (e) {
          e.stopPropagation(); // Prevent click from propagating to backdrop
        }); // When the backdrop is clicked, close the menu

        backdrop.addEventListener("click", MobileNav.closeMenu);
      });
    }
  },
  closeMenu: function closeMenu() {
    var navWrapper = document.querySelector("#nav-wrapper");
    var backdrop = document.querySelector("#navBackdrop");
    var navTag = navWrapper.querySelector('nav'); // Hide the nav menu

    if (navWrapper) {
      navTag.style.display = "none";
    } // Remove the backdrop


    if (backdrop) {
      backdrop.remove();
    }
  }
}; // Ensures the page is ready before initializing components

pageReady(function () {
  Button.init();
  Popover.init();
  MobileNav.init();
});