/// <reference path="./base.ts"/>
/// <reference path="./racket/index.ts"/>
/// <reference path="./interpreter/index.ts" />

/**
 * The main class which conatins some 
 */
class Racket {
    /**
     * 
     * @param code 
     * @returns {Array<any>}
     */
    public static execute(code:string):Array<Result> {
        let results:Array<Result> = [];
        try {
            let program = Parser.run(code);
            let values = Interpreter.run(program);
            values.forEach(element => {
                let result = new Result();
                result.value = element;
                results.push(result);
            })
        } catch (error) {
            let result = new Result();
            result.error = error.message;
            results.push(result);
        }

        return results;
    }
}

class Result {
    value:any;
    error:string;

    constructor() {
        this.value = null;
        this.error = null;
    }
}