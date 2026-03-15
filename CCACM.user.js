// ==UserScript==
// @name         CCACM (Cookie Clicker Auto Closing Mod)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  CookieClickerを自動で終了させるMOD。指定時間にセーブしてタブを閉じます。
// @author       tybob
// @match        https://orteil.dashnet.org/cookieclicker/
// @grant        window.close
// @run-at       document-idle
// ==/UserScript==

(function() {
    // あなたのGitHub PagesのURL、またはRawのURLを指定
    const scriptUrl = 'https://tybob8010.github.io/CCACM/CCACM.js';
    
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.id = 'CCACM_script';
    document.head.appendChild(script);
})();