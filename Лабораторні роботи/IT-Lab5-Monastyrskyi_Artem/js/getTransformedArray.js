"use strict";
function getTransformedArray(array, callback) {
    var result = [];
    forEach(array, function (value, index) {
        result.push(callback(value, index, array));
    });
    return result;
}
