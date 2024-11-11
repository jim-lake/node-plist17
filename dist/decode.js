"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = decode;
const BPLIST17 = Buffer.from("bplist17", "ascii");
function decode(buffer) {
  let ret;
  if (buffer.length < BPLIST17.length) {
    throw new Error("invalid bplist");
  }
  if (buffer.compare(BPLIST17, 0, BPLIST17.length, 0, BPLIST17.length) !== 0) {
    throw new Error("invalid bplist");
  } else {
    const pos = BPLIST17.length;
    ret = _toObj(buffer.subarray(pos), pos)[0];
  }
  return ret;
}
function _toObj(buf, start) {
  let obj;
  let next = start;
  const buf0 = buf.readUInt8();
  const type = buf0 & 0xf0;
  const head_len = buf0 & 0x0f;
  switch (type) {
    case 0x10:
      switch (head_len) {
        case 0x01:
          obj = buf.readInt8(1);
          next += 2;
          break;
        case 0x02:
          obj = buf.readInt16LE(1);
          next += 3;
          break;
        case 0x04:
          obj = buf.readInt32LE(1);
          next += 5;
          break;
        default:
          throw new Error("unsupported type");
      }
      break;
    case 0x60:
      [obj, next] = _readStr(buf, start, head_len, 2, "utf16le");
      break;
    case 0x70:
      [obj, next] = _readStr(buf, start, head_len, 1, "ascii");
      break;
    case 0xa0:
      {
        const end = Number(buf.readBigUInt64LE(1));
        let pos = start + 9;
        obj = [];
        while (pos <= end) {
          const value = _toObj(buf.subarray(pos - start), pos);
          obj.push(value[0]);
          pos = value[1];
        }
        next = end + 1;
      }
      break;
    case 0xe0:
      obj = null;
      next++;
      break;
    default:
      throw new Error("unsupported type");
  }
  return [obj, next];
}
function _readStr(buf, start, head_len, char_len, encoding) {
  let str_len = head_len;
  let end = start + 1;
  if (str_len === 0x0f) {
    [str_len, end] = _toObj(buf.subarray(1), end);
  }
  const str_start = end - start;
  const byte_len = str_len * char_len;
  const str_end = str_start + byte_len - (encoding === "ascii" ? 1 : 0);
  const obj = buf.subarray(str_start, str_end).toString(encoding);
  end += byte_len;
  return [obj, end];
}
//# sourceMappingURL=decode.js.map
