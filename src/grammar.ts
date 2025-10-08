// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var EOF: any;
declare var number: any;
declare var char: any;
declare var string: any;
declare var bool: any;
declare var variable: any;
declare var WS: any;

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

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: MiniLexer,
  ParserRules: [
    {"name": "program$ebnf$1", "symbols": ["statement"]},
    {"name": "program$ebnf$1", "symbols": ["program$ebnf$1", "statement"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "program", "symbols": ["program$ebnf$1", "_", (MiniLexer.has("EOF") ? {type: "EOF"} : EOF)], "postprocess": (d) => d[0].flat(Infinity)},
    {"name": "statement$subexpression$1", "symbols": ["assignment"]},
    {"name": "statement$subexpression$1", "symbols": ["function_statement"]},
    {"name": "statement$subexpression$1", "symbols": ["return_statement"]},
    {"name": "statement", "symbols": ["statement$subexpression$1", "_", {"literal":";"}, "_"], "postprocess": (d) => d[0][0]},
    {"name": "assignment$ebnf$1$subexpression$1", "symbols": ["_", {"literal":":="}, "_", "expression"]},
    {"name": "assignment$ebnf$1", "symbols": ["assignment$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "assignment$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "assignment", "symbols": ["type", "__", "variable", "assignment$ebnf$1"], "postprocess": (d) => new Variable(d[2], d[3] ? d[3][3] : new NilPrimitive(null), d[0])},
    {"name": "return_statement", "symbols": [{"literal":"return"}, "_", "expression"], "postprocess": (d) => new Return(d[2])},
    {"name": "function_statement$subexpression$1$ebnf$1", "symbols": ["param_list"], "postprocess": id},
    {"name": "function_statement$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "function_statement$subexpression$1", "symbols": [{"literal":"("}, "_", "function_statement$subexpression$1$ebnf$1", "_", {"literal":")"}, "_", {"literal":"{"}, "_", "body", "_", {"literal":"}"}]},
    {"name": "function_statement", "symbols": ["type", "__", "variable", "function_statement$subexpression$1"], "postprocess":  (d) => {
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
        }},
    {"name": "param_list$ebnf$1", "symbols": []},
    {"name": "param_list$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "param"]},
    {"name": "param_list$ebnf$1", "symbols": ["param_list$ebnf$1", "param_list$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "param_list", "symbols": ["param", "param_list$ebnf$1"], "postprocess": d => [d[0], ...d[1].map(x => x[3])]},
    {"name": "param", "symbols": ["type", "__", "variable"], "postprocess": d => [d[0], new VariablePattern(d[2])]},
    {"name": "body$ebnf$1", "symbols": []},
    {"name": "body$ebnf$1", "symbols": ["body$ebnf$1", "statement"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "body", "symbols": ["body$ebnf$1"], "postprocess": (d) => new UnguardedBody(new Sequence(d[0]))},
    {"name": "expression", "symbols": ["addition"], "postprocess": (d) => d[0]},
    {"name": "addition", "symbols": ["addition", "_", {"literal":"+"}, "_", "multiplication"], "postprocess": (d) => new ArithmeticBinaryOperation("Plus", d[0], d[4])},
    {"name": "addition", "symbols": ["addition", "_", {"literal":"-"}, "_", "multiplication"], "postprocess": (d) => new ArithmeticBinaryOperation("Minus", d[0], d[4])},
    {"name": "addition", "symbols": ["multiplication"], "postprocess": (d) => d[0]},
    {"name": "multiplication", "symbols": ["multiplication", "_", {"literal":"*"}, "_", "primary"], "postprocess": (d) => new ArithmeticBinaryOperation("Multiply", d[0], d[4])},
    {"name": "multiplication", "symbols": ["multiplication", "_", {"literal":"/"}, "_", "primary"], "postprocess": (d) => new ArithmeticBinaryOperation("Divide", d[0], d[4])},
    {"name": "multiplication", "symbols": ["primary"], "postprocess": (d) => d[0]},
    {"name": "primary", "symbols": ["variable"], "postprocess": (d) => d[0]},
    {"name": "primary", "symbols": [{"literal":"("}, "_", "expression", "_", {"literal":")"}], "postprocess": (d) => d[2]},
    {"name": "primary", "symbols": ["primitive"], "postprocess": (d) => d[0]},
    {"name": "primitive", "symbols": [(MiniLexer.has("number") ? {type: "number"} : number)], "postprocess": (d) => new NumberPrimitive(Number(d[0].value))},
    {"name": "primitive", "symbols": [(MiniLexer.has("char") ? {type: "char"} : char)], "postprocess": (d) => new CharPrimitive(d[0].value)},
    {"name": "primitive", "symbols": ["variable"], "postprocess": (d) => d[0]},
    {"name": "primitive", "symbols": [(MiniLexer.has("string") ? {type: "string"} : string)], "postprocess": (d) => new StringPrimitive(d[0].value)},
    {"name": "primitive", "symbols": [(MiniLexer.has("bool") ? {type: "bool"} : bool)], "postprocess": (d) => new BooleanPrimitive(d[0].value)},
    {"name": "type", "symbols": ["variable"], "postprocess": (d) => new SimpleType(d[0].value, [])},
    {"name": "variable", "symbols": [(MiniLexer.has("variable") ? {type: "variable"} : variable)], "postprocess": (d) => new SymbolPrimitive(d[0].value)},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (MiniLexer.has("WS") ? {type: "WS"} : WS)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": d => null},
    {"name": "__$ebnf$1", "symbols": [(MiniLexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (MiniLexer.has("WS") ? {type: "WS"} : WS)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": d => null}
  ],
  ParserStart: "program",
};

export default grammar;
