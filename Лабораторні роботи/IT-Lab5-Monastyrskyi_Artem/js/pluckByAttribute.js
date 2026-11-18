"use strict";
function pluckByAttribute(array, attribute) {
    return getTransformedArray(array, function (object) {
        return object[attribute];
    });
}
