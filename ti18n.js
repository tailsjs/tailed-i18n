const fs = require("fs");

class Tailedi18n{
    /**
     * tailed-i18n
     * @param { JSON } params 
     * @param { String } params.list Path to all translations.
     * @param { Boolean } params.disableWarnings? Disable warnings? (default: false)
     * @param { String } params.default Default language (en.json, etc.)
     */
    constructor(params){
        if(!params.list)throw new Error("No list included!")
        if(!fs.existsSync(params.list))throw new Error("Folder doesn't exist!")
        if(!params.default && !params.disableWarnings)console.log("You forgot to put default language! Are you sure?")

        this.lang = {};
        this.locales = {};
        this.default = params.default;
        this.disableWarnings = params.disableWarnings;
        this.setLanguage = "";

        for(let i of fs.readdirSync(params.list))
            this.locales[i.split(".")[0]] = JSON.parse(fs.readFileSync(params.list + i).toString())

        if(!this.locales[this.default] && this.default && !params.disableWarnings)console.log(`Default language that you passed to the constructor (${this.default}) doesn't exist.`)
        
    }

    /**
     * Selecting language.
     * @param { String } lang Your language (from Tailedi18n.list path, en.json, etc.)
     */
    select(lang){
        this.lang = this.locales[!this.locales[lang] ? this.default : lang]
        this.setLanguage = lang
    }

    /**
     * Get a string from json
     * @param { String } string String. Example: Texts.HelloWorld from {"Texts" : {"HelloWorld": "Hello world!"}} 
     * @returns String you specified in the translation file.
     */
    get(string){
        if(!this.lang)throw new Error("You forgot to choose language! Use Tailedi18n.select(lang) function.")
        let args = string.split(".")
        let output = null
        for(let i of args){
            output = output == null ? this.lang[i] : output[i]
            if(typeof output == "string")break
        }
        if(!output && this.default) output = this.getDefault(args)
        
        return output
    }

    getDefault(args){
        let output = null
        for(let i of args){
            output = output == null ? this.locales[this.default][i] : output[i]
            if(typeof output == "string")break
        }
        if(!this.disableWarnings)
            if(!output)console.log(`String not found in both languages. Maybe you filled strings incorrectly?`)
            else console.log(`String wasn't found in ${this.setLanguage}.json strings.`)
        return output
    }
    /**
     * Converts the specified number in its case.
     * @param { Number } number Number to be converted
     * @param { String } args String. Translation file should include 3 elements for singular and plural numbers (Example: Decls.Seconds is ["second", "seconds", "seconds"] for 1, 2, 10)
     * @param { Boolean } includeNumbers? Add a number to the return string? Default: true
     * @returns { String } A string with a declined case for a number
     */

    declNumb(number, args, includeNumbers = true){
        let firstNumber = number
        number = Math.abs(number) % 100;
        let lastNum = number % 10;
        args = this.get(args)
        if(typeof args != "object")throw new Error("Provided string must be an array!")
        let output = args[2]
        
        if(number > 10 && number < 20)output = args[2]
        else if(lastNum > 1 && lastNum < 5)output = args[1]
        else if(lastNum == 1)output = args[0]
        return includeNumbers ? `${firstNumber} ${output}` : output
    }

    /**
     * Converts UNIX time into an array with strings.
     * @param { EpochTimeStamp } unix UNIX time.  
     * @param { Array } strings Array with strings. Example: [ "Decls.Days", "Decls.Hours", "Decls.Minutes", "Decls.Seconds", "Decls.MS" ]
     * @returns { Array } An array with a converted date.
     */
    declTime(unix, strings){
        let milliseconds = unix % 1000,
            seconds = Math.floor((unix / 1000) % 60),
            minutes = Math.floor((unix / 60000) % 60),
            hours = Math.floor((unix / 3600000) % 24),
            days = Math.floor(unix / 86400000)
        
        let helperTimers = [ days, hours, minutes, seconds, milliseconds ]
        let output = []

        for(let i = 0; i < strings.length; i++)
            output.push(this.declNumb(helperTimers[i], strings[i]))

        return output
    }
}


module.exports = Tailedi18n