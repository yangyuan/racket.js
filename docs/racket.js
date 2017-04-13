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
    static module(path) {
        let definitions = [];
        RacketLibraries.bind(definitions, "+", new AddRoutine());
        RacketLibraries.bind(definitions, "-", new SubtractRoutine());
        RacketLibraries.bind(definitions, "*", new MultiplyRoutine());
        RacketLibraries.bind(definitions, "/", new DivideRoutine());
        RacketLibraries.bind(definitions, ">", new GreaterThanRoutine());
        RacketLibraries.bind(definitions, "<", new LessThanRoutine());
        RacketLibraries.bind(definitions, "=", new EqualsRoutine());
        return definitions;
    }
    /**
     * Bind a routine to a list of Definition with a name.
     *
     * @param definitions the list of Definition
     * @param name the routine name in the definitions
     * @param routine the routine instance
     */
    static bind(definitions, name, routine) {
        definitions.push(Syntax.createDefinition(name, Syntax.createRoutineExpression(routine)));
    }
}
/**
 * Routine for greater than operation.
 * @todo deal with errors.
 */
class GreaterThanRoutine {
    /** @inheritdoc */
    evaluate(parameters) {
        let ret = true;
        let last = null;
        parameters.forEach(element => {
            let data = element;
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
class LessThanRoutine {
    /** @inheritdoc */
    evaluate(parameters) {
        let ret = true;
        let last = null;
        parameters.forEach(element => {
            let data = element;
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
class EqualsRoutine {
    /** @inheritdoc */
    evaluate(parameters) {
        let ret = true;
        let last = null;
        parameters.forEach(element => {
            let data = element;
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
class AddRoutine {
    /** @inheritdoc */
    evaluate(parameters) {
        let ret = 0;
        parameters.forEach(element => {
            let data = element;
            ret += data.number();
        });
        return Syntax.createNumberData(ret);
    }
}
/**
 * Routine for subtract operation.
 * @todo deal with errors.
 */
class SubtractRoutine {
    /** @inheritdoc */
    evaluate(parameters) {
        let ret = parameters[0].number() * 2;
        parameters.forEach(element => {
            let data = element;
            ret -= data.number();
        });
        return Syntax.createNumberData(ret);
    }
}
/**
 * Routine for multiply operation.
 * @todo deal with errors.
 */
class MultiplyRoutine {
    /** @inheritdoc */
    evaluate(parameters) {
        let ret = 1;
        parameters.forEach(element => {
            let data = element;
            ret *= data.number();
        });
        return Syntax.createNumberData(ret);
    }
}
/**
 * Routine for divide operation.
 * @todo deal with errors.
 */
class DivideRoutine {
    /** @inheritdoc */
    evaluate(parameters) {
        let ret = parameters[0].number() * parameters[0].number();
        parameters.forEach(element => {
            let data = element;
            ret /= data.number();
        });
        return Syntax.createNumberData(ret);
    }
}
class Interpreter {
    static evaluate(expression, environment) {
        return expression.evaluate(environment);
    }
    static run(program) {
        let environment = new Map();
        RacketLibraries.module("").forEach(element => {
            environment.set(element.identifier, element.expression.evaluate(environment));
        });
        program.definitions.forEach(element => {
            environment.set(element.identifier, new LambdaProcedure(element.expression, environment));
        });
        let values = [];
        program.expressions.forEach(element => {
            let value = element.evaluate(environment);
            values.push(value.value);
            console.log(value.value);
        });
        return values;
    }
}
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
    static execute(code) {
        let results = [];
        try {
            let program = Parser.run(code);
            let values = Interpreter.run(program);
            values.forEach(element => {
                let result = new Result();
                result.value = element;
                results.push(result);
            });
        }
        catch (error) {
            let result = new Result();
            result.error = error.message;
            results.push(result);
        }
        return results;
    }
}
class Result {
    constructor() {
        this.value = null;
        this.error = null;
    }
}
var TokenType;
(function (TokenType) {
    TokenType[TokenType["NONE"] = 0] = "NONE";
    TokenType[TokenType["IDENTIFIER"] = 1] = "IDENTIFIER";
    TokenType[TokenType["NUMBER"] = 2] = "NUMBER";
    TokenType[TokenType["BOOLEAN"] = 3] = "BOOLEAN";
    TokenType[TokenType["STRING"] = 4] = "STRING";
    TokenType[TokenType["SYMBOL"] = 5] = "SYMBOL";
    TokenType[TokenType["DELIMITER"] = 6] = "DELIMITER";
})(TokenType || (TokenType = {}));
class Token {
    constructor(index, text, type) {
        this.index = index;
        this.text = text;
        this.type = type;
    }
}
class Lexer {
    fetch(code, index) {
        let rules = this.lex();
        for (var i = 0; i < rules.length; i++) {
            let element = rules[i];
            let rule = element[0];
            let type = element[1];
            if (rule instanceof Function) {
                throw new Error("Does not support Function as rule yet.");
            }
            let re = new RegExp("^(" + rule.source + ")");
            let found = re.exec(code.slice(index));
            if (found != null) {
                return new Token(index, found[0], type);
            }
        }
        throw new Error("unexpected code from index " + index + ".");
    }
    parse(code) {
        let tokens = [];
        let index = 0;
        while (true) {
            let token = this.fetch(code, index);
            if (token.type != TokenType.NONE) {
                tokens.push(token);
            }
            index += token.text.length;
            if (code.length <= index) {
                break;
            }
        }
        return tokens;
    }
}
/**
 * Lexer for Racket.
 */
class RacketLexer extends Lexer {
    lex() {
        return [
            [/[0-9]+/, TokenType.NUMBER],
            [/\#true|\#false|\#t|\#f/, TokenType.BOOLEAN],
            // Boolean is also symbol, but so far I don't want to support other symbols yet
            [/\#[^\(\)\[\]\{\}\"\,\'\`\;\#\|\\\s]+/, TokenType.SYMBOL],
            [/[^\(\)\[\]\{\}\"\,\'\`\;\#\|\\\s]+/, TokenType.IDENTIFIER],
            [/\"(:?\\.|[^\"])*\"/, TokenType.STRING],
            [/[\(\)\[\]\{\}\"\,\'\`\;\#\|\\]/, TokenType.DELIMITER],
            [/[\s]+/, TokenType.NONE]
        ];
    }
    static parse(code) {
        return new RacketLexer().parse(code);
    }
}
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
    static createDefinition(identifier, expression) {
        return new DefaultDefinition(identifier, expression);
    }
    /**
     * Create a RoutineExpression.
     *
     * @param routine the routine of the RoutineExpression
     */
    static createRoutineExpression(routine) {
        return new DefaultRoutineExpression(routine);
    }
    /**
     * Create a LambdaExpression.
     *
     * @param formals the formals of the LambdaExpression
     * @param expression the body of the LambdaExpression
     */
    static createLambdaExpression(formals, expression) {
        return new DefaultLambdaExpression(formals, expression);
    }
    /**
     * Create a BindExpression.
     *
     * @param bindings {Array<[string,Expression]>} the bindings of the BindExpression
     * @param expression {Expression} the body of the BindExpression
     */
    static createBindExpression(bindings, expression) {
        return new DefaultBindExpression(bindings, expression);
    }
    /**
     * Create a CallExpression.
     *
     * @param operator {Expression} the operator of the CallExpression
     * @param parameters {Array<Expression>} the parameters of the CallExpression
     */
    static createCallExpression(operator, parameters) {
        return new DefaultCallExpression(operator, parameters);
    }
    /**
     * Create a IdentifierExpression.
     *
     * @param identifier {string} the identifier of the IdentifierExpression
     */
    static createIdentifierExpression(identifier) {
        return new DefaultIdentifierExpression(identifier);
    }
    /**
     * Create a ConstantExpression.
     *
     * @param data {string} the data of the ConstantExpression
     */
    static createConstantExpression(data) {
        return new DefaultConstantExpression(data);
    }
    /**
     * Create a IfExpression.
     *
     * @param testExpression {Expression} the test part of the IfExpression
     * @param thenExpression {Expression} the then part of the IfExpression
     * @param elseExpression {Expression} the else part of the IfExpression
     */
    static createIfExpression(testExpression, thenExpression, elseExpression) {
        return new DefaultIfExpression(testExpression, thenExpression, elseExpression);
    }
    /**
     * Create a Data value.
     *
     * @param data {any} the data of the Data value
     */
    static createNumberData(value) {
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
    static createStringData(value) {
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
    static createQuotedStringData(value) {
        value = value.replace(/\"((:?\\.|[^\"])*)\"/, "$1");
        value = value.replace(/\\(.{1})/g, "$1");
        return new DefaultData(value);
    }
    /**
     * Create a Data value.
     *
     * @param data {any} the data of the Data value
     */
    static createBooleanData(value) {
        if (typeof value == "boolean") {
            return new DefaultData(value);
        }
        else if (typeof value == "string") {
            if (value === '#true' || value === '#t') {
                return new DefaultData(true);
            }
            else if (value === '#false' || value === '#f') {
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
    static createProgram(definitions, expressions) {
        return new DefaultProgram(definitions, expressions);
    }
}
/**
 * Default implementation of Program.
 */
class DefaultProgram {
    constructor(definitions, expressions) {
        this.definitions = definitions;
        this.expressions = expressions;
    }
}
/**
 * Base implementation of Data.
 */
class BaseData {
    /** @inheritdoc */
    procedure() {
        throw new Error("Can not cast from Data to Procedure.");
    }
    /** @inheritdoc */
    data() {
        return this;
    }
}
/**
 * Base implementation of Procedure.
 */
class BaseProcedure {
    /** @inheritdoc */
    procedure() {
        return this;
    }
    /** @inheritdoc */
    data() {
        throw new Error("Can not cast from Procedure to Data.");
    }
}
/**
 * Default implementation of Data.
 */
class DefaultData extends BaseData {
    constructor(value) {
        super();
        this.value = value;
    }
    /** @inheritdoc */
    number() {
        if (typeof this.value == "number") {
            return this.value;
        }
        throw new Error("can not cast value to number");
    }
    /** @inheritdoc */
    string() {
        if (typeof this.value == "string") {
            return this.value;
        }
        throw new Error("can not cast value to string");
    }
    /** @inheritdoc */
    boolean() {
        if (typeof this.value == "boolean") {
            return this.value;
        }
        throw new Error("can not cast value to boolean");
    }
}
/**
 * Implementation for routine Procedure.
 */
class RoutineProcedure extends BaseProcedure {
    constructor(routine) {
        super();
        this.routine = routine;
    }
    /** @inheritdoc */
    apply(inputs) {
        return this.routine.evaluate(inputs);
    }
}
/**
 * Implementation for lambda Procedure.
 */
class LambdaProcedure extends BaseProcedure {
    constructor(lambda, environment) {
        super();
        this.lambda = lambda;
        this.environment = environment;
    }
    /** @inheritdoc */
    apply(inputs) {
        let tmpEnvironment = new Map();
        this.environment.forEach((value, key) => {
            tmpEnvironment.set(key, value);
        });
        this.lambda.formals.forEach((key, index) => {
            tmpEnvironment.set(key, inputs[index]);
        });
        return this.lambda.expression.evaluate(tmpEnvironment);
    }
}
/**
 * Default implementation of Definition.
 */
class DefaultDefinition {
    constructor(identifier, expression) {
        this.identifier = identifier;
        this.expression = expression;
    }
}
/**
 * Base implementation of Expression.
 */
class BaseExpression {
    constructor(type) {
        this.type = type;
    }
}
/**
 * Default implementation of RoutineExpression.
 */
class DefaultRoutineExpression extends BaseExpression {
    constructor(routine) {
        super("routine");
        this.routine = routine;
    }
    /** @inheritdoc */
    evaluate(environment) {
        return new RoutineProcedure(this.routine);
    }
}
/**
 * Default implementation of LambdaExpression.
 */
class DefaultLambdaExpression extends BaseExpression {
    constructor(formals, expression) {
        super("lambda");
        this.formals = formals;
        this.expression = expression;
    }
    /** @inheritdoc */
    evaluate(environment) {
        return new LambdaProcedure(this, environment);
    }
}
/**
 * Default implementation of CallExpression.
 */
class DefaultCallExpression extends BaseExpression {
    constructor(operator, parameters) {
        super("call");
        this.operator = operator;
        this.parameters = parameters;
    }
    /** @inheritdoc */
    evaluate(environment) {
        let procedure = this.operator.evaluate(environment).procedure();
        let parameters = [];
        this.parameters.forEach(element => {
            parameters.push(element.evaluate(environment));
        });
        return procedure.apply(parameters);
    }
}
/**
 * Default implementation of IdentifierExpression.
 */
class DefaultIdentifierExpression extends BaseExpression {
    constructor(name) {
        super("identifier");
        this.name = name;
    }
    /** @inheritdoc */
    evaluate(environment) {
        if (!environment.has(this.name)) {
            throw new Error("Undefined identifier: " + this.name + ".");
        }
        return environment.get(this.name);
    }
}
/**
 * Default implementation of ConstantExpression.
 */
class DefaultConstantExpression extends BaseExpression {
    constructor(value) {
        super("constant");
        this.value = value;
    }
    /** @inheritdoc */
    evaluate(environment) {
        return this.value;
    }
}
/**
 * Default implementation of BindExpression.
 */
class DefaultBindExpression extends BaseExpression {
    constructor(bindings, expression) {
        super("bind");
        this.bindings = bindings;
        this.expression = expression;
    }
    /** @inheritdoc */
    evaluate(environment) {
        return this.expression.evaluate(environment);
    }
}
/**
 * Default implementation of BindExpression.
 */
class DefaultIfExpression extends BaseExpression {
    constructor(testExpression, thenExpression, elseExpression) {
        super("if");
        this.testExpression = testExpression;
        this.thenExpression = thenExpression;
        this.elseExpression = elseExpression;
    }
    /** @inheritdoc */
    evaluate(environment) {
        let testValue = this.testExpression.evaluate(environment);
        let testResult = testValue.data().boolean();
        if (testResult) {
            return this.thenExpression.evaluate(environment);
        }
        else {
            return this.elseExpression.evaluate(environment);
        }
    }
}
/// <reference path="./syntax.ts" />
/// <reference path="./lexer.ts" />
class Parser {
    static run(code) {
        let tokens = RacketLexer.parse(code);
        console.log(JSON.stringify(tokens));
        console.log();
        let definitions = [];
        let expressions = [];
        let index = 0;
        while (index < tokens.length) {
            let scope = ParseTree.parse(tokens, index, tokens.length);
            index += scope.size;
            if (scope.body[0] instanceof Token && scope.body[0].text == "define") {
                console.log(scope.body);
                definitions.push(Parser.fetchDefinition(scope));
            }
            else {
                expressions.push(Parser.fetch(scope));
            }
        }
        return Syntax.createProgram(definitions, expressions);
    }
    static fetchDefinition(node) {
        let identifiers = Parser.fetchIdentifier(node.body[1]);
        let identifier = identifiers[0];
        let parameters = identifiers.slice(1);
        let expression = Parser.fetch(node.body[2]);
        let lambda = Syntax.createLambdaExpression(parameters, expression);
        return Syntax.createDefinition(identifier, lambda);
    }
    static fetch(node) {
        if (node instanceof Token) {
            let token = node;
            if (token.type == TokenType.NUMBER) {
                return Syntax.createConstantExpression(Syntax.createNumberData(token.text));
            }
            else if (token.type == TokenType.BOOLEAN) {
                return Syntax.createConstantExpression(Syntax.createBooleanData(token.text));
            }
            else if (token.type == TokenType.STRING) {
                return Syntax.createConstantExpression(Syntax.createQuotedStringData(token.text));
            }
            else {
                return Syntax.createIdentifierExpression(node.text);
            }
        }
        let operator = node.body[0];
        if (operator instanceof ParseTree) {
            return Parser.fetchCallExpression(node);
        }
        if (operator.type != TokenType.IDENTIFIER) {
            console.error("why?");
        }
        switch (operator.text) {
            case "let":
                return Parser.fetchLetExpression(node);
            case "lambda":
            case "λ":
                return Parser.fetchLambdaExpression(node);
            case "if":
                return Parser.fetchIfExpression(node);
            default:
                return Parser.fetchCallExpression(node);
        }
    }
    static fetchLambdaExpression(node) {
        // node.body[0] must be lambda or λ
        let formals = Parser.fetchIdentifier(node.body[1]);
        let expression = Parser.fetch(node.body[2]);
        return Syntax.createLambdaExpression(formals, expression);
    }
    static fetchCallExpression(node) {
        let operator = null;
        let parameters = [];
        node.body.forEach(element => {
            let exp = Parser.fetch(element);
            if (operator == null) {
                operator = exp;
            }
            else {
                parameters.push(exp);
            }
        });
        return Syntax.createCallExpression(operator, parameters);
    }
    static fetchLetExpression(node) {
        let bindings = Parser.fetchBindings(node.body[1]);
        let expression = Parser.fetch(node.body[2]);
        return Syntax.createBindExpression(bindings, expression);
    }
    static fetchIfExpression(node) {
        if (node.body.length != 4) {
            throw new Error("if expression should conatins 3 expressions");
        }
        let testExpression = Parser.fetch(node.body[1]);
        let thenExpression = Parser.fetch(node.body[2]);
        let elseExpression = Parser.fetch(node.body[3]);
        return Syntax.createIfExpression(testExpression, thenExpression, elseExpression);
    }
    static fetchBinding(node) {
        let identifier = node.body[0].text;
        let expression = Parser.fetch(node.body[1]);
        return [identifier, expression];
    }
    static fetchBindings(node) {
        let bindings = [];
        node.body.forEach(element => {
            bindings.push(Parser.fetchBinding(element));
        });
        return bindings;
    }
    /**
     * Fetch a list of identifiers in a ParseTree node.
     * All elements must be identifier tokens.
     *
     * @param node a ParseTree node
     */
    static fetchIdentifier(node) {
        let parameters = [];
        node.body.forEach(element => {
            let tokenElement = element;
            parameters.push(tokenElement.text);
        });
        return parameters;
    }
}
class ParseTree {
    constructor() {
        this.body = [];
        this.size = 0;
    }
    static parse(tokens, index, length) {
        let startToken = tokens[index].text;
        let endToken = "";
        if (startToken == "(") {
            endToken = ")";
        }
        else if (startToken == "[") {
            endToken = "]";
        }
        else if (startToken == "{") {
            endToken = "}";
        }
        index++;
        let obj = new ParseTree();
        obj.size += 1;
        while (index < length) {
            let currentToken = tokens[index].text;
            if (currentToken == "(" || currentToken == "[" || currentToken == "{") {
                let subObj = ParseTree.parse(tokens, index, length);
                obj.body.push(subObj);
                index += subObj.size;
                obj.size += subObj.size;
            }
            else if (currentToken == endToken) {
                obj.size += 1;
                break;
            }
            else {
                obj.body.push(tokens[index]);
                index += 1;
                obj.size += 1;
            }
        }
        return obj;
    }
}
