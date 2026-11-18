"use strict";
function getMin() {
    if (arguments.length === 0) throw new RangeError("Передайте хоча б одне число");
    var minimum = Infinity;
    for (var i = 0; i < arguments.length; i++) {
        if (!Number.isFinite(arguments[i]))
            throw new TypeError("Очікуються скінченні числа");
        if (arguments[i] < minimum) minimum = arguments[i];
    }
    return minimum;
}
