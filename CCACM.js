/*
    CCACM(Cookie Clicker Auto Closing MOD)
    v.1.0.3_pre

    CookieClickerを自動で終了させるMOD。指定時間にセーブしてタブを閉じます。
    (c) 2026 tybob
    https://github.com/tybob8010/CCACM
*/

(function() {
    'use strict';

    const CCACM = {
        name: 'CCACM',
        config: {
            enabled: 1,
            targetTime: "",
            lastExecutedDay: "",
            lastExecutedTime: ""
        },

        init: function() {
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes ccacmX_Extreme { from { left: -5px; } to { left: 5px; } }
                @keyframes ccacmY_Extreme { from { transform: translateY(0px); } to { transform: translateY(-7px); } }
                @keyframes ccacmRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .ccacm-base {
                    position: absolute !important;
                    bottom: 50px !important;
                    right: 5px;
                    width: 48px;
                    height: 48px;
                    z-index: 1000000;
                    pointer-events: none;
                }
                .ccacm-icon-shaker {
                    position: absolute;
                    width: 48px;
                    height: 48px;
                    z-index: 10;
                    animation: ccacmX_Extreme 0.6s infinite alternate ease-in-out, ccacmY_Extreme 0.3s infinite alternate ease-in-out;
                    pointer-events: none;
                }
                #ccacm_icon {
                    width: 48px !important;
                    height: 48px !important;
                    background: url(img/icons.png) ${-4 * 48}px ${-0 * 48}px !important;
                    cursor: pointer !important;
                    filter: drop-shadow(0px 0px 4px #000) !important;
                    position: relative;
                    z-index: 20;
                    pointer-events: auto;
                    transition: filter 0.1s ease-out;
                }
                #ccacm_icon:hover {
                    filter: drop-shadow(0px 0px 6px rgba(255,255,255,0.7)) brightness(1.0) !important;
                }
                #ccacm_shine {
                    position: absolute;
                    width: 60px;
                    height: 60px;
                    top: -10px;
                    left: -5px;
                    background: url(img/shine.png) no-repeat center;
                    background-size: contain;
                    z-index: 1;
                    opacity: 0;
                    animation: ccacmRotate 20s infinite linear;
                    pointer-events: none;
                }
                .ccacm-base:has(#ccacm_icon:hover) #ccacm_shine {
                    opacity: 0.6;
                    transition: opacity 0.3s ease-out;
                }
            `;
            document.head.appendChild(style);

            setInterval(() => {
                if (!this.config.enabled) return;

                const now = new Date();
                const todayStr = now.toLocaleDateString();
                const currentTimeStr = now.getHours().toString().padStart(2, '0') + ":" +
                                    now.getMinutes().toString().padStart(2, '0');

                if (this.config.lastExecutedDay === todayStr &&
                    this.config.lastExecutedTime === this.config.targetTime) return;

                if (currentTimeStr === this.config.targetTime && this.config.targetTime !== "") {
                    this.config.lastExecutedDay = todayStr;
                    this.config.lastExecutedTime = this.config.targetTime;

                    Game.WriteSave();
                    Game.Notify('自動終了', '設定時刻です。保存して終了します。', [23, 11], 3);

                    setTimeout(() => {
                        Game.WriteSave();

                        // 1. ブックマークレットが用意した「強制終了関数」を最優先実行
                        if (typeof window.FORCE_CLOSE_TAB === 'function') {
                            console.log("CCACM: Closing via Bookmarklet authority...");
                            window.FORCE_CLOSE_TAB();
                        } 
                        // 2. Tampermonkeyの特権関数を実行
                        else if (typeof window.closeCCACM === 'function') {
                            console.log("CCACM: Closing via Tampermonkey authority...");
                            window.closeCCACM();
                        } 
                        // 3. 一般的なクローズ試行
                        else {
                            console.log("CCACM: Attempting standard window.close...");
                            window.open('', '_self');
                            window.close();
                            
                            // 閉じれなかった場合の通知
                            setTimeout(() => {
                                if (!window.closed) {
                                    Game.Notify('終了失敗', 'ブラウザの制限により閉じられませんでした。手動で閉じてください。', [1, 7], 10);
                                }
                            }, 1000);
                        }
                    }, 2000);
                }
            }, 1000);

            this.prepareIcon();
        },

        prepareIcon: function() {
            if (l('ccacm_base')) return;
            const target = l('sectionLeft');
            if (target) {
                const base = document.createElement('div');
                base.id = 'ccacm_base';
                base.className = 'ccacm-base';
                const shine = document.createElement('div');
                shine.id = 'ccacm_shine';
                const shaker = document.createElement('div');
                shaker.className = 'ccacm-icon-shaker';
                const icon = document.createElement('div');
                icon.id = 'ccacm_icon';
                icon.onmouseover = () => {
                    Game.tooltip.draw(icon, '<div style="padding:8px;width:180px;text-align:center;"><b>CCACM 設定</b><br>クリックで設定画面を開く</div>', 'this');
                };
                icon.onmouseout = () => { Game.tooltip.hide(); };
                icon.onclick = (e) => {
                    PlaySound('snd/tick.mp3');
                    this.openConfigPrompt();
                    e.preventDefault();
                    e.stopPropagation();
                };
                shaker.appendChild(icon);
                base.appendChild(shine);
                base.appendChild(shaker);
                target.appendChild(base);
            } else {
                setTimeout(() => this.prepareIcon(), 1000);
            }
        },

        openConfigPrompt: function() {
            let content = `
                <h3>CCACM 自動終了設定</h3>
                <div class="block" style="text-align:center;">
                    <div class="listing">
                        <a class="smallFancyButton option ${this.config.enabled ? 'on' : 'off'}" id="ccacm_toggle_btn"
                        onclick="Game.mods['CCACM'].toggleEnabled();">
                            自動終了: ${this.config.enabled ? 'ON' : 'OFF'}
                        </a>
                    </div>
                    <div class="listing" style="margin-top:10px;">
                        <label>終了時刻を設定:</label><br>
                        <input type="time" id="CCACM_prompt_input" value="${this.config.targetTime}"
                            style="background: #000; color: #fff; border: 1px solid #444; padding: 4px; font-size: 18px; cursor: pointer; margin-top:5px;">
                    </div>
                </div>
            `;
            Game.Prompt(content, [
                ['保存', 'Game.mods["CCACM"].updateTime(l("CCACM_prompt_input").value); Game.ClosePrompt();'],
                '閉じる'
            ]);
        },

        toggleEnabled: function() {
            this.config.enabled = !this.config.enabled;
            PlaySound('snd/tick.mp3');
            const btn = l('ccacm_toggle_btn');
            if (btn) {
                btn.className = `smallFancyButton option ${this.config.enabled ? 'on' : 'off'}`;
                btn.innerText = `自動終了: ${this.config.enabled ? 'ON' : 'OFF'}`;
            }
            Game.WriteSave();
            Game.Notify(`自動終了${this.config.enabled ? '有効' : '無効'}化`, `自動終了が${this.config.enabled ? '有効' : '無効'}になりました。`, [1, 7], 0.75);
        },

        updateTime: function(val) {
            if (!val) return;
            this.config.targetTime = val;
            Game.Notify('時刻保存', '終了時刻を ' + val + ' にセットしました。', [8, 35], 2);
            Game.WriteSave();
        },

        save: function() { return JSON.stringify(this.config); },
        load: function(str) {
            if (str) {
                try {
                    const loaded = JSON.parse(str);
                    this.config = Object.assign(this.config, loaded);
                } catch(e) {}
            }
        }
    };

    const registerMod = () => {
        if (typeof Game !== 'undefined' && Game.ready && Game.registerMod) {
            Game.registerMod(CCACM.name, CCACM);
        } else {
            setTimeout(registerMod, 500);
        }
    };
    registerMod();
})();
