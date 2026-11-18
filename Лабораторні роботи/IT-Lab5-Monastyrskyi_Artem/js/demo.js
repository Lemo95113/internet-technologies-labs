"use strict";
console.log("forEach([3, 5, 2]):");
forEach([3, 5, 2], function (value) {
    console.log(value);
});
console.log(
    "getTransformedArray:",
    getTransformedArray([1, 7, 20], function (value) {
        return value + 1;
    })
);
console.log(
    "pluckByAttribute:",
    pluckByAttribute(
        [
            { name: "George", surname: "Kush" },
            { name: "Barako", surname: "Obaame" }
        ],
        "name"
    )
);
var charactersMap = { a: "o", c: "d", t: "g" };
console.log("cypherPhrase:", cypherPhrase(charactersMap, "kitty cat"));
console.log("decypherPhrase:", decypherPhrase(charactersMap, "kiggy dog"));
console.log(
    "getTopNRichestNames:",
    getTopNRichestNames(
        [
            { name: "Ірина", balance: 120 },
            { name: "Олег", balance: 300 },
            { name: "Анна", balance: 250 }
        ],
        2
    )
);
