class Interpreter {
    public static evaluate(expression:Expression, environment:Map<string,Value>) {
        return expression.evaluate(environment);
    }

    public static run(program:Program):Array<Data> {

        let environment:Map<string,Value> = new Map<string,Value>();

        RacketLibraries.module("").forEach(element => {
            environment.set(element.identifier, element.expression.evaluate(environment));
        })

        program.definitions.forEach(element => {
            environment.set(element.identifier, new LambdaProcedure(element.expression as LambdaExpression, environment));
        });
        
        let values:Array<Data> = []
        program.expressions.forEach(element => {
            let value = element.evaluate(environment) as Data;
            values.push(value.value);
        });

        return values;
    }
}