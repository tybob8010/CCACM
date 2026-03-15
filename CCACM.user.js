// ==UserScript==
// @name         CCACM(Cookie Clicker Auto Closing MOD)
// @namespace    https://tybob8010.github.io/CCACM/
// @version      1.0.0
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
    // 本体ファイルを公式のLoadModで読み込む
    if (typeof Game !== 'undefined' && Game.ready) {
        Game.LoadMod('https://tybob8010.github.io/CCACM/CCACM.js');
    } else {
        const checkReady = setInterval(function() {
            if (typeof Game !== 'undefined' && Game.ready) {
                Game.LoadMod('https://tybob8010.github.io/CCACM/CCACM.js');
                clearInterval(checkReady);
            }
        }, 1000);
    }
})();
