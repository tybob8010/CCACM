// ==UserScript==
// @name         CCACM (Cookie Clicker Auto Closing MOD)
// @namespace    https://github.com/tybob8010/CCACM/
// @version      1.0.3
// @description  CookieClickerを自動で終了させるMOD。指定時間にセーブしてタブを閉じます。
// @author       tybob
// @match        https://orteil.dashnet.org/cookieclicker/
// @grant        window.close
// @run-at       document-idle
// @require      https://tybob8010.github.io/CCACM/CCACM.js
// @downloadURL  https://tybob8010.github.io/CCACM/CCACM.user.js
// @updateURL    https://tybob8010.github.io/CCACM/CCACM.user.js
// ==/UserScript==

(function() {
    'use strict';

    // 【最重要】ブラウザの制限を突破するための「特権関数」をグローバルに公開
    // これにより、外部ファイルの CCACM.js からこの関数を呼ぶことでタブを閉じることが可能になります。
    window.closeCCACM = function() {
        console.log("CCACM: Closing tab via Tampermonkey privilege...");
        window.close();
    };

    // Gameのロード完了を監視してログを出す（デバッグ用）
    const checkReady = setInterval(function() {
        if (typeof Game !== 'undefined' && Game.ready) {
            console.log("CCACM: Game is ready. Mod should be initialized via @require.");
            clearInterval(checkReady);
        }
    }, 1000);
})();
