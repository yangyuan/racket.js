/**
 * The interface for the result of evaluating an expression.
 * It can be procedure or data.
 */
interface Value {
    /**
     * Get the value as Procedure.
     * 
     * @returns {Procedure} the value as Procedure
     */
    procedure():Procedure;

    /**
     * Get the value as Data.
     * 
     * @returns {Data} the value as Data
     */
    asData():Data;

    /**
     * Get the value indicates if the value is Data.
     * 
     * @returns {boolean} iff the value is Data
     */
    isData():boolean;
}

/**
 * The interface for the result of evaluating a lambda expression or routine expression.
 */
interface Procedure extends Value {
    /**
     * Apply the procedure with inputs.
     * 
     * @param inputs {Array<Value>} the inputs to apply the procedure
     * @returns {Value} the apply result 
     */
    apply(inputs:Array<Value>):Value;
}

/**
 * The interface for a constant data.
 */
interface Data extends Value {
    /**
     * the data value as original type.
     */
    readonly value:any;

    /**
     * Get the data as number.
     * 
     * @returns {number} the data as number
     */
    number():number;

    /**
     * Get the data as string.
     * 
     * @returns {string} the data as string
     */
    string():string;

    /**
     * Get the data as boolean.
     * 
     * @returns {boolean} the data as boolean
     */
    boolean():boolean;
    

    /**
     *  Get the value indicates if the value is number.
     * 
     * @returns {boolean} iff the data is number
     */
    isNumber():boolean;

    /**
     *  Get the value indicates if the value is string.
     * 
     * @returns {boolean} iff the data is string
     */
    isString():boolean;
}

/**
 * The interface for the expressions from code.
 */
interface Expression {
    /**
     * Evaluate this expression.
     * 
     * @param environment {Map<string, Value>} the environment for evaluating the expression
     * @returns {Value} evaluation result 
     */
    evaluate(environment:Map<string, Value>):Value;
}

/**
 * The interface for functions and operators implemented inside interpreter.
 */
interface Routine {
     /**
     * Evaluate this routine.
     * 
     * @param parameters {Array<Value>} the parameters for evaluating the routine
     * @returns {Value} evaluation result 
     */
    evaluate(parameters:Array<Value>):Value;
}

/**
 * The interface for definitions.
 */
interface Definition {
    readonly identifier:string;
    readonly expression:Expression;
}

/**
 * The interface for programs.
 */
interface Program {
    readonly definitions: Array<Definition>;
    readonly expressions: Array<Expression>;
}

/**
 * The interface for RoutineExpression.
 */
interface RoutineExpression extends Expression {
    readonly routine:Routine;
}

/**
 * The interface for LambdaExpression.
 */
interface LambdaExpression extends Expression {
    readonly formals:Array<string>;
    readonly expression:Expression;
}

/**
 * The interface for ConstantExpression.
 */
interface ConstantExpression extends Expression {
}

/**
 * The interface for IdentifierExpression.
 */
interface IdentifierExpression extends Expression {
}

/**
 * The interface for CallExpression.
 */
interface CallExpression extends Expression {
    readonly operator:Expression;
    readonly parameters:Array<Expression>;
}

/**
 * The interface for BindExpression.
 */
interface BindExpression extends Expression {
    readonly bindings:Array<[string, Expression]>;
    readonly expression:Expression;
}

/**
 * The interface for IfExpression.
 */
interface IfExpression extends Expression {
}