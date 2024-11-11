"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ascii = exports.encode = exports.decode = void 0;
const decode_1 = require("./decode");
const encode_1 = require("./encode");
var decode_2 = require("./decode");
Object.defineProperty(exports, "decode", {
  enumerable: true,
  get: function () {
    return decode_2.decode;
  },
});
var encode_2 = require("./encode");
Object.defineProperty(exports, "encode", {
  enumerable: true,
  get: function () {
    return encode_2.encode;
  },
});
Object.defineProperty(exports, "ascii", {
  enumerable: true,
  get: function () {
    return encode_2.ascii;
  },
});
exports.default = {
  decode: decode_1.decode,
  encode: encode_1.encode,
  ascii: encode_1.ascii,
};
//# sourceMappingURL=index.js.map
