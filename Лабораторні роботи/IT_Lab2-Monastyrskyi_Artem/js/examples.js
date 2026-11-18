"use strict";
document.getElementById("example").addEventListener("click", function () {
    if (typeof solveQuadratic === "function") {
        var result = solveQuadratic(1, -3, 2);
        console.log("Приклад з коефіцієнтами a=1, b=-3, c=2");
        console.log(
            "Рівняння 1x² + (-3)x + 2 = 0 має 2 розв’язки: x1 = " +
                result.roots[0] +
                ", x2 = " +
                result.roots[1]
        );
    } else {
        var result = convertCurrencies(100, 52);
        console.log(
            "Курс НБУ на " +
                EXCHANGE_RATES.date +
                ": EUR=" +
                EXCHANGE_RATES.EUR +
                ", USD=" +
                EXCHANGE_RATES.USD
        );
        console.log(
            "100 euros are equal " +
                result.euroUah.toFixed(2) +
                " UAH, 52 dollars are equal " +
                result.dollarUah.toFixed(2) +
                " UAH, 52 dollars are equal " +
                result.dollarEur.toFixed(2) +
                " euros."
        );
    }
});
