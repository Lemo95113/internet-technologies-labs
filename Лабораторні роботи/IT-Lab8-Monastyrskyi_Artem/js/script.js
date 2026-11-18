"use strict";
function getFullName({ firstName, lastName }) {
    return `${firstName} ${lastName}`;
}
function handleThings(opts = {}) {
    opts.name = "Some name";
    return opts;
}
class Queue {
    constructor(contents = []) {
        this.queue = [...contents];
    }
    pop() {
        return this.queue.shift();
    }
}
function demonstrateES2015() {
    console.log(
        "getFullName:",
        getFullName({ firstName: "Артем", lastName: "Монастирський" })
    );
    console.log("handleThings():", handleThings());
    const options = { name: "Old name", enabled: true };
    console.log("handleThings(options):", handleThings(options));
    console.log("Збережено той самий об’єкт:", handleThings(options) === options);
    const original = [10, 20, 30];
    const queue = new Queue(original);
    console.log("Queue.pop():", queue.pop(), queue.pop(), queue.pop());
    console.log("Порожня черга:", queue.pop() === undefined);
    console.log("Початковий масив не змінено:", original);
    console.log("new Queue().pop():", new Queue().pop() === undefined);
}
if (typeof document !== "undefined") demonstrateES2015();
