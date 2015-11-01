const assert = require('power-assert');

/**
 * サンプル
 */
describe("karma and mocha testing", () => {

  it ("return hello", (done) => {

    assert(hello() === "hello");

    done();
  });
});

/**
 * browserifyモジュールのテスト
 */
describe("DateFormatter test", () => {
  const DateFormatter = require('../scripts/modules/DateFormatter');
  const df = new DateFormatter();

  it("return seconds string", (done) => {
    const str = df.format(new Date('2015-01-01 00:00:10'), new Date('2015-01-01 00:00:00'));
    assert(str === '10秒前');
    done();
  });
});
