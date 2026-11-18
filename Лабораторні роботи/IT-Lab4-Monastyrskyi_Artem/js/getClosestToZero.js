"use strict";
function getClosestToZero() {
    if (arguments.length === 0) throw new RangeError("Передайте хоча б одне число");
    var closest = arguments[0];
    for (var i = 0; i < arguments.length; i++) {
        if (!Number.isFinite(arguments[i]))
            throw new TypeError("Очікуються скінченні числа");
        if (Math.abs(arguments[i]) < Math.abs(closest)) closest = arguments[i];
    }
    return closest;
}
