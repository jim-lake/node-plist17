const { expect } = require('chai');
const { decode, encode, ascii } = require('../dist');

const OBJ_RESPONSE = Buffer.from(
  '62706c6973743137a02900000000000000e07576403f4000a029000000000000006470006f006e006700',
  'hex'
);
const OBJ_SEND = Buffer.from(
  '62706c6973743137a050000000000000007f111173617665446576696365546f6b656e3a007b76323440303a3840313600a050000000000000006b74006f006b0065006e00740065007300740065007200',
  'hex'
);
const OBJ_SEND_WITH_REPLY = Buffer.from(
  '62706c6973743137a048000000000000007f111070696e673a776974685265706c793a007f110f76333240303a38403136403f323400a048000000000000006466006f006f003500e0',
  'hex'
);
const OBJ_WITH_BOOL = Buffer.from(
  '62706c6973743137a02100000000000000e07576403f4200a02100000000000000c0',
  'hex'
);
const OBJ_WITH_TRUE = Buffer.from(
  '62706c6973743137a02100000000000000e07576403f4200a02100000000000000b0',
  'hex'
);

const OBJ_LONG_STRING = Buffer.from(
  '62706c6973743137a09701000000000000786368616e67653a007b76323440303a3840313600a097010000000000006f11b32f0056006f006c0075006d00650073002f00440061007400610032002f0031003200330034003500360037003800390030003100320033003400350036003700380039003000310032003300340035003600370038003900300031003200330034003500360037003800390030003100320033003400350036003700380039003000310032003300340035003600370038003900300031003200330034003500360037003800390030003100320033003400350036003700380039003000310032003300340035003600370038003900300031003200330034003500360037003800390030003100320033003400350036003700380039003000310032003300340035003600370038003900300031003200330034003500360037003800390030003100320033003400350036003700380039003000310032003300340035003600370038003900300031003200330034003500360037003800390030002e00740078007400',
  'hex'
);

const INVALID = Buffer.from('1111', 'hex');
const UNSUPPORTED = Buffer.from('62706c6973743137d0', 'hex');

describe('ascii', function () {
  it('simple', function () {
    const obj = ascii`this is a string`;
    expect(obj.str).to.equal('this is a string');
  });
  it('start', function () {
    const obj = ascii`${0}this is a string`;
    expect(obj.str).to.equal('0this is a string');
  });
  it('end', function () {
    const obj = ascii`${0}this is a string`;
    expect(obj.str).to.equal('0this is a string');
  });
  it('undefined', function () {
    const obj = ascii`${undefined}this is a string${undefined}`;
    expect(obj.str).to.equal('undefinedthis is a stringundefined');
  });
  it('all', function () {
    const obj = ascii`${0}this${1}is${'foo'}a${8}string${9}`;
    expect(obj.str).to.equal('0this1isfooa8string9');
  });
});
describe('decoder', function () {
  it('bad header', function () {
    expect(decode.bind(null, INVALID)).to.throw('invalid bplist');
  });
  it('objc response', function () {
    const ret = decode(OBJ_RESPONSE);
    const expected_ret = [null, 'v@?@', ['pong']];
    expect(deepEqual(ret, expected_ret));
    expect(ret).to.deep.equal(expected_ret);
  });
  it('obj send', function () {
    const ret = decode(OBJ_SEND);
    const expected_ret = ['saveDeviceToken:', 'v24@0:8@16', ['tokentester']];
    expect(deepEqual(ret, expected_ret));
    expect(ret).to.deep.equal(expected_ret);
  });
  it('obj send with reply', function () {
    const ret = decode(OBJ_SEND_WITH_REPLY);
    const expected_ret = ['ping:withReply:', 'v32@0:8@16@?24', ['foo5', null]];
    expect(deepEqual(ret, expected_ret));
    expect(ret).to.deep.equal(expected_ret);
  });
  it('obj with bool', function () {
    const ret = decode(OBJ_WITH_BOOL);
    const expected_ret = [null, 'v@?B', [false]];
    expect(deepEqual(ret, expected_ret));
    expect(ret).to.deep.equal(expected_ret);
  });
  it('obj with true', function () {
    const ret = decode(OBJ_WITH_TRUE);
    const expected_ret = [null, 'v@?B', [true]];
    expect(deepEqual(ret, expected_ret));
    expect(ret).to.deep.equal(expected_ret);
  });
  it('unsupported type', function () {
    expect(decode.bind(null, UNSUPPORTED)).to.throw('unsupported type: 0xd0');
  });
  it('OBJ_LONG_STRING not throw', function () {
    expect(decode.bind(null, OBJ_LONG_STRING)).to.not.throw();
  });
});
describe('encoder', function () {
  it('obj response', function () {
    const obj = [null, ascii`v@?@`, ['pong']];
    expect(encode(obj)).to.deep.equal(OBJ_RESPONSE);
  });
  it('obj send', function () {
    const obj = [ascii`saveDeviceToken:`, ascii`v24@0:8@16`, ['tokentester']];
    expect(encode(obj)).to.deep.equal(OBJ_SEND);
  });
  it('obj send with reply', function () {
    const obj = [ascii`ping:withReply:`, ascii`v32@0:8@16@?24`, ['foo5', null]];
    expect(encode(obj)).to.deep.equal(OBJ_SEND_WITH_REPLY);
  });
  it('obj with bool', function () {
    const obj = [null, ascii`v@?B`, [false]];
    expect(encode(obj)).to.deep.equal(OBJ_WITH_BOOL);
  });
  it('obj with true', function () {
    const obj = [null, ascii`v@?B`, [true]];
    expect(encode(obj)).to.deep.equal(OBJ_WITH_TRUE);
  });
  it('unsupported type object', function () {
    const obj = [{ foo: true }];
    expect(encode.bind(null, obj)).to.throw('unsupported plist type: object');
  });
  it('unsupported type float', function () {
    const obj = [0.5];
    expect(encode.bind(null, obj)).to.throw('unsupported plist type: number');
  });
});
function deepEqual(x, y) {
  if (x === y) {
    return true;
  } else if (x === null || y === null) {
    return false;
  } else {
    if (typeof x === 'object' && typeof y === 'object') {
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
