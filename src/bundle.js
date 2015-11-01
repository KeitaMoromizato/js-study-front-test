(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./modules/DateFormatter');

},{"./modules/DateFormatter":2}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DateFormatter = (function () {
  function DateFormatter() {
    _classCallCheck(this, DateFormatter);
  }

  _createClass(DateFormatter, [{
    key: 'format',

    // 2つの日付の差分を求める
    value: function format(date1, date2) {
      var sec = (date1 - date2) / 1000;

      if (sec < 60) {
        return sec + '秒前';
      } else if (sec < 60 * 60) {
        return sec / 60 + '分前';
      } else if (sec < 60 * 60 * 24) {
        return sec / 60 / 60 + '時間前';
      }

      throw new Error('Invalid');
    }
  }]);

  return DateFormatter;
})();

module.exports = DateFormatter;

},{}]},{},[1]);
