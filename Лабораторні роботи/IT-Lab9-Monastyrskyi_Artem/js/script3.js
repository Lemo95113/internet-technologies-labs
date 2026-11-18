"use strict";
$(function () {
    // Делегування обробляє будь-який елемент і не створює серію alert через спливання.
    $(document).on("click", function (event) {
        var tag = event.target.tagName;
        alert(tag);
        console.log("Clicked tag:", tag);
    });
});
