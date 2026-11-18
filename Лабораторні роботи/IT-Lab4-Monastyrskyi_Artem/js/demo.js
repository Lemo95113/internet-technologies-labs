"use strict";
console.log("isBigger(5, -1) =", isBigger(5, -1));
console.log("isSmaller(5, -1) =", isSmaller(5, -1));
console.log("getMin(3, 0, -3) =", getMin(3, 0, -3));
console.log("getClosestToZero(9, 5, -4, -9) =", getClosestToZero(9, 5, -4, -9));
console.log("isPrime(17) =", isPrime(17));
console.log("isPrime(21) =", isPrime(21));
document.getElementById("start").addEventListener("click", function () {
    guessingGame();
});
