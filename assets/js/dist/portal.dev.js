"use strict";

var MobileNav = {
  init: function init() {
    var navigation = document.querySelector("#side-bar");

    if (navigation && window.innerWidth < 769) {
      MobileNav.bindMenuEvents(); // Bind events only once
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
var NotificationSystem = {
  init: function init() {
    // Initialize the system if needed (e.g., attaching event listeners)
    var notificationItems = document.querySelectorAll('.notification-item-wrapper');
    notificationItems.forEach(function (item) {
      item.addEventListener('click', function () {
        return NotificationSystem.onClick(item);
      });
    });
  },
  unread: function unread() {// Here, developers can manage setting notifications as unread.
    // Example: You could toggle the 'unread' class or manage a state where unread notifications are stored.
  },
  onClick: function onClick(notificationElement) {
    // Remove the 'unread' class when a notification is clicked
    if (notificationElement.classList.contains('unread')) {
      notificationElement.classList.remove('unread');
    } // Get the value of data-notification-target


    var targetUrl = notificationElement.getAttribute('data-notification-target'); // If a target URL exists, redirect to that URL

    if (targetUrl) {
      setTimeout(function () {
        window.location.href = targetUrl;
      }, 900);
    }
  },
  markAllRead: function markAllRead() {
    // Go through all notifications and remove the 'unread' class
    var unreadNotifications = document.querySelectorAll('.notification-item-wrapper.unread');
    unreadNotifications.forEach(function (notification) {
      notification.classList.remove('unread');
    });
  }
};
pageReady(function () {
  MobileNav.init();
  NotificationSystem.init();
});