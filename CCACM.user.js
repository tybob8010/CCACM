// ==UserScript==
// @name         CCACM(Cookie Clicker Auto Closing MOD)
// @namespace    https://tybob8010.github.io/CCACM/
// @version      1.0.2
// @description  CookieClickerを自動で終了させるMOD。指定時間にセーブしてタブを閉じます。
// @author       tybob
// @match        https://orteil.dashnet.org/cookieclicker/
// @match        https://tybob8010.github.io/cookieclicker/
// @grant        window.close
// @grant        GM_closeWindow
// @run-at       document-start
// @require      https://tybob8010.github.io/CCACM/CCACM.js
// @downloadURL  https://tybob8010.github.io/CCACM/CCACM.user.js
// @updateURL    https://tybob8010.github.io/CCACM/CCACM.user.js
// ==/UserScript==

(function() {
    'use strict';

    // 本家サイトの制限を回避するための終了関数を定義
    // これを書いておけば、CCACM.js（本体）側から window.closeCCACM() で呼べます
    window.closeCCACM = function() {
        if (typeof GM_closeWindow !== "undefined") {
            GM_closeWindow(); // Tampermonkeyの特権で閉じる
        } else {
            window.open('', '_self');
            window.close();
        }
    };

    // 【重要】@require で読み込んでいる場合、すでに CCACM.js の中身は実行されています。
    // なので、ここで Game.LoadMod を重ねて書く必要はありません。
    // CCACM.js 側の「registerLoop」が自動的にゲームへの登録を行ってくれます。
    
    console.log("CCACM: UserScript wrapper loaded.");
})();
