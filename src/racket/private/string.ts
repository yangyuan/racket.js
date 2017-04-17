/**
 * Routine for string? operation.
 * @todo deal with errors.
 */
class IsStringRoutine implements Routine {
    /** @inheritdoc */
    public evaluate(parameters:Array<Value>):Value {
        if (parameters.length != 1) {
            throw new RacketError("the expected number of arguments does not match the given number");
        }

        if (parameters[0].isData() && parameters[0].asData().isString()) {
            return Syntax.createBooleanData(true);
        }

        return Syntax.createBooleanData(false);
    }
}

/**
 * Routine for string-length operation.
 * @todo deal with errors.
 */
class StringLengthRoutine implements Routine {
    /** @inheritdoc */
    public evaluate(parameters:Array<Value>):Value {
        if (parameters.length != 1) {
            throw new RacketError("the expected number of arguments does not match the given number");
        }

        if (parameters[0].isData() && parameters[0].asData().isString()) {
            return Syntax.createNumberData(parameters[0].asData().value.length);
        }

        throw new RacketError("Expect a string value");
    }
}

/**
 * Routine for string-append operation.
 * @todo deal with errors.
 */
class StringAppendRoutine implements Routine {
    /** @inheritdoc */
    public evaluate(parameters:Array<Value>):Value {
        let value = "";

        parameters.forEach(element => {
            if (element.isData() && element.asData().isString()) {
                value += element.asData().value;
            } else {
                throw new RacketError("Expect a string value");
            }
        });

        
       return Syntax.createStringData(value);
    }
}

/**
 * Routine for substring operation.
 * @todo deal with errors.
 */
class SubstringRoutine implements Routine {
    /** @inheritdoc */
    public evaluate(parameters:Array<Value>):Value {
        if (parameters.length < 2 || parameters.length > 3) {
            throw new RacketError("the expected number of arguments does not match the given number");
        }

        if (!parameters[0].isData() || !parameters[0].asData().isString()) {
            throw new RacketError("Expect a string value");
        }

        let value = parameters[0].asData().value;

        if (!parameters[1].isData() || !parameters[1].asData().isNumber()) {
            throw new RacketError("Expect a number value");
        }

        let start = parameters[1].asData().value;
        let end = value.length;

        if (parameters.length == 3) {
            if (!parameters[2].isData() || !parameters[2].asData().isNumber()) {
                throw new RacketError("Expect a number value");
            }

            end = parameters[2].asData().value;
        }

        return Syntax.createStringData(value.substring(start, end));
    }
}

/**
 * Routine for string=? operation.
 * @todo deal with errors.
 */
class StringEqualsRoutine implements Routine {
    /** @inheritdoc */
    public evaluate(parameters:Array<Value>):Value {
        if (parameters.length <2) {
            throw new RacketError("the expected number of arguments does not match the given number");
        }

        if (!parameters[0].isData() && !parameters[0].asData().isString()) {
            throw new RacketError("Expect a string value");
        }
        
        let value = parameters[0].asData().value;

        for (let parameter of parameters) {
           if (parameter.isData() && parameter.asData().isString()) {
                if (value !== parameter.asData().value) {
                    return Syntax.createBooleanData(false);
                }
            } else {
                throw new RacketError("Expect a string value");
            }
        }

        return Syntax.createBooleanData(true);
    }
}