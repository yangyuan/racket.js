/// <reference path="./private/index.ts" />

/**
 * The class to managing racket modules.
 */
class RacketLibraries {
    /**
     * Get a module with path.
     * @todo support path. 
     * 
     * @param path {string} path of the module
     * @returns {Array<Definition>} a list of Definition in the module
     */
    public static module (path:string): Array<Definition> {
        let definitions:Array<Definition> = [];

        RacketLibraries.bind(definitions, "+", new AddRoutine());
        RacketLibraries.bind(definitions, "-", new SubtractRoutine());
        RacketLibraries.bind(definitions, "*", new MultiplyRoutine());
        RacketLibraries.bind(definitions, "/", new DivideRoutine());
        RacketLibraries.bind(definitions, ">", new GreaterThanRoutine());
        RacketLibraries.bind(definitions, "<", new LessThanRoutine());
        RacketLibraries.bind(definitions, "=", new EqualsRoutine());

        new BaseModule().definitions().forEach(element => {
            RacketLibraries.bind(definitions, element[0], element[1]);
        });

        return definitions;
    }

    /**
     * Bind a routine to a list of Definition with a name.
     * 
     * @param definitions the list of Definition
     * @param name the routine name in the definitions
     * @param routine the routine instance
     */
    private static bind(definitions:Array<Definition>, name:string, routine:Routine):void {
        definitions.push(Syntax.createDefinition(name, Syntax.createRoutineExpression(routine)));
    }
}

/**
 * Routine for greater than operation.
 * @todo deal with errors.
 */
class GreaterThanRoutine implements Routine {
    /** @inheritdoc */
    public evaluate(parameters:Array<Value>):Value {
        let ret:boolean = true;
        let last:number = null;
        parameters.forEach(element => {
            let data = element as Data;
            if (ret == true) {
                if (last != null) {
                    if (last <= data.number()) {
                        ret = false;
                    }
                }
                last = data.number();
            }
        });
        return Syntax.createBooleanData(ret);
    }
}

/**
 * Routine for less than operation.
 * @todo deal with errors.
 */
class LessThanRoutine implements Routine {
    /** @inheritdoc */
    public evaluate(parameters:Array<Value>):Value {
        let ret:boolean = true;
        let last:number = null;
        parameters.forEach(element => {
            let data = element as Data;
            if (ret == true) {
                if (last != null) {
                    if (last >= data.number()) {
                        ret = false;
                    }
                }
                last = data.number();
            }
        });
        return Syntax.createBooleanData(ret);
    }
}

/**
 * Routine for equals operation.
 * @todo deal with errors.
 */
class EqualsRoutine implements Routine {
    /** @inheritdoc */
    public evaluate(parameters:Array<Value>):Value {
        let ret:boolean = true;
        let last:number = null;
        parameters.forEach(element => {
            let data = element as Data;
            if (ret == true) {
                if (last != null) {
                    if (last != data.number()) {
                        ret = false;
                    }
                }
                last = data.number();
            }
        });
        return Syntax.createBooleanData(ret);
    }
}

/**
 * Routine for add operation.
 * @todo deal with errors.
 */
class AddRoutine implements Routine {
    /** @inheritdoc */
    public evaluate(parameters:Array<Value>):Value {
        let ret:number = 0;
        parameters.forEach(element => {
            let data = element as Data;
            ret += data.number();
        });
        return Syntax.createNumberData(ret);
    }
}

/**
 * Routine for subtract operation.
 * @todo deal with errors.
 */
class SubtractRoutine implements Routine {
    /** @inheritdoc */
    public evaluate(parameters:Array<Value>):Value {
        let ret:number = (parameters[0] as Data).number()*2;
        parameters.forEach(element => {
            let data = element as Data;
            ret -= data.number();
        });
        return Syntax.createNumberData(ret);
    }
}

/**
 * Routine for multiply operation.
 * @todo deal with errors.
 */
class MultiplyRoutine implements Routine {
    /** @inheritdoc */
    public evaluate(parameters:Array<Value>):Value {
        let ret:number = 1;
        parameters.forEach(element => {
            let data = element as Data;
            ret *= data.number();
        });
        return Syntax.createNumberData(ret);
    }
}

/**
 * Routine for divide operation.
 * @todo deal with errors.
 */
class DivideRoutine implements Routine {
    /** @inheritdoc */
    public evaluate(parameters:Array<Value>):Value {
        let ret:number = (parameters[0] as Data).number()*(parameters[0] as Data).number();
        parameters.forEach(element => {
            let data = element as Data;
            ret /= data.number();
        });
        return Syntax.createNumberData(ret);
    }
}