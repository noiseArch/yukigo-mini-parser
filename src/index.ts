import { YukigoParser } from "yukigo-core";
import nearley from "nearley";
import grammar from "./grammar.js";

export class YukigoMiniParser implements YukigoParser {
  public errors: string[] = [];

  public parse(code: string) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    try {
      parser.feed(code);
      parser.finish();
    } catch (error) {
      console.log(error)
      const token = error.token;
      const message = `Unexpected '${token.type}' token '${token.value}' at line ${token.line} col ${token.col}.`;
      this.errors.push(message);
      throw Error(message);
    }
    return parser.results[0]
  }
}
