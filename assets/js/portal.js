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

pageReady(() => {
    MobileNav.init();
    NotificationSystem.init();
});