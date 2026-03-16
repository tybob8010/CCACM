// ==UserScript==
// @name         CCACM(Cookie Clicker Auto Closing MOD)
// @namespace    https://github.com/tybob8010/CCACM
// @version      1.0.1
// @description  CookieClickerを自動で終了させるMOD。指定時間になるとセーブしてタブを閉じます。
// @author       tybob
// @match        https://orteil.dashnet.org/cookieclicker/
// @grant        window.close
// @grant        GM_closeWindow
// @run-at       document-idle
// @downloadURL  https://tybob8010.github.io/CCACM/CCACM.user.js
// @updateURL    https://tybob8010.github.io/CCACM/CCACM.user.js
// ==/UserScript==

(function() {
    'use strict';

    // 本家サイトの制限を回避するための終了関数を定義
    window.closeCCACM = function() {
        if (typeof GM_closeWindow !== "undefined") {
            GM_closeWindow(); // Tampermonkeyの特権で閉じる
        } else {
            window.open('', '_self');
            window.close();
        }
    };

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
