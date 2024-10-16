const MobileNav = {
    init: () => {
        const navigation = document.querySelector("#side-bar");

        if (navigation && window.innerWidth < 769) {
            MobileNav.bindMenuEvents();  // Bind events only once
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
        unreadNotifications.forEach(notification => {
            notification.classList.remove('unread');
        });
    }
};

const CollabsedMenu = {
    // Initialize the menu toggle functionality
    init: () => {
        // Attach the click event listener to #toggle-menu
        document.getElementById('toggle-menu').addEventListener('click', CollabsedMenu.toggle);
    },

    // Function to toggle the class on the body
    toggle: () => {
        document.body.classList.toggle('gts-menu-collapsed');
    }
};

const ForceResponsive = {
    init: () => {
        ForceResponsive.checkWidth(); // Check width on initialization
        window.addEventListener('resize', ForceResponsive.checkWidth); // Set up resize listener
    },
    checkWidth: () => {
        if (window.innerWidth < 1361) {
            ForceResponsive.forceCollapsed();
        } else {
            ForceResponsive.forceUncollapsed();
        }
    },
    forceCollapsed: () => {
        document.body.classList.add('gts-menu-collapsed');
    },
    forceUncollapsed: () => {
        document.body.classList.remove('gts-menu-collapsed');
    }
};

const AppearanceToggle = {
    init: () => {
        const savedAppearance = localStorage.getItem('gts-appearance');

        // If no saved appearance, set default to light mode
        if (!savedAppearance) {
            localStorage.setItem('gts-appearance', 'light');
            AppearanceToggle.applyMode('light');
        } else {
            // Apply the saved appearance (light, dark, or system)
            AppearanceToggle.applyMode(savedAppearance);
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
                img.src = img.src.replace('-dark', ''); // Remove -dark from image filenames
            });
        }

        // Apply dark mode
        else if (mode === 'dark') {
            body.classList.add('dark-mode');
            logoImages.forEach(img => {
                if (!img.src.includes('-dark')) {
                    const extensionIndex = img.src.lastIndexOf('.');
                    img.src = img.src.slice(0, extensionIndex) + '-dark' + img.src.slice(extensionIndex);
                }
            });
        }
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
    }
}

pageReady(() => {
    AppearanceToggle.init();
    MobileNav.init();
    NotificationSystem.init();
    CollabsedMenu.init();
    ForceResponsive.init();
});

