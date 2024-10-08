"use strict";

// script.js
function pageReady(callback) {
  if (document.readyState !== "loading") {
    callback();
  } else document.addEventListener("DOMContentLoaded", callback);
}

var Button = {
  init: function init() {
    Button.rippleEffectMovement();
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
pageReady(function () {
  Button.init();
});