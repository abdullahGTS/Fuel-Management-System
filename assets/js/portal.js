// portal.js
import { pageReady, PageLoader, Button, Popover, Modal, Drawer, Tab } from './script.js';

const MobileNav = {
    init: () => {
        const navigation = document.querySelector("#side-bar");

        if (navigation && window.innerWidth < 641) {
            MobileNav.bindMenuEvents();  // Bind events only once
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth < 641) {
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

const NotificationSystem = {
    init: () => {
        // Initialize the system if needed (e.g., attaching event listeners)
        const notificationItems = document.querySelectorAll('.notification-item-wrapper');
        notificationItems.forEach(item => {
            item.addEventListener('click', () => NotificationSystem.onClick(item));
        });

        const acknowledgeAll = document.querySelector('#acknowledge-all');
        acknowledgeAll.addEventListener('click', () => NotificationSystem.markAllRead());
    },

    unread: () => {
        // Here, developers can manage setting notifications as unread.
        // Example: You could toggle the 'unread' class or manage a state where unread notifications are stored.
    },

    onClick: (notificationElement) => {
        // Remove the 'unread' class when a notification is clicked
        if (notificationElement.classList.contains('unread')) {
            notificationElement.classList.remove('unread');
        }

        // Get the value of data-notification-target
        const targetUrl = notificationElement.getAttribute('data-notification-target');

        // If a target URL exists, redirect to that URL
        if (targetUrl) {
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 900)
        }
    },

    markAllRead: () => {
        // Go through all notifications and remove the 'unread' class
        const unreadNotifications = document.querySelectorAll('.notification-item-wrapper.unread');
        const gtsNotificationBadge = document.querySelector('.gts-notification .gts-badge');
        if ( gtsNotificationBadge ) gtsNotificationBadge.remove();
        unreadNotifications.forEach(notification => {
            notification.classList.remove('unread');
        });
    }
};

const CollapsedMenu = {
    // Track whether tooltips are active
    isTooltipActive: false,

    // Initialize menu toggle functionality
    init: () => {
        document.getElementById('toggle-menu').addEventListener('click', () => CollapsedMenu.toggle('toggle'));
    },

    // Toggle the collapsed menu state and handle tooltip activation
    toggle: (force) => {
        if (force === true) {
            document.body.classList.add('gts-menu-collapsed');
        } else if (force === false) {
            //document.body.classList.remove('gts-menu-collapsed');
        } else {
            // 'toggle' mode to switch between collapsed/expanded states
            document.body.classList.toggle('gts-menu-collapsed');
        }

        const isCollapsed = document.body.classList.contains('gts-menu-collapsed');
        const windiwWidth = window.innerWidth;
        if (isCollapsed && !CollapsedMenu.isTooltipActive && windiwWidth > 1024) {
            CollapsedMenu.activateTooltips();
        } else if (!isCollapsed && CollapsedMenu.isTooltipActive) {
            CollapsedMenu.deactivateTooltips();
        }

        const tablesArry = document.querySelectorAll('.gts-dt-wrapper table');
        if (tablesArry.length) {
            tablesArry.forEach(table => {
                const tableApi = $(table).DataTable();
                if (tableApi) {
                    tableApi.responsive.recalc();
                }
            })
        }
    },

    // Activate tooltips by adding mouse event listeners
    activateTooltips: () => {
        CollapsedMenu.isTooltipActive = true;
        const navLinks = document.querySelectorAll('#side-bar .nav-items nav ul li a');

        navLinks.forEach(link => {
            link.addEventListener('mouseenter', CollapsedMenu.showTooltip);
            link.addEventListener('mouseleave', CollapsedMenu.hideTooltip);
        });
    },

    // Deactivate tooltips by removing mouse event listeners
    deactivateTooltips: () => {
        CollapsedMenu.isTooltipActive = false;
        const navLinks = document.querySelectorAll('#side-bar .nav-items nav ul li a');

        navLinks.forEach(link => {
            link.removeEventListener('mouseenter', CollapsedMenu.showTooltip);
            link.removeEventListener('mouseleave', CollapsedMenu.hideTooltip);
        });
        CollapsedMenu.removeAllTooltips();
    },

    // Show tooltip on hover
    showTooltip: (event) => {
        const link = event.currentTarget;
        const tooltipText = link.querySelector('.nav-item').innerHTML;

        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.innerHTML = tooltipText;

        // Position tooltip
        const rect = link.getBoundingClientRect();
        tooltip.style.position = 'absolute';
        tooltip.style.left = `${rect.right - 5}px`;
        tooltip.style.top = `${rect.top + rect.height / 2}px`;

        // Attach tooltip to document and reference it in the element for removal
        const navWrapper = document.querySelector('#nav-wrapper');
        navWrapper.appendChild(tooltip);
        link._tooltip = tooltip;
    },

    // Hide tooltip on mouse leave
    hideTooltip: (event) => {
        const link = event.currentTarget;
        if (link._tooltip) {
            link._tooltip.remove();
            delete link._tooltip;
        }
    },

    // Remove all tooltips
    removeAllTooltips: () => {
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(tooltip => tooltip.remove());
    }
};

// Check if we are implementing ForceResponsive correctly
const ForceResponsive = {
    init: () => {
        ForceResponsive.checkWidth(); // Check width on initialization
        window.addEventListener('resize', ForceResponsive.checkWidth); // Set up resize listener
    },

    checkWidth: () => {
        const shouldCollapse = window.innerWidth < 1581;
        CollapsedMenu.toggle(shouldCollapse); // Force collapse or expand based on width
    }
};

export const AppearanceToggle = {
    callbacks: [],

    init: () => {
        const savedAppearance = localStorage.getItem('gts-appearance');

        // If no saved appearance, set default to light mode
        if (!savedAppearance) {
            localStorage.setItem('gts-appearance', 'light');
            AppearanceToggle.applyMode('light');
        } else {
            // Apply the saved appearance (light, dark, or system)
            if (savedAppearance === 'system') {
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                AppearanceToggle.applyMode(systemPrefersDark ? 'dark' : 'light');
            } else {
                AppearanceToggle.applyMode(savedAppearance);
            }
        }

        const appearanceWrapper = document.querySelector('#appearance-wrapper');

        if (appearanceWrapper) {
            // Add change event listeners to checkboxes
            document.getElementById('light-mode-checkbox').addEventListener('change', (e) => {
                if (e.target.checked) AppearanceToggle.toggleMode('light');
            });
            document.getElementById('dark-mode-checkbox').addEventListener('change', (e) => {
                if (e.target.checked) AppearanceToggle.toggleMode('dark');
            });
            document.getElementById('system-mode-checkbox').addEventListener('change', (e) => {
                if (e.target.checked) AppearanceToggle.toggleMode('system');
            });

            // Ensure the correct checkbox is selected based on the saved mode
            AppearanceToggle.setCheckedMode(savedAppearance || 'light');

            // Add listener for system appearance changes if system mode is selected
            AppearanceToggle.addSystemModeListener();
        }
    },

    toggleMode: (mode) => {
        // Update localStorage and apply the corresponding mode
        localStorage.setItem('gts-appearance', mode);

        if (mode === 'system') {
            // Check system preferences for light or dark mode
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            AppearanceToggle.applyMode(systemPrefersDark ? 'dark' : 'light');
        } else {
            AppearanceToggle.applyMode(mode);
        }

        // Set the correct checkbox after toggling mode
        AppearanceToggle.setCheckedMode(mode);
    },

    applyMode: (mode) => {
        const body = document.body;
        const logoImages = document.querySelectorAll('.gts-logo a img');

        // Apply light mode
        if (mode === 'light') {
            body.classList.remove('dark-mode');
            logoImages.forEach(img => {
                img.src = img.src.replace('-light', ''); // Remove -light from image filenames
            });
        }

        // Apply dark mode
        else if (mode === 'dark') {
            body.classList.add('dark-mode');
            logoImages.forEach(img => {
                if (img.classList.contains('desktop')) {
                    if (!img.src.includes('-light')) {
                        const extensionIndex = img.src.lastIndexOf('.');
                        img.src = img.src.slice(0, extensionIndex) + '-light' + img.src.slice(extensionIndex);
                    }
                }
            });
        }

        // Execute all registered callbacks
        AppearanceToggle.callbacks.forEach(callback => callback(mode));
    },

    setCheckedMode: (mode) => {
        // Uncheck all checkboxes first
        document.getElementById('light-mode-checkbox').checked = false;
        document.getElementById('dark-mode-checkbox').checked = false;
        document.getElementById('system-mode-checkbox').checked = false;

        // Check the appropriate checkbox based on the current mode
        if (mode === 'light') {
            document.getElementById('light-mode-checkbox').checked = true;
        } else if (mode === 'dark') {
            document.getElementById('dark-mode-checkbox').checked = true;
        } else if (mode === 'system') {
            document.getElementById('system-mode-checkbox').checked = true;
        }
    },

    addSystemModeListener: () => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // Listen for system appearance mode changes
        mediaQuery.addEventListener('change', (e) => {
            const savedAppearance = localStorage.getItem('gts-appearance');
            if (savedAppearance === 'system') {
                AppearanceToggle.applyMode(e.matches ? 'dark' : 'light');
            }
        });
    },

    registerCallback: (callback) => {
        if (typeof callback === 'function') {
            AppearanceToggle.callbacks.push(callback);
        }
    }
};


pageReady(() => {
    Modal.init();
    PageLoader.init();
    Button.init();
    Popover.init();
    Drawer.init();
    Tab.init();
    AppearanceToggle.init();
    MobileNav.init();
    NotificationSystem.init();
    CollapsedMenu.init();
    ForceResponsive.init();
    const tablesArry = document.querySelectorAll('.gts-dt-wrapper table');
    if (tablesArry.length) {
        tablesArry.forEach(table => {
            const tableApi = $(table).DataTable();
            if (tableApi) {
                tableApi.responsive.recalc();
            }
        })
    }
});

