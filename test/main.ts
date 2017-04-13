/// <reference path="../src/base.ts"/>
/// <reference path="../src/interpreter/index.ts" />



class ExpressionTests {
    @test
    newTestMethod() {
        let operator = Syntax.createIdentifierExpression("*");
        let parameters = [];
        parameters.push(Syntax.createConstantExpression(Syntax.createNumberData("1")));
        parameters.push(Syntax.createConstantExpression(Syntax.createNumberData("2")));

        let call = Syntax.createCallExpression(operator, parameters);
        let environment:Map<string,Value> = new Map<string,Value>();
        RacketLibraries.module("").forEach(element => {
            environment.set(element.identifier, element.expression.evaluate(environment));
        })

        return true;
    }
}

class ProgramTests {
    @test
    newTestMethod() {
        let programs:Array<[string, string]> = [];
        programs.push(
            ["(define (csurface length) (* 6 length length)) (csurface 3)",
            "54"]);
        programs.push(["(define (cvolume length) (let ((len length))(* len len len))) \
        \
        (define (csurface length) (* 6 length length)) (csurface 3)",
            "54"]);
        programs.push(["((lambda (x) (+ x 1)) 2)", "3"]);
        programs.push(["((lambda (op) (op 1 2 3)) (lambda (x y z) x))", "3"]);
        programs.push(["(if #true 1 0)", "1"]);

        programs.forEach(element => {
            let program = Parser.run(element[0]);
            Interpreter.run(program);
        });
    }
}