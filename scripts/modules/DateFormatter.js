'use strict';

class DateFormatter {
  // 2つの日付の差分を求める
  format(date1, date2) {
    const sec = (date1 - date2) / 1000;

    if (sec < 60) {
      return `${sec}秒前`;
    }
    else if (sec < 60 * 60) {
      return `${sec / 60}分前`;
    }
    else if (sec < 60 * 60 * 24) {
      return `${sec / 60 / 60}時間前`;
    }

    throw new Error('Invalid');
  }
}

module.exports = DateFormatter;
