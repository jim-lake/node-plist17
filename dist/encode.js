"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ascii = ascii;
exports.encode = encode;
const BPLIST17 = Buffer.from("bplist17", "ascii");
const VALUE_NULL = Buffer.from("e0", "hex");
class StringAscii {
  constructor(str) {
    this.str = str;
  }
  toString() {
    return this.str;
  }
}
function ascii(strings, ...args) {
  let full = "";
  for (let i = 0; i < strings.length; i++) {
    full += strings[i];
    if (args.length > i) {
      full += String(args[i]);
    }
  }
  return new StringAscii(full);
}
function encode(obj) {
  const contents = _fromObj(obj, BPLIST17.length);
  return Buffer.concat([BPLIST17, contents]);
}
function _fromObj(obj, start) {
  let ret;
  if (obj === null) {
    ret = VALUE_NULL;
  } else if (Array.isArray(obj)) {
    const header = Buffer.alloc(9);
    header.writeUInt8(0xa0, 0);
    let pos = start + header.length;
    const parts = obj.map((item) => {
      const ret = _fromObj(item, pos);
      pos += ret.length;
      return ret;
    });
    header.writeBigUInt64LE(BigInt(pos - 1), 1);
    ret = Buffer.concat([header, ...parts]);
  } else if (obj instanceof StringAscii) {
    const str = obj.str + "\0";
    const header = _strHeader(str, 0x70);
    ret = Buffer.concat([header, Buffer.from(str, "ascii")]);
  } else if (typeof obj === "string") {
    const header = _strHeader(obj, 0x60);
    ret = Buffer.concat([header, Buffer.from(obj, "utf16le")]);
  } else if (Number.isInteger(obj)) {
    if (obj > 0x7fff) {
      ret = Buffer.alloc(5);
      ret.writeUInt8(0x14);
      ret.writeInt32LE(obj, 1);
    } else if (obj > 0x7f) {
      ret = Buffer.alloc(3);
      ret.writeInt8(0x12);
      ret.writeInt16LE(obj, 1);
    } else if (obj > 0) {
      ret = Buffer.alloc(2);
      ret.writeUInt8(0x11);
      ret.writeInt8(obj, 1);
    } else {
      throw new Error("unsupported plist value");
    }
  } else {
    throw new Error("unsupported plist value");
  }
  return ret;
}
function _strHeader(str, type) {
  const header = Buffer.alloc(1);
  let ret = header;
  if (str.length > 0x0e) {
    header.writeUInt8(type | 0x0f);
    ret = Buffer.concat([header, _fromObj(str.length, 0)]);
  } else {
    ret.writeUInt8(type | str.length);
  }
  return ret;
}
//# sourceMappingURL=encode.js.map
