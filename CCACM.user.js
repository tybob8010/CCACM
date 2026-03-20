// ==UserScript==
// @name         CCACM(Cookie Clicker Auto Closing MOD)
// @namespace    https://github.com/tybob8010/CCACM/
// @version      1.0.2
// @description  CookieClickerを自動で終了させるMOD。指定時間にセーブしてタブを閉じます。
// @author       tybob
// @match        https://orteil.dashnet.org/cookieclicker/
// @grant        window.close
// @run-at       document-start
// @require      https://tybob8010.github.io/CCACM/CCACM.js
// @downloadURL  https://tybob8010.github.io/CCACM/CCACM.user.js
// @updateURL    https://tybob8010.github.io/CCACM/CCACM.user.js
// ==/UserScript==

(function() {
    'use strict';

    // 【最重要】これがないと CCACM.js からの「閉じて」という命令が届きません
    window.closeCCACM = function() {
        console.log("CCACM: Closing tab via Tampermonkey privilege...");
        window.close();
    };

    // Game オブジェクトのロード監視
    const loader = setInterval(function() {
        if (typeof Game !== 'undefined' && Game.ready && Game.LoadMod) {
            // すでに @require で読み込まれていますが、念のため二重登録を防ぎつつ
            // ゲーム側に認識させるための処理が必要な場合があります
            console.log("CCACM: Game is ready.");
            clearInterval(loader);
        }
    }, 1000);
})();
