"use strict";
$(function () {
    $("#menu-button").on("click", function () {
        var open = $("#fruit-menu").prop("hidden");
        $("#fruit-menu").prop("hidden", !open);
        $(this).attr("aria-expanded", String(open));
    });
    $(".thumbnail-button").on("click", function () {
        $(".thumbnail-button").removeClass("active").attr("aria-pressed", "false");
        $(this).addClass("active").attr("aria-pressed", "true");
        $("#main-photo").attr("src", $(this).find("img").attr("src"));
    });
    $(".tabs button").on("click", function () {
        $(".tabs button").removeClass("active").attr("aria-pressed", "false");
        $(this).addClass("active").attr("aria-pressed", "true");
        $(".fruit-panel").prop("hidden", true);
        $("#" + $(this).data("panel")).prop("hidden", false);
    });
    $("#fruit-form").on("submit", function (event) {
        event.preventDefault();
        var name = $("#new-fruit").val().trim();
        if (!name) return;
        $("#fruit-name").text(name);
        $(".tabs button[data-panel='general-panel']").trigger("click");
        $("#add-fruit").modal("hide");
        this.reset();
    });
    $("#reset-fruit").on("click", function () {
        $("#fruit-name").text("Apricot, raw");
        $(".tabs button[data-panel='general-panel']").trigger("click");
    });
});
