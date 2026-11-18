"use strict";
function guessingGame(io) {
    io = io || {
        confirm: confirm,
        prompt: prompt,
        log: console.log.bind(console),
        random: Math.random
    };
    if (!io.confirm("Чи бажаєте почати гру?")) {
        io.log("Сьогодні ви не виграли мільйон, а могли");
        return 0;
    }
    var total = 0;
    var maximum = 5;
    var multiplier = 1;
    while (true) {
        var secret = Math.floor(io.random() * (maximum + 1));
        var attempt = 0;
        var won = false;
        while (attempt < 3) {
            var raw = io.prompt(
                "Вгадайте ціле число від 0 до " +
                    maximum +
                    ". Спроба " +
                    (attempt + 1) +
                    "/3. Виграш: " +
                    total +
                    "$."
            );
            if (raw === null) {
                io.log("Дякуємо за гру, ваш виграш становить " + total + "$");
                return total;
            }
            var guess = Number(raw);
            if (
                String(raw).trim() === "" ||
                !Number.isInteger(guess) ||
                guess < 0 ||
                guess > maximum
            ) {
                io.log("Введіть ціле число в заданому діапазоні");
                continue;
            }
            if (guess === secret) {
                var prize = [10, 5, 2][attempt] * multiplier;
                total += prize;
                won = true;
                io.log(
                    "Ви вгадали! Приз: " + prize + "$. Загальний виграш: " + total + "$"
                );
                break;
            }
            attempt++;
        }
        if (!won) {
            io.log("Ваш виграш - 0$");
            total = 0;
            if (!io.confirm("Зіграти ще раз спочатку?")) return total;
            maximum = 5;
            multiplier = 1;
            continue;
        }
        if (!io.confirm("Продовжити гру?")) {
            io.log("Дякуємо за гру, ваш виграш становить " + total + "$");
            return total;
        }
        if (
            maximum > Number.MAX_SAFE_INTEGER / 2 ||
            multiplier > Number.MAX_SAFE_INTEGER / 30
        ) {
            io.log(
                "Досягнуто числової межі. Дякуємо за гру, ваш виграш становить " +
                    total +
                    "$"
            );
            return total;
        }
        maximum *= 2;
        multiplier *= 3;
    }
}

if (typeof document !== "undefined")
    document.getElementById("start").addEventListener("click", function () {
        guessingGame();
    });
