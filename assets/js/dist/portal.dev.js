"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppearanceToggle = void 0;

var _script = require("./script.js");

// portal.js
var MobileNav = {
  init: function init() {
    var navigation = document.querySelector("#side-bar");

    if (navigation && window.innerWidth < 641) {
      MobileNav.bindMenuEvents(); // Bind events only once
    }

    window.addEventListener('resize', function () {
      if (window.innerWidth < 641) {
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
    var acknowledgeAll = document.querySelector('#acknowledge-all');
    acknowledgeAll.addEventListener('click', function () {
      return NotificationSystem.markAllRead();
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
    var gtsNotificationBadge = document.querySelector('.gts-notification .gts-badge');
    if (gtsNotificationBadge) gtsNotificationBadge.remove();
    unreadNotifications.forEach(function (notification) {
      notification.classList.remove('unread');
    });
  }
};
var CollapsedMenu = {
  // Track whether tooltips are active
  isTooltipActive: false,
  // Initialize menu toggle functionality
  init: function init() {
    document.getElementById('toggle-menu').addEventListener('click', function () {
      return CollapsedMenu.toggle('toggle');
    });
  },
  // Toggle the collapsed menu state and handle tooltip activation
  toggle: function toggle(force) {
    if (force === true) {
      document.body.classList.add('gts-menu-collapsed');
    } else if (force === false) {//document.body.classList.remove('gts-menu-collapsed');
    } else {
      // 'toggle' mode to switch between collapsed/expanded states
      document.body.classList.toggle('gts-menu-collapsed');
    }

    var isCollapsed = document.body.classList.contains('gts-menu-collapsed');
    var windiwWidth = window.innerWidth;

    if (isCollapsed && !CollapsedMenu.isTooltipActive && windiwWidth > 1024) {
      CollapsedMenu.activateTooltips();
    } else if (!isCollapsed && CollapsedMenu.isTooltipActive) {
      CollapsedMenu.deactivateTooltips();
    }

    var tablesArry = document.querySelectorAll('.gts-dt-wrapper table');

    if (tablesArry.length) {
      tablesArry.forEach(function (table) {
        var tableApi = $(table).DataTable();

        if (tableApi) {
          tableApi.responsive.recalc();
        }
      });
    }
  },
  // Activate tooltips by adding mouse event listeners
  activateTooltips: function activateTooltips() {
    CollapsedMenu.isTooltipActive = true;
    var navLinks = document.querySelectorAll('#side-bar .nav-items nav ul li a');
    navLinks.forEach(function (link) {
      link.addEventListener('mouseenter', CollapsedMenu.showTooltip);
      link.addEventListener('mouseleave', CollapsedMenu.hideTooltip);
    });
  },
  // Deactivate tooltips by removing mouse event listeners
  deactivateTooltips: function deactivateTooltips() {
    CollapsedMenu.isTooltipActive = false;
    var navLinks = document.querySelectorAll('#side-bar .nav-items nav ul li a');
    navLinks.forEach(function (link) {
      link.removeEventListener('mouseenter', CollapsedMenu.showTooltip);
      link.removeEventListener('mouseleave', CollapsedMenu.hideTooltip);
    });
    CollapsedMenu.removeAllTooltips();
  },
  // Show tooltip on hover
  showTooltip: function showTooltip(event) {
    var link = event.currentTarget;
    var tooltipText = link.querySelector('.nav-item').innerHTML; // Create tooltip element

    var tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.innerHTML = tooltipText; // Position tooltip

    var rect = link.getBoundingClientRect();
    tooltip.style.position = 'absolute';
    tooltip.style.left = "".concat(rect.right - 5, "px");
    tooltip.style.top = "".concat(rect.top + rect.height / 2, "px"); // Attach tooltip to document and reference it in the element for removal

    var navWrapper = document.querySelector('#nav-wrapper');
    navWrapper.appendChild(tooltip);
    link._tooltip = tooltip;
  },
  // Hide tooltip on mouse leave
  hideTooltip: function hideTooltip(event) {
    var link = event.currentTarget;

    if (link._tooltip) {
      link._tooltip.remove();

      delete link._tooltip;
    }
  },
  // Remove all tooltips
  removeAllTooltips: function removeAllTooltips() {
    var tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(function (tooltip) {
      return tooltip.remove();
    });
  }
}; // Check if we are implementing ForceResponsive correctly

var ForceResponsive = {
  init: function init() {
    ForceResponsive.checkWidth(); // Check width on initialization

    window.addEventListener('resize', ForceResponsive.checkWidth); // Set up resize listener
  },
  checkWidth: function checkWidth() {
    var shouldCollapse = window.innerWidth < 1581;
    CollapsedMenu.toggle(shouldCollapse); // Force collapse or expand based on width
  }
};
var AppearanceToggle = {
  callbacks: [],
  init: function init() {
    var savedAppearance = localStorage.getItem('gts-appearance'); // If no saved appearance, set default to light mode

    if (!savedAppearance) {
      localStorage.setItem('gts-appearance', 'light');
      AppearanceToggle.applyMode('light');
    } else {
      // Apply the saved appearance (light, dark, or system)
      if (savedAppearance === 'system') {
        var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        AppearanceToggle.applyMode(systemPrefersDark ? 'dark' : 'light');
      } else {
        AppearanceToggle.applyMode(savedAppearance);
      }
    }

    var appearanceWrapper = document.querySelector('#appearance-wrapper');

    if (appearanceWrapper) {
      // Add change event listeners to checkboxes
      document.getElementById('light-mode-checkbox').addEventListener('change', function (e) {
        if (e.target.checked) AppearanceToggle.toggleMode('light');
      });
      document.getElementById('dark-mode-checkbox').addEventListener('change', function (e) {
        if (e.target.checked) AppearanceToggle.toggleMode('dark');
      });
      document.getElementById('system-mode-checkbox').addEventListener('change', function (e) {
        if (e.target.checked) AppearanceToggle.toggleMode('system');
      }); // Ensure the correct checkbox is selected based on the saved mode

      AppearanceToggle.setCheckedMode(savedAppearance || 'light'); // Add listener for system appearance changes if system mode is selected

      AppearanceToggle.addSystemModeListener();
    }
  },
  toggleMode: function toggleMode(mode) {
    // Update localStorage and apply the corresponding mode
    localStorage.setItem('gts-appearance', mode);

    if (mode === 'system') {
      // Check system preferences for light or dark mode
      var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      AppearanceToggle.applyMode(systemPrefersDark ? 'dark' : 'light');
    } else {
      AppearanceToggle.applyMode(mode);
    } // Set the correct checkbox after toggling mode


    AppearanceToggle.setCheckedMode(mode);
  },
  applyMode: function applyMode(mode) {
    var body = document.body;
    var logoImages = document.querySelectorAll('.gts-logo a img'); // Apply light mode

    if (mode === 'light') {
      body.classList.remove('dark-mode');
      logoImages.forEach(function (img) {
        img.src = img.src.replace('-light', ''); // Remove -light from image filenames
      });
    } // Apply dark mode
    else if (mode === 'dark') {
        body.classList.add('dark-mode');
        logoImages.forEach(function (img) {
          if (img.classList.contains('desktop')) {
            if (!img.src.includes('-light')) {
              var extensionIndex = img.src.lastIndexOf('.');
              img.src = img.src.slice(0, extensionIndex) + '-light' + img.src.slice(extensionIndex);
            }
          }
        });
      } // Execute all registered callbacks


    AppearanceToggle.callbacks.forEach(function (callback) {
      return callback(mode);
    });
  },
  setCheckedMode: function setCheckedMode(mode) {
    // Uncheck all checkboxes first
    document.getElementById('light-mode-checkbox').checked = false;
    document.getElementById('dark-mode-checkbox').checked = false;
    document.getElementById('system-mode-checkbox').checked = false; // Check the appropriate checkbox based on the current mode

    if (mode === 'light') {
      document.getElementById('light-mode-checkbox').checked = true;
    } else if (mode === 'dark') {
      document.getElementById('dark-mode-checkbox').checked = true;
    } else if (mode === 'system') {
      document.getElementById('system-mode-checkbox').checked = true;
    }
  },
  addSystemModeListener: function addSystemModeListener() {
    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)'); // Listen for system appearance mode changes

    mediaQuery.addEventListener('change', function (e) {
      var savedAppearance = localStorage.getItem('gts-appearance');

      if (savedAppearance === 'system') {
        AppearanceToggle.applyMode(e.matches ? 'dark' : 'light');
      }
    });
  },
  registerCallback: function registerCallback(callback) {
    if (typeof callback === 'function') {
      AppearanceToggle.callbacks.push(callback);
    }
  }
};
exports.AppearanceToggle = AppearanceToggle;
(0, _script.pageReady)(function () {
  _script.Modal.init();

  _script.PageLoader.init();

  _script.Button.init();

  _script.Popover.init();

  _script.Drawer.init();

  _script.Tab.init();

  AppearanceToggle.init();
  MobileNav.init();
  NotificationSystem.init();
  CollapsedMenu.init();
  ForceResponsive.init();
  var tablesArry = document.querySelectorAll('.gts-dt-wrapper table');

  if (tablesArry.length) {
    tablesArry.forEach(function (table) {
      var tableApi = $(table).DataTable();

      if (tableApi) {
        tableApi.responsive.recalc();
      }
    });
  }
});