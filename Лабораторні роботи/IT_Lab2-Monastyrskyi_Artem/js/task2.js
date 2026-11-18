"use strict";
// Офіційний курс НБУ на 19.11.2026. Знімок відповіді API — у data/.
var EXCHANGE_RATES = { date: "19.11.2026", USD: 45.202, EUR: 49.5717 };
function convertCurrencies(euros, dollars) {
    if (
        ![euros, dollars].every(function (x) {
            return Number.isFinite(x) && x >= 0;
        })
    ) {
        throw new RangeError("Суми мають бути скінченними невід’ємними числами");
    }
    var converted = {
        euroUah: euros * EXCHANGE_RATES.EUR,
        dollarUah: dollars * EXCHANGE_RATES.USD,
        dollarEur: (dollars * EXCHANGE_RATES.USD) / EXCHANGE_RATES.EUR
    };
    if (
        !Object.keys(converted).every(function (key) {
            return Number.isFinite(converted[key]);
        })
    ) {
        throw new RangeError("Завелика сума для перетворення");
    }
    return converted;
}
function runConverter() {
    var euroInput = prompt("Кількість євро");
    if (euroInput === null) {
        console.log("Введення скасовано");
        return;
    }
    var dollarInput = prompt("Кількість доларів США");
    if (dollarInput === null) {
        console.log("Введення скасовано");
        return;
    }
    try {
        if (!euroInput.trim() || !dollarInput.trim())
            throw new Error("Порожні значення не дозволені");
        var euros = Number(euroInput.replace(",", "."));
        var dollars = Number(dollarInput.replace(",", "."));
        var result = convertCurrencies(euros, dollars);
        var message =
            euros +
            " euros are equal " +
            result.euroUah.toFixed(2) +
            " UAH, " +
            dollars +
            " dollars are equal " +
            result.dollarUah.toFixed(2) +
            " UAH, " +
            dollars +
            " dollars are equal " +
            result.dollarEur.toFixed(2) +
            " euros.";
        console.log(
            "Курс НБУ на " +
                EXCHANGE_RATES.date +
                ": EUR=" +
                EXCHANGE_RATES.EUR +
                ", USD=" +
                EXCHANGE_RATES.USD
        );
        console.log(message);
        alert(message);
    } catch (error) {
        alert(error.message);
    }
}
if (typeof document !== "undefined")
    document.getElementById("start").addEventListener("click", runConverter);
