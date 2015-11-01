# js勉強会 (4?)フロントエンドのテスト

## アジェンダ
* フロントエンドのテストの種類
* node.jsのテストとの違い
* 何故ブラウザテストが必要か？
* Try it!
* karma.conf.jsの中身
* broserifyされたモジュールのテスト

## フロントエンドのテストの種類
フロントエンドで行うテストは大きく分けて2種類ある。今回は単体/結合テストを行う。

### 単体/結合テスト
* JavaScriptをモジュール単位でテストする
* ブラウザ用テストランナー(testem or Karma)

### E2Eテスト
* 実際のユーザー動作、DOM Eventをエミュレートしてテストする
* ブラウザ自動化ツール(Selenium)

## node.jsのテストとの違い
フロントエンドの単体/結合テストでは、node.jsのテストで用いたテストフレームワーク/アサーションライブラリに加え、ブラウザ用テストランナー(testem/karma)が必要。これはnode.jsのテストと、ブラウザテストのスタックの違いがある。

### node.jsのテストスタック
前回までの勉強会で習った通り、node.jsのテストにはテストフレームワーク(mocha)と、アサーションライブラリ(power-assert)が必要。それら全てがnode.js上で動く仕組みになっている。

![](https://github.com/KeitaMoromizato/js-study-front-test/wiki/images/0_stack/1.png)

### ブラウザテストのスタック
一方ブラウザテストの場合、テストコード・テストターゲットがブラウザ上で動く。それらをブラウザ上で動かす＋結果をコンソール(node.js)上に表示する役割を果たすのがテストランナー(testem/karma)である。
テストランナーを起動すると以下のような処理が実行される。
1. ローカルサーバーが起動する
2. ブラウザが自動的に起動し、(1)で起動したサーバーにアクセス。テストコード・テストターゲットを取得
3. ブラウザ上でテストが実行され、その結果がsocket.ioを使用してローカルサーバー(karma)上に表示される

![](https://github.com/KeitaMoromizato/js-study-front-test/wiki/images/0_stack/2.png)

## 何故ブラウザテストが必要か？
node.jsとブラウザではJavaScriptの実行エンジンが違う。同じJavaScriptと言えど、node環境で動いていた物がブラウザで動くとは限らない。

例
* node v0.12ではES6の一部の機能(Set/Map)が使えるが、IE11/12では使えない
* うっかりnodeのAPI (process.nextTickとか)を使ってしまう

また、DOM操作もブラウザ上でしか出来ないので、フロントエンドのコードの信頼性を確認するためにはブラウザテストが必須。

## Try it!

本レポジトリをCloneします。

```
$ git clnoe https://github.com/KeitaMoromizato/js-study-front-test
$ npm install
```

以下のコマンドでテストを実行。ブラウザが起動し、テスト結果がコンソールに出たらOKです。

```
$ npm test
```

テストコマンドは`package.json`内で定義されています。今回はテストランナーにKarmaを使っています。 karmaがグローバルインストールされていれば `karma start`でも同じことですが、テストは基本的に誰の環境でも同じように動くことが求められているため、ローカルインストールされたKarmaを使用しています。

```
  "scripts": {
    "test": "./node_modules/karma/bin/karma start"
  },
```

テストの設定ファイルは全て`karma.conf.js`内に書かれています。詳しくは次の章で解説します。

## karma.conf.jsの中身

Karmaに関する設定はすべて`karma.conf.js`の中に書きます。karma実行時にオプションとしてconfファイルを渡してあげれば、別のファイル名にしても大丈夫です。もし空のプロジェクトから`karma.conf.js`を生成したい場合は、`karma init`コマンドを叩き、質問に答えていくことで自動的に作られます。

`karma.conf.js`の前に、今回使用しているnpmモジュールを確認します。ちょっと多いです。

```
  "devDependencies": {
    "babelify": "^7.0.2",
    "browserify": "^12.0.1",
    "espowerify": "^1.0.0",
    "karma": "^0.13.14",
    "karma-browserify": "^4.4.0",
    "karma-chrome-launcher": "^0.2.1",
    "karma-mocha": "^0.2.0",
    "mocha": "^2.3.3",
    "power-assert": "^1.1.0"
  }
```

それぞれのnpmモジュールの役割

|npm|description|
|---|---|
|browserify|フロント側でnpmモジュールの依存性解決|
|babelify|browserify時にbabelを使ってES5に変換|
|espowerify|browserify時にpower-assertの中間コードに変換|
|karma|ブラウザテストランナー|
|karma-browserify|karma実行時に、プリプロセッサとしてbrowserifyを実行|
|karma-chrome-launcher|chromeでテストを実行するためのモジュール|
|karma-mocha|karmaでmochaを使うためのモジュール|
|mocha|テストフレームワーク|
|power-assert|アサーションライブラリ|

どんなモジュールを使用しているか分かったところで、`karma.conf.js`の中身を見ていく。


### framework

`framework`にはnpmで使用しているkarma用framework(karama-xxxx)を指定します。`karma-chrome-launcher`は必要無かった。ちょっと理由はよく分からない。

```
  frameworks: ['mocha', 'browserify'],
```

### files

`files`にはテストターゲット、テストコードを記載する。

```
  files: [
    'src/**/*.js',
    'test/**/*.spec.js'
  ],
```

### preprocessors

`preprocessors`にはプリプロセッサを通したいファイルと、そのモジュールを指定する。今回はテストコードをCommonJS形式のモジュールを活用して書くので、browserifyを使用。

```
  preprocessors: {
    "test/**/*.spec.js": "browserify"
  },
```

### browserify

`preprocessors`でbrowserifyを使用することにしたので、その設定。今回はテストコードをES6で書けるようにし、アサーションに`power-assert`を使用するので`babelify`/`espowerify`を指定。


```
  browserify: {
    debug: true,
    transform: [
      'babelify',
      'espowerify'
    ]
   },
```

### browser

テストを走らせるブラウザを指定。複数指定した場合は同時に立ち上がる。ここにブラウザを追加したうえで、npmモジュールもインストールする必要があるので注意。

```
  browsers: ['Chrome'],
```

## broserifyされたモジュールのテスト

### browserifyとは？

browserifyしたからと言ってnode.jsのAPIはフロントでは使えない。あくまでも依存性解決のツール。

```
browserify !== node.jsのモジュール(npm)をブラウザ上でも使えるようにする
browserify === CommonJS形式のモジュールを、依存関係を解決したうえで展開してくれるツール
```

`package.json`にbrowserifyのビルドコマンドを定義。babelifyで依存性解決のついでにES5へ変換するが、そのときにオプションが必要。babel v6.xから構成が変更され、babel本体はシンプルになりプラグインを追加して動かす仕組みになった。なのでプラグインとして`babel-preset-es2015`を指定する。

```
"scripts": {
  "build": "./node_modules/browserify/bin/cmd.js -e scripts/index.js -t [ babelify --presets es2015 ] -o src/bundle.js"
}
```

### テスト

本当は、動作環境とテスト環境を出来る限り近づけるため、browserifyが展開された後の`bundle.js`をテストすべきだと思う。ただその方法が分からなかったので、browserifyが正確に依存性を展開してくれると期待して、モジュール単位のテストを行う。

試しに以下のコードをテストする。SNSとかによくある「〇〇日前」とかを表示するためのモジュール。

```scripts/modules/DateFormatter.js
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
```

あとはnode.jsのテストを書いた時と同じように、`require()`でモジュールを読み込んでテストを書いていく。今回は`karma`によりテストコードもbrowserifyで変換しているため、普通にrequireが使える。

```
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
```
