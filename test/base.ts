function test(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) {
    let testCaseName:string = target.constructor.name + ":" + propertyKey + "()";
    let testCaseFunction:Function = descriptor.value;

    try {
        testCaseFunction()
    } catch (e) {
        console.error(testCaseName);
        console.error(e);
    }
}

class assert {
    public static fail(actual?: any, expected?: any, message?: string, operator?: string): void {
        throw new AssertionError({
            message: message,
            actual: actual,
            expected: expected,
            operator: operator
        });
    }
    public static ok(value: any, message?: string): void {
        if (!value) assert.fail(value, true, message);
    }
    public static equal(actual: any, expected: any, message?: string): void {
        if (actual != expected) assert.fail(actual, expected, message, '==');
    }
}

interface ErrorConstructor {
    captureStackTrace(thisArg: any, func: any): void
}

class AssertionError extends Error {
    constructor(options:any) {
        super();
        Error.captureStackTrace(this, this.constructor);
    }
}