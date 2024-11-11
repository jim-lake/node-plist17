const { expect } = require("chai");
const { decode, encode, ascii } = require("../dist");

const OBJ_RESPONSE = Buffer.from(
  "62706c6973743137a02900000000000000e07576403f4000a029000000000000006470006f006e006700",
  "hex",
);
const OBJ_SEND = Buffer.from(
  "62706c6973743137a050000000000000007f111173617665446576696365546f6b656e3a007b76323440303a3840313600a050000000000000006b74006f006b0065006e00740065007300740065007200",
  "hex",
);
const OBJ_SEND_WITH_REPLY = Buffer.from(
  "62706c6973743137a048000000000000007f111070696e673a776974685265706c793a007f110f76333240303a38403136403f323400a048000000000000006466006f006f003500e0",
  "hex",
);

const INVALID = Buffer.from("1111", "hex");

describe("ascii", function () {
  it("simple", function () {
    const obj = ascii`this is a string`;
    expect(obj.str).to.equal("this is a string");
  });
  it("start", function () {
    const obj = ascii`${0}this is a string`;
    expect(obj.str).to.equal("0this is a string");
  });
  it("end", function () {
    const obj = ascii`${0}this is a string`;
    expect(obj.str).to.equal("0this is a string");
  });
  it("undefined", function () {
    const obj = ascii`${undefined}this is a string${undefined}`;
    expect(obj.str).to.equal("undefinedthis is a stringundefined");
  });
  it("all", function () {
    const obj = ascii`${0}this${1}is${"foo"}a${8}string${9}`;
    expect(obj.str).to.equal("0this1isfooa8string9");
  });
});
describe("decoder", function () {
  it("bad header", function () {
    expect(decode.bind(null, INVALID)).to.throw("invalid bplist");
  });
  it("objc response", function () {
    const ret = decode(OBJ_RESPONSE);
    const expected_ret = [null, "v@?@", ["pong"]];
    expect(deepEqual(ret, expected_ret));
    expect(ret).to.deep.equal(expected_ret);
  });
  it("obj send", function () {
    const ret = decode(OBJ_SEND);
    const expected_ret = ["saveDeviceToken:", "v24@0:8@16", ["tokentester"]];
    expect(deepEqual(ret, expected_ret));
    expect(ret).to.deep.equal(expected_ret);
  });
  it("obj send with reply", function () {
    const ret = decode(OBJ_SEND_WITH_REPLY);
    const expected_ret = ["ping:withReply:", "v32@0:8@16@?24", ["foo5", null]];
    expect(deepEqual(ret, expected_ret));
    expect(ret).to.deep.equal(expected_ret);
  });
});
describe("encoder", function () {
  it("obj response", function () {
    const obj = [null, ascii`v@?@`, ["pong"]];
    expect(encode(obj)).to.deep.equal(OBJ_RESPONSE);
  });
  it("obj send", function () {
    const obj = [ascii`saveDeviceToken:`, ascii`v24@0:8@16`, ["tokentester"]];
    expect(encode(obj)).to.deep.equal(OBJ_SEND);
  });
  it("obj send with reply", function () {
    const obj = [ascii`ping:withReply:`, ascii`v32@0:8@16@?24`, ["foo5", null]];
    expect(encode(obj)).to.deep.equal(OBJ_SEND_WITH_REPLY);
  });
});
function deepEqual(x, y) {
  if (x === y) {
    return true;
  } else if (x === null || y === null) {
    return false;
  } else {
    if (typeof x === "object" && typeof y === "object") {
      for (let p in x) {
        if (Object.prototype.hasOwnProperty.call(x, p)) {
          if (!Object.prototype.hasOwnProperty.call(y, p)) {
            return false;
          } else if (!deepEqual(x[p], y[p])) {
            return false;
          }
        }
      }

      for (let p in y) {
        if (
          Object.prototype.hasOwnProperty.call(y, p) &&
          !Object.prototype.hasOwnProperty.call(x, p)
        ) {
          return false;
        }
      }
    } else {
      return false;
    }
    return true;
  }
}
