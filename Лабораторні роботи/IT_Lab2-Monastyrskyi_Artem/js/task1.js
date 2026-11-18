"use strict";
function solveQuadratic(a, b, c) {
    if (![a, b, c].every(Number.isFinite))
        throw new TypeError("Коефіцієнти мають бути скінченними числами");
    if (a === 0) {
        if (b !== 0) return { type: "linear", roots: [-c / b] };
        return { type: c === 0 ? "infinite" : "none", roots: [] };
    }
    var discriminant = b * b - 4 * a * c;
    if (!Number.isFinite(discriminant)) throw new RangeError("Завеликі коефіцієнти");
    if (discriminant < 0) return { type: "none", roots: [] };
    if (discriminant === 0) return { type: "double", roots: [-b / (2 * a)] };
    // Стійка формула зменшує втрату точності при відніманні близьких чисел.
    var q = -0.5 * (b + (b >= 0 ? 1 : -1) * Math.sqrt(discriminant));
    return { type: "two", roots: [q / a, c / q] };
}
function runQuadratic() {
    var values = [];
    for (var i = 0; i < 3; i++) {
        var raw = prompt("Введіть коефіцієнт " + ["a", "b", "c"][i]);
        if (raw === null) {
            console.log("Введення скасовано");
            return;
        }
        var value = Number(raw.replace(",", "."));
        if (raw.trim() === "" || !Number.isFinite(value)) {
            alert("Введіть коректне число");
            return;
        }
        values.push(value);
    }
    try {
        var result = solveQuadratic.apply(null, values);
        var equation =
            "Рівняння " + values[0] + "x² + (" + values[1] + ")x + (" + values[2] + ") = 0";
        if (result.type === "two")
            console.log(
                equation +
                    " має 2 розв’язки: x1 = " +
                    result.roots[0] +
                    ", x2 = " +
                    result.roots[1]
            );
        else if (result.roots.length === 1)
            console.log(equation + " має 1 розв’язок: x = " + result.roots[0]);
        else
            console.log(
                equation +
                    (result.type === "infinite"
                        ? " має безліч розв’язків"
                        : " не має дійсних розв’язків")
            );
    } catch (error) {
        alert(error.message);
    }
}
if (typeof document !== "undefined")
    document.getElementById("start").addEventListener("click", runQuadratic);
