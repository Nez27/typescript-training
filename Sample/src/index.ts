// Define variable
// let age: number = 20;
// // age = "12";

// console.log(age);

// Tuples
// let user: [number, string] = [1, "Mosh"];
// user.push(123);
// user.push(456);
// user.push("test");

// console.log(user);

// Enum
// enum Size {
//   Small = 1,
//   Medium,
//   Large,
// }
// let mySize: Size = Size.Medium;
// console.log(mySize);

// Functions
// function calculateTax(income: number, taxYear = 2022): number {
//   if (taxYear < 2022) return income * 1.2;
//   return income * 1.3;
// }

// console.log(calculateTax(10_000));

// Object
// let employee: {
//   readonly id: number;
//   name: string;
//   age: number;
// } = {
//   id: 1,
//   name: "Nezumi",
//   age: 23,
// };

// employee.id;

// // employee.id = 1

// console.log(employee);

// Type Alias

// type Employee = {
//   readonly id: number;
//   name: string;
//   retire: () => string;
// };

// let employee2: Employee = {
//   id: 1,
//   name: "Loi Phan",
//   retire: () => {
//     const date = new Date();
//     return date.toISOString();
//   },
// };

// console.log(employee2.retire());

// Union types
// function kgToLbs(weight: number | string): number {
//   // Narrowing
//   if (typeof weight === "number") return weight * 2.2;
//   else {
//     const index: number = weight.indexOf("kg");
//     const number: number = parseInt(weight.substring(0, index));

//     return number * 2.2;
//   }
// }

// console.log(kgToLbs(10));
// console.log(kgToLbs("10 kg"));

// Intersection Type
// type Person = {
//   name: string;
//   age: number;
// };

// type Employee = {
//   position: string;
//   experiment: number;
// };

// type Information = Person & Employee;

// let info: Information = {
//   name: "Nezumi",
//   age: 23,
//   position: "Intern",
//   experiment: 3,
// };

// console.log(info);

// Literal Types
// type Quantity = 50 | 100;
// let quantity: Quantity = 100;

// Nullable type
// function greet(name: string | null | undefined) {
//   if(name)
//     console.log(name.toUpperCase());
// }

// greet(undefined);

// Optional Chaining
// type Customer = {
//   birthday?: Date;
// };

// function getCustomer(id: number): Customer | null | undefined {
//   return id === 0 ? null : { birthday: new Date() };
// }

// let customer = getCustomer(1);

// console.log(customer?.birthday?.getDate);
