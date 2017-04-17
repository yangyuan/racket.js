/// <reference path="../base.ts" />

class BaseModule implements RacketModule {
    definitions():Array<[string,Routine]> {
        return [
            [ 'string?', new IsStringRoutine() ],
            [ 'string-length', new StringLengthRoutine() ],
            [ 'string-append', new StringAppendRoutine() ],
            [ 'substring', new SubstringRoutine() ],
            [ 'string=?', new StringEqualsRoutine() ],
            ];
    }
}