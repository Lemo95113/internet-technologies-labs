"use strict";
function printChessboard() {
    var sh = "#";
    var sp = " ";
    var row = 0;
    var lines = [];
    while (row < 8) {
        var column = 0;
        var line = "";
        while (column < 8) {
            line += (row + column) % 2 === 0 ? sh : sp;
            column++;
        }
        console.log(line);
        lines.push(line);
        row++;
    }
    return lines;
}
if (typeof document !== "undefined") printChessboard();
