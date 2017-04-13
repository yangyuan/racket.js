enum TokenType {
    NONE,
    IDENTIFIER,
    NUMBER,
    BOOLEAN,
    STRING,
    SYMBOL,
    DELIMITER
}


class Token {
    index:number;
    text:string;
    type:TokenType;

    constructor(index:number, text:string, type:TokenType) {
        this.index = index;
        this.text = text;
        this.type = type;
    }
}

abstract class Lexer {
    public abstract lex ():Array<[RegExp|Function,TokenType]>;

    public fetch(code:string, index:number):Token {
        let rules = this.lex();

        for (var i = 0; i < rules.length; i++) {
            let element = rules[i];
            let rule = element[0];
            let type = element[1];
            if (rule instanceof Function) {
                throw new Error("Does not support Function as rule yet.");
            }

            let re = new RegExp("^("+ rule.source + ")");
            let found = re.exec (code.slice(index));
            if (found != null) {
                return new Token(index, found[0], type);
            }
        }

        throw new Error("unexpected code from index " + index + ".");
    }

    public parse (code:string): Array<Token> {
        let tokens:Array<Token> = [];
        let index:number = 0;
        while(true) {
            let token:Token = this.fetch(code, index);
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
    public lex ():Array<[RegExp|Function,TokenType]> {
        return [
            [ /[0-9]+/, TokenType.NUMBER ],
            [ /\#true|\#false|\#t|\#f/, TokenType.BOOLEAN ],
            // Boolean is also symbol, but so far I don't want to support other symbols yet
            [ /\#[^\(\)\[\]\{\}\"\,\'\`\;\#\|\\\s]+/, TokenType.SYMBOL ],
            [ /[^\(\)\[\]\{\}\"\,\'\`\;\#\|\\\s]+/, TokenType.IDENTIFIER ],
            [ /\"(:?\\.|[^\"])*\"/, TokenType.STRING ],
            [ /[\(\)\[\]\{\}\"\,\'\`\;\#\|\\]/, TokenType.DELIMITER ],
            [ /[\s]+/, TokenType.NONE ]
            ];
    }

    public static parse (code:string): Array<Token> {
        return new RacketLexer().parse(code);
    }
}