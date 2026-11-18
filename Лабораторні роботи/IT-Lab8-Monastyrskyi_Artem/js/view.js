"use strict";
// Результати залишаються у справжній консолі та дублюються на сторінці.
(function () {
    var original = console.log.bind(console);
    console.log = function () {
        original.apply(console, arguments);
        var output = document.getElementById("output");
        if (output) {
            var values = Array.prototype.map.call(arguments, function (value) {
                return typeof value === "string" ? value : JSON.stringify(value);
            });
            output.textContent += values.join(" ") + "\n";
        }
    };
})();
