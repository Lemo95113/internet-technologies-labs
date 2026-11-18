"use strict";
function nonEmpty(value, label) {
    if (typeof value !== "string" || value.trim() === "")
        throw new TypeError(label + ": потрібен непорожній рядок");
    return value.trim();
}
function Human(name, sex, age) {
    this.name = nonEmpty(name, "Ім’я");
    this.sex = nonEmpty(sex, "Стать");
    if (!Number.isInteger(age) || age < 0 || age > 130)
        throw new RangeError("Некоректний вік");
    this.age = age;
}
Human.prototype.sleep = function () {
    console.log("Zzzzzz");
    return "Zzzzzz";
};
Human.prototype.describe = function () {
    var text = "Ім’я: " + this.name + "; стать: " + this.sex + "; вік: " + this.age;
    console.log(text);
    return text;
};
function Student(name, sex, age, course, group) {
    Human.call(this, name, sex, age);
    if (!Number.isInteger(course) || course < 1 || course > 6)
        throw new RangeError("Курс має бути 1–6");
    this.course = course;
    this.group = nonEmpty(group, "Група");
}
Student.prototype = Object.create(Human.prototype);
Student.prototype.constructor = Student;
Student.prototype.goToUniversity = function () {
    console.log("I am going to university");
    return "I am going to university";
};
function Teacher(name, sex, age, academicTitle, experience, subject) {
    Human.call(this, name, sex, age);
    if (!Number.isInteger(experience) || experience < 0 || experience > age)
        throw new RangeError("Некоректний стаж");
    this.academicTitle = nonEmpty(academicTitle, "Вчене звання");
    this.experience = experience;
    this.subject = nonEmpty(subject, "Предмет");
}
Teacher.prototype = Object.create(Human.prototype);
Teacher.prototype.constructor = Teacher;
Teacher.prototype.describe = function () {
    var text =
        "Викладач: " +
        this.name +
        "; стаж: " +
        this.experience +
        "; предмет: " +
        this.subject;
    console.log(text);
    return text;
};
function demonstrateInheritance() {
    // Усі особи нижче — навчальні приклади, а не біографічні дані.
    var human = new Human("Олексій", "чоловіча", 30);
    var student = new Student("Андрій Петренко", "чоловіча", 20, 3, "КН-31");
    var teacher = new Teacher(
        "Олена Коваль",
        "жіноча",
        40,
        "доцент",
        15,
        "Інтернет-технології"
    );
    human.describe();
    human.sleep();
    student.describe();
    student.sleep();
    student.goToUniversity();
    teacher.describe();
    teacher.sleep();
    console.log("Student instanceof Human:", student instanceof Human);
    console.log("Teacher instanceof Human:", teacher instanceof Human);
    return { human: human, student: student, teacher: teacher };
}
if (typeof document !== "undefined") demonstrateInheritance();
