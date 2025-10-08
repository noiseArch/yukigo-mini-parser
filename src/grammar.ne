@{%
import { MiniLexer } from "./lexer.js"
import { 
    SimpleType, 
    Assignment, 
    Variable,
    ArithmeticBinaryOperation, 
    SymbolPrimitive, 
    NumberPrimitive, 
    BooleanPrimitive, 
    StringPrimitive, 
    ParameterizedType,
    Sequence,
    UnguardedBody,
    VariablePattern,
    Equation,
    Procedure,
    TypeSignature,
    CharPrimitive,
    NilPrimitive,
    Return
} from "yukigo-core"
%}

@preprocessor typescript
@lexer MiniLexer

program -> statement:+ _ %EOF {% (d) => d[0].flat(Infinity) %}

# Statements

statement -> (assignment | function_statement | return_statement) _ ";" _ {% (d) => d[0][0] %}

assignment -> type __ variable (_ ":=" _ expression):? {% (d) => new Variable(d[2], d[3] ? d[3][3] : new NilPrimitive(null), d[0]) %}

return_statement -> "return" _ expression {% (d) => new Return(d[2]) %}

## Function rules

function_statement -> type __ variable ("(" _ param_list:? _ ")" _ "{" _ body _ "}") {% (d) => {
    const paramTypeList = []
    const patternList = []
    if(d[3][2]) {
        for(const [paramType, paramPattern] of d[3][2]) {
            paramTypeList.push(paramType);
            patternList.push(paramPattern);
        }
    }
    const signatureType = new ParameterizedType(paramTypeList, d[0], []) 

    const signature = new TypeSignature(d[2], signatureType);
    const procedure =  new Procedure(d[2], [new Equation(patternList, d[3][8])])
    return [signature, procedure]
}%}

param_list -> param (_ "," _ param):* {% d => [d[0], ...d[1].map(x => x[3])] %}

param -> type __ variable {% d => [d[0], new VariablePattern(d[2])] %}

body -> statement:* {% (d) => new UnguardedBody(new Sequence(d[0])) %}

# Expressions

expression -> addition {% (d) => d[0] %}

addition -> 
    addition _ "+" _ multiplication {% (d) => new ArithmeticBinaryOperation("Plus", d[0], d[4]) %}
    | addition _ "-" _ multiplication {% (d) => new ArithmeticBinaryOperation("Minus", d[0], d[4]) %}
    | multiplication {% (d) => d[0] %}

multiplication -> 
    multiplication _ "*" _ primary {% (d) => new ArithmeticBinaryOperation("Multiply", d[0], d[4]) %}
    | multiplication _ "/" _ primary {% (d) => new ArithmeticBinaryOperation("Divide", d[0], d[4]) %}
    | primary {% (d) => d[0] %}

primary -> 
    variable {% (d) => d[0] %}
    | "(" _ expression _ ")" {% (d) => d[2] %}
    | primitive {% (d) => d[0] %}

primitive -> 
    %number {% (d) => new NumberPrimitive(Number(d[0].value)) %}
    | %char {% (d) => new CharPrimitive(d[0].value) %}
    | variable {% (d) => d[0] %}
    | %string {% (d) => new StringPrimitive(d[0].value) %}
    | %bool {% (d) => new BooleanPrimitive(d[0].value) %}

type -> variable {% (d) => new SimpleType(d[0].value, []) %}

variable -> %variable {% (d) => new SymbolPrimitive(d[0].value) %}

_ -> %WS:* {% d => null %}
__ -> %WS:+ {% d => null %}