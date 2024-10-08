// script.js
function pageReady(callback) {
if (document.readyState !== "loading") {
    callback();
  } else document.addEventListener("DOMContentLoaded", callback);
} 

const Button = {
    init: () => {
      Button.rippleEffectMovement();
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
  
pageReady(() => {
    Button.init();
});