"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const metadata = JSON.parse(fs.readFileSync(path.join(__dirname, "metadata.json"), "utf8"));
const labs = Object.fromEntries(Object.keys(metadata.folders).map(n => [n, path.join(root, "Лабораторні роботи", path.basename(metadata.folders[n]))]));
const checks = [];
function test(lab, label, run) {
    run(); checks.push({lab, label, passed: true});
}
function context(lab, files) {
    const logs = [];
    const ctx = vm.createContext({console: {log: (...args) => logs.push(args.join(" "))}});
    for (const file of files) vm.runInContext(fs.readFileSync(path.join(labs[lab], "js", file), "utf8"), ctx, {filename: file});
    ctx.logs = logs;
    return ctx;
}
function value(ctx, code) { return vm.runInContext(code, ctx); }
function plain(x) { return JSON.parse(JSON.stringify(x)); }
function near(a, b) { assert.ok(Math.abs(a - b) <= 1e-10 * Math.max(1, Math.abs(b)), `${a} ≈ ${b}`); }

for (let n = 1; n <= 9; n++) {
    test(n, "JavaScript синтаксично коректний", () => {
        for (const file of fs.readdirSync(path.join(labs[n], "js"))) {
            if (file.endsWith(".js")) new vm.Script(fs.readFileSync(path.join(labs[n], "js", file), "utf8"));
        }
    });
    test(n, "Локальні script та stylesheet існують", () => {
        for (const html of fs.readdirSync(labs[n]).filter(x => x.endsWith(".html"))) {
            const source = fs.readFileSync(path.join(labs[n], html), "utf8");
            for (const match of source.matchAll(/(?:src|href)="([^"#]+)"/g)) {
                if (!/^https?:/.test(match[1])) assert.ok(fs.existsSync(path.join(labs[n], match[1])), match[1]);
            }
        }
    });
}

const q = context(2, ["task1.js", "task2.js"]);
for (const [a,b,c,expected] of [[1,-3,2,[1,2]],[1,2,1,[-1]],[0,2,-4,[2]],[1,0,-4,[-2,2]]]) {
    test(2, `Рівняння (${a},${b},${c})`, () => assert.deepEqual(plain(q.solveQuadratic(a,b,c).roots).sort((x,y)=>x-y),expected));
}
test(2,"Від’ємний дискримінант",()=>assert.equal(q.solveQuadratic(1,0,1).type,"none"));
test(2,"Безліч розв’язків 0=0",()=>assert.equal(q.solveQuadratic(0,0,0).type,"infinite"));
test(2,"Несумісне рівняння 1=0",()=>assert.equal(q.solveQuadratic(0,0,1).type,"none"));
test(2,"Нескінченні коефіцієнти відхиляються",()=>assert.throws(()=>q.solveQuadratic(Infinity,1,1)));
test(2,"Стійке обчислення малого кореня",()=>near(q.solveQuadratic(1,1e8,1).roots[1],-1e-8));
test(2,"100 EUR за НБУ",()=>near(q.convertCurrencies(100,52).euroUah,4957.17));
test(2,"52 USD за НБУ",()=>near(q.convertCurrencies(100,52).dollarUah,2350.504));
test(2,"USD в EUR через крос-курс",()=>near(q.convertCurrencies(100,52).dollarEur,52*45.202/49.5717));
test(2,"Нульові суми",()=>assert.deepEqual(plain(q.convertCurrencies(0,0)),{euroUah:0,dollarUah:0,dollarEur:0}));
test(2,"Від’ємна сума відхиляється",()=>assert.throws(()=>q.convertCurrencies(-1,5)));
test(2,"NaN відхиляється",()=>assert.throws(()=>q.convertCurrencies(1,NaN)));
test(2,"Контролер prompt: три коефіцієнти та console",()=>{
    const inputs=["1","-3","2"];q.prompt=()=>inputs.shift();q.alert=()=>assert.fail();
    q.runQuadratic();assert.match(q.logs.at(-1),/має 2 розв/);
});
test(2,"Контролер валют: два prompt та alert",()=>{
    const inputs=["100","52"];let message="";q.prompt=()=>inputs.shift();q.alert=x=>{message=x;};
    q.runConverter();assert.match(message,/4957.17 UAH/);assert.match(message,/2350.50 UAH/);
});
test(2,"Скасування prompt не обчислює результат",()=>{
    q.prompt=()=>null;q.runQuadratic();assert.equal(q.logs.at(-1),"Введення скасовано");
});

const board = context(3,["task1.js"]);
test(3,"Шаховий візерунок 8×8 як у макеті",()=>assert.deepEqual(plain(board.printChessboard()),Array.from({length:8},(_,i)=>i%2 ? " # # # #" : "# # # # ")));
function play(lab, confirms, inputs, randoms) {
    const ctx=context(lab,[lab===3 ? "task2.js":"guessingGame.js"]);
    const messages=[]; let calls=0;
    const io={confirm:()=>{ if(++calls>40) throw Error("Нескінченний цикл"); if(!confirms.length) throw Error("Unexpected confirm"); return confirms.shift(); },
        prompt:()=>{ if(!inputs.length) throw Error("Unexpected prompt"); return inputs.shift(); },
        random:()=>{ if(!randoms.length) throw Error("Unexpected random"); return randoms.shift(); },log:x=>messages.push(x)};
    return {total:ctx.guessingGame(io),messages};
}
for (const lab of [3,4]) {
    test(lab,"Відмова від старту",()=>assert.match(play(lab,[false],[],[]).messages[0],/мільйон/));
    test(lab,"Перша спроба — 10",()=>assert.equal(play(lab,[true,false],["0"],[0]).total,10));
    test(lab,"Друга спроба — 5",()=>assert.equal(play(lab,[true,false],["1","0"],[0]).total,5));
    test(lab,"Третя спроба — 2",()=>assert.equal(play(lab,[true,false],["1","2","0"],[0]).total,2));
    test(lab,"Продовження: 10 + 30",()=>assert.equal(play(lab,[true,true,false],["0","10"],[0,.9999]).total,40));
    test(lab,"Програш скидає накопичений виграш",()=>assert.equal(play(lab,[true,true,false],["0","1","2","3"],[0,0]).total,0));
    test(lab,"Повторна гра починається спочатку",()=>assert.equal(play(lab,[true,true,false],["1","2","3","0"],[0,0]).total,10));
    test(lab,"Скасування prompt завершує гру",()=>assert.equal(play(lab,[true],[null],[0]).total,0));
    test(lab,"Невалідний ввід не витрачає спробу",()=>assert.equal(play(lab,[true,false],["oops","6","","0"],[0]).total,10));
}
const f=context(4,["isBigger.js","isSmaller.js","getMin.js","getClosestToZero.js","isPrime.js"]);
test(4,"isBigger та рівність",()=>{assert.equal(f.isBigger(5,-1),true);assert.equal(f.isBigger(2,2),false);});
test(4,"isSmaller та рівність",()=>{assert.equal(f.isSmaller(5,-1),false);assert.equal(f.isSmaller(2,2),false);});
test(4,"getMin для додатних і від’ємних",()=>assert.equal(f.getMin(3,0,-3),-3));
test(4,"getMin одного числа",()=>assert.equal(f.getMin(7),7));
test(4,"getClosestToZero з методички",()=>assert.equal(f.getClosestToZero(9,5,-4,-9),-4));
test(4,"За однакової відстані перший аргумент",()=>assert.equal(f.getClosestToZero(-2,2),-2));
test(4,"Порожній список відхиляється",()=>{assert.throws(()=>f.getMin());assert.throws(()=>f.getClosestToZero());});
test(4,"Нескінченні аргументи відхиляються",()=>assert.throws(()=>f.getMin(2,Infinity)));
test(4,"Прості та складені числа",()=>{for(const n of [2,3,17,97])assert.equal(f.isPrime(n),true);for(const n of [-7,0,1,4,21,2.5])assert.equal(f.isPrime(n),false);});

const arr=context(5,["forEach.js","getTransformedArray.js","pluckByAttribute.js","cypherPhrase.js","decypherPhrase.js","getTopNRichestNames.js"]);
test(5,"forEach викликає callback для всіх елементів",()=>{let got=[];arr.forEach([3,5,2],x=>got.push(x));assert.deepEqual(got,[3,5,2]);});
test(5,"forEach порожнього масиву",()=>arr.forEach([],()=>assert.fail()));
test(5,"Перетворення масиву",()=>assert.deepEqual(plain(arr.getTransformedArray([1,7,20],x=>x+1)),[2,8,21]));
test(5,"Вхідний масив не змінюється",()=>{const a=[1,2];arr.getTransformedArray(a,x=>x*2);assert.deepEqual(a,[1,2]);});
test(5,"Вибір властивостей",()=>assert.deepEqual(plain(arr.pluckByAttribute([{name:"George"},{name:"Barako"}],"name")),["George","Barako"]));
test(5,"Шифрування з методички",()=>assert.equal(arr.cypherPhrase({a:"o",c:"d",t:"g"},"kitty cat"),"kiggy dog"));
test(5,"Розшифрування з методички",()=>assert.equal(arr.decypherPhrase({a:"o",c:"d",t:"g"},"kiggy dog"),"kitty cat"));
test(5,"Порожня фраза",()=>assert.equal(arr.cypherPhrase({},""),""));
test(5,"Unicode символи",()=>assert.equal(arr.cypherPhrase({"я":"ю"},"моя"),"мою"));
test(5,"Неоднозначний зворотний словник відхиляється",()=>assert.throws(()=>arr.decypherPhrase({a:"x",b:"x"},"x")));
test(5,"Top N не мутує вхід",()=>{const a=[{name:"A",balance:1},{name:"B",balance:3},{name:"C",balance:2}];assert.deepEqual(plain(arr.getTopNRichestNames(a,2)),["B","C"]);assert.equal(a[0].name,"A");});
test(5,"Top 0",()=>assert.deepEqual(plain(arr.getTopNRichestNames([],0)),[]));

const casino=context(6,["script.js"]);
test(6,"Початковий рівномірний розподіл",()=>assert.deepEqual(plain(value(casino,"new Casino(3,900).getMachines().map(function(x){return x.getMoney();})")),[300,300,300]));
test(6,"Кількість і загальні гроші",()=>{const c=new casino.Casino(3,900);assert.equal(c.getMachineCount(),3);near(c.getTotalMoney(),900);});
test(6,"Дробова сума зберігається",()=>near(new casino.Casino(3,100).getTotalMoney(),100));
test(6,"takeMoney та putMoney",()=>{const s=new casino.SlotMachine(100);assert.equal(s.takeMoney(30),30);assert.equal(s.putMoney(20),90);});
test(6,"Заборона перевитрати без зміни стану",()=>{const s=new casino.SlotMachine(10);assert.throws(()=>s.takeMoney(11));assert.equal(s.getMoney(),10);});
test(6,"Від’ємні суми відхиляються",()=>{assert.throws(()=>new casino.SlotMachine(-1));assert.throws(()=>new casino.Casino(2,-1));});
test(6,"Неприпустима кількість машин",()=>{for(const n of [0,-1,1.5])assert.throws(()=>new casino.Casino(n,100));});
test(6,"ID унікальні та незмінні",()=>{const a=new casino.SlotMachine(0),b=new casino.SlotMachine(0);assert.notEqual(a.id,b.id);assert.throws(()=>{a.id=999;});});
test(6,"Додання машини з коштами",()=>{const c=new casino.Casino(2,100);c.addSlotMachine(50);assert.equal(c.getMachineCount(),3);near(c.getTotalMoney(),150);});
test(6,"Видалення зберігає суму і розподіляє баланс",()=>{const c=new casino.Casino(3,900),id=c.getMachines()[0].id;c.removeSlotMachine(id);near(c.getTotalMoney(),900);assert.deepEqual(plain(c.getMachines().map(x=>x.getMoney())),[450,450]);});
test(6,"Видалена машина має нульовий баланс",()=>{const c=new casino.Casino(2,100);const removed=c.removeSlotMachine(c.getMachines()[0].id);assert.equal(removed.getMoney(),0);});
test(6,"Остання машина захищена",()=>assert.throws(()=>new casino.Casino(1,10).removeSlotMachine(1)));
test(6,"Відсутній ID не змінює стан",()=>{const c=new casino.Casino(2,100);assert.throws(()=>c.removeSlotMachine(-1));assert.equal(c.getMachineCount(),2);});
test(6,"Зовнішня зміна копії масиву не впливає на казино",()=>{const c=new casino.Casino(2,100);c.getMachines().pop();assert.equal(c.getMachineCount(),2);});

const inh=context(7,["script.js"]);
test(7,"Human.describe містить ім’я, стать і вік",()=>{const s=new inh.Human("A","M",20).describe();assert.match(s,/A/);assert.match(s,/M/);assert.match(s,/20/);});
test(7,"Human.sleep",()=>assert.equal(new inh.Human("A","M",20).sleep(),"Zzzzzz"));
test(7,"Student наслідує Human",()=>assert.ok(new inh.Student("A","M",20,3,"КН-31") instanceof inh.Human));
test(7,"Student методи та поля",()=>{const s=new inh.Student("A","M",20,3,"КН-31");assert.equal(s.course,3);assert.equal(s.group,"КН-31");assert.equal(s.goToUniversity(),"I am going to university");assert.equal(s.sleep(),"Zzzzzz");});
test(7,"Teacher наслідує та перевизначає describe",()=>{const t=new inh.Teacher("T","F",40,"доцент",15,"IT");assert.ok(t instanceof inh.Human);assert.match(t.describe(),/15/);assert.match(t.describe(),/IT/);assert.notEqual(inh.Teacher.prototype.describe,inh.Human.prototype.describe);});
test(7,"Збережено constructor",()=>{assert.equal(inh.Student.prototype.constructor,inh.Student);assert.equal(inh.Teacher.prototype.constructor,inh.Teacher);});
test(7,"Некоректний вік та курс",()=>{assert.throws(()=>new inh.Human("A","M",-1));assert.throws(()=>new inh.Student("A","M",20,0,"КН"));});
test(7,"Порожні рядки та некоректний стаж",()=>{assert.throws(()=>new inh.Human("","M",20));assert.throws(()=>new inh.Teacher("A","F",20,"доцент",25,"IT"));});

const es=context(8,["script.js"]);
test(8,"Деструктуризація та шаблонний рядок",()=>assert.equal(es.getFullName({firstName:"Ada",lastName:"Lovelace"}),"Ada Lovelace"));
test(8,"Параметр за замовчуванням",()=>assert.equal(es.handleThings().name,"Some name"));
test(8,"Поведінка handleThings збережена",()=>{const opts={name:"Old",other:1};assert.equal(es.handleThings(opts),opts);assert.equal(opts.name,"Some name");assert.equal(opts.other,1);});
test(8,"Окремий об’єкт для кожного виклику без аргументів",()=>assert.notEqual(es.handleThings(),es.handleThings()));
test(8,"Queue FIFO",()=>assert.deepEqual(plain(value(es,"(()=>{const q=new Queue([10,20,30]);return [q.pop(),q.pop(),q.pop()];})()")),[10,20,30]));
test(8,"Порожня Queue повертає undefined",()=>assert.equal(value(es,"new Queue().pop()"),undefined));
test(8,"Queue копіює початковий масив",()=>assert.deepEqual(plain(value(es,"(()=>{const a=[1,2];const q=new Queue(a);q.pop();return a;})()")),[1,2]));

for(const n of [1,9]) test(n,"Локальна бібліотека jQuery",()=>assert.match(fs.readFileSync(path.join(labs[n],"vendor/jquery.min.js"),"utf8"),/jQuery v3\.7\.1/));
test(1,"Справжня сітка та компоненти Bootstrap",()=>{const h=fs.readFileSync(path.join(labs[1],"index.html"),"utf8");assert.match(h,/col-xs-4/);assert.match(h,/table-striped/);assert.match(h,/modal fade/);assert.match(h,/btn-group-justified/);});

const totals={};
for(const check of checks) totals[check.lab]=(totals[check.lab]||0)+1;
for(let n=1;n<=9;n++) {
    fs.mkdirSync(path.join(labs[n],"results"),{recursive:true});
    fs.writeFileSync(path.join(labs[n],"results/tests.json"),JSON.stringify(checks.filter(x=>x.lab===n),null,2));
}
fs.writeFileSync(path.join(__dirname,"unit-results.json"),JSON.stringify({passed:checks.length,totals,checks},null,2));
console.log(JSON.stringify({passed:checks.length,totals},null,2));
