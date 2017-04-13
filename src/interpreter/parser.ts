/// <reference path="./syntax.ts" />
/// <reference path="./lexer.ts" />

class Parser {
    public static run (code:string): Program {
        let tokens:Array<Token> = RacketLexer.parse(code);
        console.log(JSON.stringify(tokens))
        console.log()

        let definitions:Array<Definition> = [];
        let expressions:Array<Expression> = [];

        let index:number = 0;
        while(index < tokens.length) {
            let scope = ParseTree.parse(tokens, index, tokens.length);
            index += scope.size;

            if (scope.body[0] instanceof Token && scope.body[0].text == "define") {
                console.log(scope.body);
                definitions.push(Parser.fetchDefinition(scope));
            } else {
                expressions.push(Parser.fetch(scope));
            }
        }
        return Syntax.createProgram(definitions, expressions);
    }

    public static fetchDefinition (node:ParseTree): Definition {

        let identifiers:Array<string> = Parser.fetchIdentifier(node.body[1]);

        let identifier:string = identifiers[0];
        let parameters:Array<string> = identifiers.slice(1);
        let expression:Expression = Parser.fetch(node.body[2]);

        let lambda = Syntax.createLambdaExpression(parameters, expression);

        return Syntax.createDefinition(identifier, lambda);
    }

    public static fetch (node:ParseTree): Expression {
        if (node instanceof Token) {
            let token = node as Token;
            if (token.type == TokenType.NUMBER) {
                return Syntax.createConstantExpression(Syntax.createNumberData(token.text));
            } else if (token.type == TokenType.BOOLEAN) {
                return Syntax.createConstantExpression(Syntax.createBooleanData(token.text));
            } else if (token.type == TokenType.STRING) {
                return Syntax.createConstantExpression(Syntax.createQuotedStringData(token.text));
            } else {
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

        switch(operator.text) {
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

    public static fetchLambdaExpression (node:ParseTree): LambdaExpression {
        // node.body[0] must be lambda or λ
        let formals:Array<string> = Parser.fetchIdentifier(node.body[1]);
        let expression:Expression = Parser.fetch(node.body[2]);

        return Syntax.createLambdaExpression(formals, expression);
    }

    public static fetchCallExpression (node:ParseTree): CallExpression {
        let operator:Expression = null;
        let parameters:Array<Expression> = [];

        node.body.forEach(element => {
            let exp:Expression = Parser.fetch(element);
            if (operator == null) {
                operator = exp;
            } else {
                parameters.push(exp);
            }
        });

        return Syntax.createCallExpression(operator, parameters);
    }

    public static fetchLetExpression (node:ParseTree): BindExpression {
        let bindings:Array<[string,Expression]> = Parser.fetchBindings(node.body[1]);
        let expression:Expression = Parser.fetch(node.body[2]);

        return Syntax.createBindExpression(bindings, expression);
    }

    public static fetchIfExpression (node:ParseTree): IfExpression {
        if (node.body.length != 4) {
            throw new Error("if expression should conatins 3 expressions");
        }

        let testExpression = Parser.fetch(node.body[1]);
        let thenExpression = Parser.fetch(node.body[2]);
        let elseExpression = Parser.fetch(node.body[3]);

        return Syntax.createIfExpression(testExpression, thenExpression, elseExpression)
    }

    public static fetchBinding (node:ParseTree): [string,Expression] {
        let identifier:string = node.body[0].text;
        let expression:Expression = Parser.fetch(node.body[1]);
        return [identifier,expression];
    }

    public static fetchBindings (node:ParseTree): Array<[string,Expression]> {
        let bindings:Array<[string,Expression]> = [];
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
    public static fetchIdentifier (node:ParseTree): Array<string> {
        let parameters:Array<string> = [];

        node.body.forEach(element => {
            let tokenElement = element as Token;
            parameters.push(tokenElement.text);
        });

        return parameters;
    }
}

class ParseTree {
    body:Array<any>;
    size:number;

    constructor() {
        this.body = [];
        this.size = 0;
    }

    public static parse(tokens:Array<Token>, index:number, length:number):ParseTree {
        let startToken = tokens[index].text;
        let endToken = "";
        if (startToken == "(") {
            endToken = ")";
        } else if (startToken == "[") {
            endToken = "]";
        } else if (startToken == "{") {
            endToken = "}";
        }
        index ++;

        let obj:ParseTree = new ParseTree();
        obj.size += 1;

        while(index < length) {
            let currentToken = tokens[index].text;
            if (currentToken == "(" || currentToken == "[" || currentToken == "{") {
                let subObj:ParseTree = ParseTree.parse(tokens, index, length);
                obj.body.push(subObj);
                index += subObj.size;
                obj.size += subObj.size;
            } else if (currentToken == endToken) {
                obj.size += 1;
                break;
            } else {
                obj.body.push(tokens[index]);
                index += 1;
                obj.size += 1;
            }
        }

        return obj;
    }
}