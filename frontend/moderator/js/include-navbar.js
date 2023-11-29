fetch('/moderator/shared/nav-bar.html')
    .then(res => res.text())
    .then(text => {
        let oldelem = document.querySelector("script#include-navbar");
        let newelem = document.createElement("div");
        newelem.innerHTML = text;
        oldelem.parentNode.replaceChild(newelem,oldelem);

        // Add active class to the current button (highlight it)
        let location = window.location;
        if (location.pathname.includes("channels"))
        {
            $("nav .channels").addClass("active");
        }
        else if (location.pathname.includes("users"))
        {
            $("nav .users").addClass("active");
        }
        else if (location.pathname.includes("squeal"))
        {
            $("nav .squeal").addClass("active");
        }
    })