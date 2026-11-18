"use strict";
$(function () {
    $("#click-target").on("click", function () {
        $("<p>").text("This is a click Event").appendTo("body");
        console.log("This is a click Event");
    });
    $("#click-target").on("dblclick", function () {
        $("<p>").text("This is a double-click Event").appendTo("body");
        console.log("This is a double-click Event");
    });
});
