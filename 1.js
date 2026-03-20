const obj = {
  name: "chen",
  gender: "nan",
  age: 11,
  home: {
    boy: "keji",
    girl: "hua",
  },
};

console.log(Object.getOwnPropertyNames(obj));
Reflect.ownKeys(obj).forEach(key => {
    console.log(key, obj[key]);
});

