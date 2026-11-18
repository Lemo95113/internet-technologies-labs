"use strict";
// Додаткова функція з переліку файлів методички: [{name, balance}], N.
function getTopNRichestNames(people, count) {
    if (!Array.isArray(people) || !Number.isInteger(count) || count < 0)
        throw new TypeError("Очікуються масив та невід’ємне ціле N");
    people.forEach(function (person) {
        if (!person || typeof person.name !== "string" || !Number.isFinite(person.balance))
            throw new TypeError("Запис повинен мати name і числовий balance");
    });
    return people
        .slice()
        .sort(function (a, b) {
            return b.balance - a.balance;
        })
        .slice(0, count)
        .map(function (person) {
            return person.name;
        });
}
