// ==UserScript==
// @name         CCACM(Cookie Clicker Auto Closing MOD)
// @namespace    https://github.com/tybob8010/CCACM/
// @version      1.0.3
// @description  CookieClickerを自動で終了させるMOD。指定時間にセーブしてタブを閉じます。
// @author       tybob
// @match        https://orteil.dashnet.org/cookieclicker/
// @grant        window.close
// @run-at       document-idle
// @downloadURL  https://tybob8010.github.io/CCACM/CCACM.user.js
// @updateURL    https://tybob8010.github.io/CCACM/CCACM.user.js
// ==/UserScript==

(function() {
    'use strict';

    // 【重要】ブラウザの制限を突破するための「特権関数」をグローバルに公開
    // これを定義することで、外部の CCACM.js から呼び出してタブを閉じることが可能になります
    window.closeCCACM = function() {
        console.log("CCACM: Closing tab via Tampermonkey privilege...");
        window.close();
    };

    // Game オブジェクトが準備できたら LoadMod を実行する
    const loader = setInterval(function() {
        if (typeof Game !== 'undefined' && Game.ready && Game.LoadMod) {
            console.log("CCACM: Loading Mod via Game.LoadMod...");
            Game.LoadMod('https://tybob8010.github.io/CCACM/CCACM.js');
            clearInterval(loader);
        }
    }, 1000);
})();
