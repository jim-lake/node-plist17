declare class StringAscii {
  str: string;
  constructor(str: string);
  toString(): string;
}
export declare function ascii(strings: string[], ...args: any[]): StringAscii;
export declare function encode(obj: any): Buffer;
export {};
