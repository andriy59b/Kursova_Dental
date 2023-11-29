'use strict';



/**
 * addEvent on element
 */

const addEventOnElem = function(elems, type, callback) {
    if (Array.isArray(elems)) {
        for (const elem of elems) {
            elem.addEventListener(type, callback);
        }
    } else {
        elems.addEventListener(type, callback);
    }
}




/**
 * navbar toggle
 */

const navbar = document.querySelector ("[data-navbar]");
const navbarLinks = document.querySelectorAll ("[data-nav-link]");
const navbarToggler = document.querySelector ("[data-nav-toggler]");

const toggleNav = function () {
    navbar.classList.toggle("active");
    navbarToggler.classList.toggle("active");
}

addEventOnElem(navbarToggler, "click", toggleNav);

const closeNav = function () {
    navbar.classList.remove("active");
    navbarToggler.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNav);



/**
 * header active
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
    if (window.scrollY >= 100) {
        header.classList.add("active");
    } else {
        header.classList.remove("active");

    }
});