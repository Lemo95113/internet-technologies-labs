"use strict";
function forEach(array, callback) {
    if (!Array.isArray(array) || typeof callback !== "function")
        throw new TypeError("Очікуються масив і функція");
    for (var i = 0; i < array.length; i++) {
        if (i in array) callback(array[i], i, array);
    }
}
