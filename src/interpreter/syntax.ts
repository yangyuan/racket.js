/// <reference path="../base.ts" />

/**
 * Factory class for syntax elements.
 */
class Syntax {
    /**
     * Create a Definition.
     * 
     * @param identifier the name of the Definition
     * @param expression the expression of the Definition
     */
    public static createDefinition(identifier:string, expression:Expression):Definition {
        return new DefaultDefinition(identifier, expression);
    }
    
    /**
     * Create a RoutineExpression.
     * 
     * @param routine the routine of the RoutineExpression
     */
    public static createRoutineExpression(routine:Routine):RoutineExpression {
        return new DefaultRoutineExpression(routine);
    }
    
    /**
     * Create a LambdaExpression.
     * 
     * @param formals the formals of the LambdaExpression
     * @param expression the body of the LambdaExpression
     */
    public static createLambdaExpression(formals:Array<string>, expression:Expression):LambdaExpression {
        return new DefaultLambdaExpression(formals, expression);
    }

    /**
     * Create a BindExpression.
     * 
     * @param bindings {Array<[string,Expression]>} the bindings of the BindExpression
     * @param expression {Expression} the body of the BindExpression
     */
    public static createBindExpression(bindings:Array<[string,Expression]>, expression:Expression):BindExpression {
        return new DefaultBindExpression(bindings, expression);
    }

    /**
     * Create a CallExpression.
     * 
     * @param operator {Expression} the operator of the CallExpression
     * @param parameters {Array<Expression>} the parameters of the CallExpression
     */
    public static createCallExpression(operator:Expression, parameters:Array<Expression>):CallExpression {
        return new DefaultCallExpression(operator, parameters);
    }
    
    /**
     * Create a IdentifierExpression.
     * 
     * @param identifier {string} the identifier of the IdentifierExpression
     */
    public static createIdentifierExpression(identifier:string):IdentifierExpression {
        return new DefaultIdentifierExpression(identifier);
    }
    
    /**
     * Create a ConstantExpression.
     * 
     * @param data {string} the data of the ConstantExpression
     */
    public static createConstantExpression(data:Data):ConstantExpression {
        return new DefaultConstantExpression(data);
    }
    
    /**
     * Create a IfExpression.
     * 
     * @param testExpression {Expression} the test part of the IfExpression
     * @param thenExpression {Expression} the then part of the IfExpression
     * @param elseExpression {Expression} the else part of the IfExpression
     */
    public static createIfExpression(testExpression:Expression, thenExpression:Expression, elseExpression:Expression):IfExpression {
        return new DefaultIfExpression(testExpression, thenExpression, elseExpression);
    }

    /**
     * Create a Data value.
     * 
     * @param data {any} the data of the Data value
     */
    public static createNumberData(value:any):Data {
        if (typeof value == "number") {
            return new DefaultData(value);
        }

        return new DefaultData(parseInt(value));
    }

    /**
     * Create a Data value.
     * 
     * @param data {any} the data of the Data value
     */
    public static createStringData(value:any):Data {
        if (typeof value == "string") {
            return new DefaultData(value);
        }

        return new DefaultData(value + "");
    }

    /**
     * Create a Data value.
     * 
     * @param data {string} the data of the Data value
     */
    public static createQuotedStringData(value:string):Data {
        value = value.replace(/\"((:?\\.|[^\"])*)\"/, "$1")
        value = value.replace(/\\(.{1})/g, "$1")
        return new DefaultData(value);
    }

    /**
     * Create a Data value.
     * 
     * @param data {any} the data of the Data value
     */
    public static createBooleanData(value:any):Data {
       if (typeof value == "boolean") {
           return new DefaultData(value);
       } else if (typeof value == "string") {
            if (value === '#true' || value === '#t') {
                return new DefaultData(true);
            } else if (value === '#false' || value === '#f') {
                return new DefaultData(false);
            } 
        }

        throw new Error("Can not the value to boolean");
    }

    /**
     * Create a Program.
     * 
     * @param definitions the definitions of the Program
     * @param expressions the expressions of the Program
     */
    public static createProgram(definitions: Array<Definition>, expressions: Array<Expression>):Program {
        return new DefaultProgram(definitions, expressions);
    }
}

/**
 * Default implementation of Program.
 */
class DefaultProgram implements Program {
    readonly definitions: Array<Definition>;
    readonly expressions: Array<Expression>;

    constructor(definitions: Array<Definition>, expressions: Array<Expression>) {
        this.definitions = definitions;
        this.expressions = expressions;
    }
}

/**
 * Base implementation of Data.
 */
abstract class BaseData implements Data {

    /** @inheritdoc */
    procedure():Procedure {
        throw new Error("Can not cast from Data to Procedure.");
    }

    /** @inheritdoc */
    asData():Data {
        return this;
    }

    /** @inheritdoc */
    isData():boolean {
        return true;
    }
    

    /** @inheritdoc */
    abstract readonly value:any;

    /** @inheritdoc */
    abstract number():number;

    /** @inheritdoc */
    abstract string():string;

    /** @inheritdoc */
    abstract boolean():boolean;

    /** @inheritdoc */
    abstract isString():boolean;

    /** @inheritdoc */
    abstract isNumber():boolean;
}

/**
 * Base implementation of Procedure.
 */
abstract class BaseProcedure implements Procedure {
    
    /** @inheritdoc */
    procedure():Procedure {
        return this;
    }

    /** @inheritdoc */
    asData():Data {
        throw new Error("Can not cast from Procedure to Data.");
    }

    /** @inheritdoc */
    isData():boolean {
        return false;
    }

    /** @inheritdoc */
    abstract apply(inputs:Array<Value>):Value; 
}

/**
 * Default implementation of Data.
 */
class DefaultData extends BaseData implements Data {

    /** @inheritdoc */
    readonly value:any;
    
    constructor(value:any) {
        super();
        this.value = value;
    }

    /** @inheritdoc */
    number():number {
        if (typeof this.value == "number") {
            return this.value;
        }
        throw new Error("can not cast value to number");
    }

    /** @inheritdoc */
    string():string {
        if (typeof this.value == "string") {
            return this.value;
        }
        throw new Error("can not cast value to string");
    }

    /** @inheritdoc */
    boolean():boolean {
        if (typeof this.value == "boolean") {
            return this.value;
        }
        throw new Error("can not cast value to boolean");
    }

    /** @inheritdoc */
    isString():boolean {
        return typeof this.value == "string";
    }

    /** @inheritdoc */
    isNumber():boolean {
        return typeof this.value == "number";
    }
}


/**
 * Implementation for routine Procedure.
 */
class RoutineProcedure extends BaseProcedure implements Procedure {
    private routine:Routine;

    constructor(routine:Routine) {
        super();
        this.routine = routine;
    }

    /** @inheritdoc */
    public apply(inputs:Array<Value>):Value {
        return this.routine.evaluate(inputs);
    }
}

/**
 * Implementation for lambda Procedure.
 */
class LambdaProcedure extends BaseProcedure implements Procedure {
    private lambda:LambdaExpression;
    private environment:Map<string, Value>;

    constructor(lambda:LambdaExpression, environment:Map<string, Value>) {
        super();
        this.lambda = lambda;
        this.environment = environment;
    }

    /** @inheritdoc */
    public apply(inputs:Array<Value>):Value {
        let tmpEnvironment = new Map<string, Value>();
        this.environment.forEach((value,key) => {
            tmpEnvironment.set(key, value);
        });

        this.lambda.formals.forEach((key,index) => {
            tmpEnvironment.set(key, inputs[index]);
        });

        return this.lambda.expression.evaluate(tmpEnvironment);
    }
}

/**
 * Default implementation of Definition.
 */
class DefaultDefinition implements Definition {
    readonly identifier:string;
    readonly expression:Expression;

    constructor(identifier:string, expression:Expression) {
        this.identifier = identifier;
        this.expression = expression;
    }
}

/**
 * Base implementation of Expression.
 */
abstract class BaseExpression implements Expression {
    type:string;

    constructor(type:string) {
        this.type = type;
    }

    /** @inheritdoc */
    abstract evaluate(environment:Map<string, Value>):Value;
}

/**
 * Default implementation of RoutineExpression.
 */
class DefaultRoutineExpression extends BaseExpression implements RoutineExpression {
    readonly routine:Routine;
    constructor(routine:Routine) {
        super("routine");
        this.routine = routine;
    }
    
    /** @inheritdoc */
    public evaluate(environment:Map<string, Value>):Value {
        return new RoutineProcedure(this.routine);
    }
}

/**
 * Default implementation of LambdaExpression.
 */
class DefaultLambdaExpression extends BaseExpression implements LambdaExpression {

    readonly formals:Array<string>;
    readonly expression:Expression;

    constructor(formals:Array<string>, expression:Expression) {
        super("lambda");
        this.formals = formals;
        this.expression = expression;
    }
    
    /** @inheritdoc */
    public evaluate(environment:Map<string, Value>):Value {
        return new LambdaProcedure(this, environment);
    }
}

/**
 * Default implementation of CallExpression.
 */
class DefaultCallExpression extends BaseExpression implements CallExpression {
    readonly operator:Expression;
    readonly parameters:Array<Expression>;

    constructor(operator:Expression, parameters:Array<Expression>) {
        super("call");
        this.operator = operator;
        this.parameters = parameters;
    }
    
    /** @inheritdoc */
    public evaluate(environment:Map<string, Value>):Value {
        let procedure:Procedure = this.operator.evaluate(environment).procedure();
        let parameters:Array<Data> = [];
        this.parameters.forEach(element => {
            parameters.push(element.evaluate(environment) as Data);
        });
        return procedure.apply(parameters);
    }
}

/**
 * Default implementation of IdentifierExpression.
 */
class DefaultIdentifierExpression extends BaseExpression implements IdentifierExpression {
    name:string;

    constructor(name:string) {
        super("identifier");
        this.name = name;
    }

    /** @inheritdoc */
    public evaluate(environment:Map<string, Value>):Value {
        if (!environment.has(this.name)) {
            throw new Error("Undefined identifier: " + this.name + ".");
        }

        return environment.get(this.name);
    }
}

/**
 * Default implementation of ConstantExpression.
 */
class DefaultConstantExpression extends BaseExpression implements ConstantExpression {
    value:Data;

    constructor(value:Data) {
        super("constant");
        this.value = value;
    }

    /** @inheritdoc */
    public evaluate(environment:Map<string, Value>):Value {
        return this.value;
    }
}

/**
 * Default implementation of BindExpression.
 */
class DefaultBindExpression extends BaseExpression implements BindExpression {
    readonly bindings:Array<[string,Expression]>;
    readonly expression:Expression;

    constructor(bindings:Array<[string,Expression]>, expression:Expression) {
        super("bind");
        this.bindings = bindings;
        this.expression = expression;
    }

    /** @inheritdoc */
    public evaluate(environment:Map<string, Value>): Value {
        return this.expression.evaluate(environment);
    }
}

/**
 * Default implementation of BindExpression.
 */
class DefaultIfExpression extends BaseExpression implements IfExpression {
    readonly testExpression:Expression;
    readonly thenExpression:Expression;
    readonly elseExpression:Expression;

    constructor(testExpression:Expression, thenExpression:Expression, elseExpression:Expression) {
        super("if");
        this.testExpression = testExpression;
        this.thenExpression = thenExpression;
        this.elseExpression = elseExpression;
    }

    /** @inheritdoc */
    public evaluate(environment:Map<string, Value>): Value {
        let testValue:Value = this.testExpression.evaluate(environment);
        let testResult = testValue.asData().boolean();

        if (testResult) {
            return this.thenExpression.evaluate(environment);
        } else {
            return this.elseExpression.evaluate(environment);
        }
    }
}
