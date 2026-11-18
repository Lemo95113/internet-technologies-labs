"use strict";
function cypherPhrase(map, phrase) {
    if (map === null || typeof map !== "object" || typeof phrase !== "string")
        throw new TypeError("Очікуються об’єкт та рядок");
    return Array.from(phrase)
        .map(function (character) {
            return Object.prototype.hasOwnProperty.call(map, character)
                ? map[character]
                : character;
        })
        .join("");
}
