"use strict";
function decypherPhrase(map, phrase) {
    if (map === null || typeof map !== "object")
        throw new TypeError("Очікується об’єкт відповідностей");
    var inverse = Object.create(null);
    Object.keys(map).forEach(function (key) {
        var encoded = map[key];
        if (
            Array.from(key).length !== 1 ||
            typeof encoded !== "string" ||
            Array.from(encoded).length !== 1
        ) {
            throw new TypeError("Відповідності мають містити по одному символу");
        }
        if (Object.prototype.hasOwnProperty.call(inverse, encoded))
            throw new Error("Неоднозначна карта шифрування");
        inverse[encoded] = key;
    });
    return cypherPhrase(inverse, phrase);
}
