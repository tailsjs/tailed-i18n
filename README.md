# tailed-i18n
Strings translation module

## Example
```js
const Ti18n = require("./ti18n.js")

const strings = new Ti18n({
    list: "./strings/", // Where translations is stored.
    disableWarnings: false, // In case if you don't want get warnings. default: false
    default: "en" // Default language (en.json)
})

strings.select("ru");

console.log(strings.get("Texts.HelloWorld")) // Get string from {"Texts" : {"HelloWorld": "Привет мир!"}} (output: Привет мир!)

strings.select("en")

console.log(strings.get("Texts.HelloWorld")) // Get string from {"Texts" : {"HelloWorld": "Hello world!"}} (output: Hello world!)

strings.select("qwerty") // If translate doen't exist, it gonna switch to default one.

console.log(strings.get("Texts.HelloWorld")) // (output: Hello world!)

console.log(strings.get("Texts.ThisLineDoesntExist")) // (output: undefined, warning in console) in case if string in default, outputs: "This line exists only in default strings!" and warning.

console.log(strings.declNumb(1, "Decls.Seconds")) // (output: 1 second)
console.log(strings.declNumb(2, "Decls.Seconds")) // (output: 2 seconds)

console.log(strings.declTime(new Date(), [
    "Decls.Days",
    "Decls.Hours",
    "Decls.Minutes",
    "Decls.Seconds",
    "Decls.MS"
])) // output: [ '19190 days', '17 hours', '23 minutes', '30 seconds', '615 milliseconds' ] (supports only days, hours, minutes, seconds, milliseconds.)

```