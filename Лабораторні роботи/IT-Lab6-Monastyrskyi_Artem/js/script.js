"use strict";
var nextMachineId = 1;
function validMoney(amount) {
    if (!Number.isFinite(amount) || amount < 0)
        throw new RangeError("Сума має бути скінченною та невід’ємною");
}
function SlotMachine(initialMoney) {
    validMoney(initialMoney);
    var money = initialMoney;
    Object.defineProperty(this, "id", { value: nextMachineId++, enumerable: true });
    this.getMoney = function () {
        return money;
    };
    this.putMoney = function (amount) {
        validMoney(amount);
        if (!Number.isFinite(money + amount)) throw new RangeError("Переповнення суми");
        money += amount;
        return money;
    };
    this.takeMoney = function (amount) {
        validMoney(amount);
        if (amount > money) throw new RangeError("Недостатньо грошей у машині");
        money -= amount;
        return amount;
    };
}
function Casino(machineCount, initialMoney) {
    if (!Number.isSafeInteger(machineCount) || machineCount < 1)
        throw new RangeError("Потрібна хоча б одна машина");
    validMoney(initialMoney);
    var machines = [];
    for (var i = 0; i < machineCount; i++)
        machines.push(new SlotMachine(initialMoney / machineCount));
    this.getTotalMoney = function () {
        return machines.reduce(function (sum, machine) {
            return sum + machine.getMoney();
        }, 0);
    };
    this.getMachineCount = function () {
        return machines.length;
    };
    this.getMachines = function () {
        return machines.slice();
    };
    this.addSlotMachine = function (money) {
        if (money === undefined) money = 0;
        validMoney(money);
        if (!Number.isFinite(this.getTotalMoney() + money))
            throw new RangeError("Переповнення суми казино");
        var machine = new SlotMachine(money);
        machines.push(machine);
        return machine;
    };
    this.removeSlotMachine = function (id) {
        if (machines.length === 1) throw new Error("Не можна видалити останню машину");
        var index = machines.findIndex(function (machine) {
            return machine.id === id;
        });
        if (index < 0) throw new Error("Машину не знайдено");
        var removed = machines[index];
        var balance = removed.getMoney();
        var share = balance / (machines.length - 1);
        machines.forEach(function (machine) {
            if (machine !== removed && !Number.isFinite(machine.getMoney() + share))
                throw new RangeError("Переповнення суми");
        });
        machines.splice(index, 1);
        removed.takeMoney(balance);
        machines.forEach(function (machine) {
            machine.putMoney(share);
        });
        return removed;
    };
}
function demonstrateCasino() {
    var casino = new Casino(3, 900);
    console.log(
        "Створено казино:",
        casino.getMachineCount(),
        "машини; гроші:",
        casino.getTotalMoney()
    );
    console.log(
        "Початкові баланси:",
        casino.getMachines().map(function (machine) {
            return machine.getMoney();
        })
    );
    var machine = casino.getMachines()[0];
    console.log("SlotMachine id=" + machine.id + ":", machine.getMoney());
    machine.takeMoney(50);
    console.log("Взято 50; баланс:", machine.getMoney());
    machine.putMoney(20);
    console.log("Покладено 20; баланс:", machine.getMoney());
    var added = casino.addSlotMachine(90);
    console.log(
        "Додано машину id=" + added.id + "; кількість:",
        casino.getMachineCount(),
        "; всього:",
        casino.getTotalMoney()
    );
    casino.removeSlotMachine(added.id);
    console.log(
        "Після видалення: кількість=",
        casino.getMachineCount(),
        "; всього=",
        casino.getTotalMoney()
    );
    console.log(
        "Баланси після розподілу:",
        casino.getMachines().map(function (item) {
            return item.getMoney();
        })
    );
    try {
        machine.takeMoney(100000);
    } catch (error) {
        console.log("Перевірка захисту:", error.message);
    }
    return casino;
}
if (typeof document !== "undefined") demonstrateCasino();
