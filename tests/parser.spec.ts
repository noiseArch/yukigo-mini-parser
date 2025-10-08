import { assert } from "chai";
import {
  ArithmeticBinaryOperation,
  Equation,
  NilPrimitive,
  ParameterizedType,
  Procedure,
  Return,
  Sequence,
  SimpleType,
  SymbolPrimitive,
  TypeSignature,
  UnguardedBody,
  Variable,
  VariablePattern,
  YukigoParser,
} from "yukigo-core";
import { YukigoMiniParser } from "../dist/index.js";

describe("Parser Tests", () => {
  let parser: YukigoParser;
  beforeEach(() => {
    parser = new YukigoMiniParser();
  });

  it("should parse assignment", () => {
    const code = `int n; int result;`;
    assert.deepEqual(parser.parse(code), [
      new Variable(
        new SymbolPrimitive("n"),
        new NilPrimitive(null),
        new SimpleType("int", [])
      ),
      new Variable(
        new SymbolPrimitive("result"),
        new NilPrimitive(null),
        new SimpleType("int", [])
      ),
    ]);
  });
  it("should parse function declaration", () => {
    const code = `int add(int x, int y) {
  int result := x + y;
  return result;
};`;
    assert.deepEqual(parser.parse(code), [
      new TypeSignature(
        new SymbolPrimitive("add"),
        new ParameterizedType(
          [new SimpleType("int", []), new SimpleType("int", [])],
          new SimpleType("int", []),
          []
        )
      ),
      new Procedure(new SymbolPrimitive("add"), [
        new Equation(
          [
            new VariablePattern(new SymbolPrimitive("x")),
            new VariablePattern(new SymbolPrimitive("y")),
          ],
          new UnguardedBody(
            new Sequence([
              new Variable(
                new SymbolPrimitive("result"),
                new ArithmeticBinaryOperation(
                  "Plus",
                  new SymbolPrimitive("x"),
                  new SymbolPrimitive("y")
                ),
                new SimpleType("int", [])
              ),
              new Return(new SymbolPrimitive("result")),
            ])
          )
        ),
      ]),
    ]);
  });
});
