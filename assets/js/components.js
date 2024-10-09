// compoennets.js

function domReady(callback) {
    if (document.readyState !== "loading") {
      callback();
    } else document.addEventListener("DOMContentLoaded", callback);
  }

  
const Components = {
    init: () => {
      Components.nav();
    },
  
    nav: () => {
      console.log('Initializing GTS Sidebar');
  
      class GtsSidebar extends HTMLElement {
        constructor() {
          super();
        }
  
        connectedCallback() {
          // Fetch the template from the external file
          fetch('../../components/navigation.html')
            .then(response => response.text())
            .then(html => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, 'text/html');
              const template = doc.getElementById('gts-sidebar-template');
              if (template) {
                const templateContent = template.content.cloneNode(true);
                this.appendChild(templateContent);
              } else {
                console.error('Component not found');
              }
            })
            .catch(err => console.error('Failed to load template:', err));
        }
      }
  
      // Define the custom element
      customElements.define('gts-sidebar', GtsSidebar);
  
      // Insert the component into the page after DOM is fully loaded
      // document.addEventListener('DOMContentLoaded', () => {
        const sidebar = document.getElementById('side-bar');
        if (sidebar) {
          console.log('Injecting Sidebar Component');
          sidebar.innerHTML = '<gts-sidebar></gts-sidebar>';  // Now the element is defined before insertion
        } else {
          console.warn('No sidebar element found');
        }
      // });
    }
};
  

domReady(() => {
    Components.init();
});