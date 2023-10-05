fetch('/moderator/shared/nav-bar.html')
    .then(res => res.text())
    .then(text => {
        let oldelem = document.querySelector("script#include-navbar");
        let newelem = document.createElement("div");
        newelem.innerHTML = text;
        oldelem.parentNode.replaceChild(newelem,oldelem);
    })