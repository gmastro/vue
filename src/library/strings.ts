interface String {
    formatUnicorn(): String;
}

String.prototype.formatUnicorn = function(): String {
    let str: String = this;
    if (arguments.length) {
        let t: string = typeof arguments[0];
        let key: string | symbol | number;
        let args = ("string" === t || "number" === t) ? Array.prototype.slice.call(arguments) : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};
