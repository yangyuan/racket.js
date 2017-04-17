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
        let programs:Array<[string, any]> = [];
        programs.push(
            ["(define (csurface length) (* 6 length length)) (csurface 3)",
            54]);
        programs.push(["(define (cvolume length) (let ((len length))(* len len len))) \
        \
        (define (csurface length) (* 6 length length)) (csurface 3)",
            54]);
        programs.push(["((lambda (x) (+ x 1)) 2)", 3]);
        programs.push(["((lambda (op) (op 1 2 3)) (lambda (x y z) x))", 1]);
        programs.push(["(if #true 1 0)", 1]);
        programs.push(['(string? "")', true]);
        programs.push(['(string-length "")', 0]);
        programs.push(['(string-length "aaa")', 3]);
        programs.push(['(string-append "a" "a")', "aa"]);
        programs.push(['(string-append)', ""]);
        programs.push(['(string=? "" "")', true]);
        programs.push(['(string=? "a" "a")', true]);
        programs.push(['(string=? "a" "")', false]);
        programs.push(['(string=? "a" "b")', false]);
        programs.push(['(substring "abcd" 1)', "bcd"]);
        programs.push(['(substring "abcd" 1 2)', "b"]);
        programs.push(['(substring "abcd" 1 3)', "bc"]);
        programs.push(['(substring "abcd" 1 4)', "bcd"]);

        programs.forEach(element => {
            ProgramTests.assertProgram(element[0], element[1])
        });
    }

    static assertProgram(code, result) {
        let program = Parser.run(code);
        let results = Interpreter.run(program);
        assert.ok(results.length == 1, "Program results contains multiple results:" + code);
        assert.ok(results[0] === result, `Program results contains wrong result: expect ${result}, actually ${results[0]}, code ` + code);
    }
}