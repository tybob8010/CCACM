/*
    CCACM(Cookie Clicker Auto Closing MOD)
    v.1.0.0
    
    CookieClickerを自動で終了させるMOD。指定時間にセーブしてタブを閉じます。
    (c) 2026 tybob
    https://github.com/tybob8010/CCACM
*/

(function() {
    'use strict';

    // メインオブジェクト: CCACM (Cookie Clicker Auto Closing Mod)
    const CCACM = {
        name: 'CCACM',
        // デフォルト設定
        config: {
            enabled: 1,           // 自動終了機能のON/OFF (1: ON, 0: OFF)
            targetTime: "",  // 終了を実行する時刻
            lastExecutedDay: "",  // 二重実行防止用の日付記録
            lastExecutedTime: ""  // 二重実行防止用の時刻記録
        },

        // Modの初期化処理
        init: function() {
            // スタイルシートの生成と追加
            const style = document.createElement('style');
            style.innerHTML = `
                /* アイコンの揺れアニメーション（左右・極端） */
                @keyframes ccacmX_Extreme { from { left: -5px; } to { left: 5px; } }
                /* アイコンの跳ねアニメーション（上下・鋭い） */
                @keyframes ccacmY_Extreme { from { transform: translateY(0px); } to { transform: translateY(-7px); } }
                /* 背後Shineの回転アニメーション */
                @keyframes ccacmRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                /* 歯車アイコンのベースコンテナ */
                .ccacm-base {
                    position: absolute !important;
                    bottom: 50px !important;    /* 下からの高さ位置 */
                    right: 5px;                 /* 左セクション(sectionLeft)の右端からの距離 */
                    width: 48px;
                    height: 48px;
                    z-index: 1000000;           /* 他の要素より手前に表示 */
                    pointer-events: none;       /* 背後の要素へのクリックを邪魔しない */
                }

                /* アニメーションを適用するラッパー */
                .ccacm-icon-shaker {
                    position: absolute;
                    width: 48px;
                    height: 48px;
                    z-index: 10;
                    animation:
                        ccacmX_Extreme 0.6s infinite alternate ease-in-out,
                        ccacmY_Extreme 0.3s infinite alternate ease-in-out;
                    pointer-events: none;
                }

                /* 歯車アイコン本体の設定（ゲーム内のicons.pngを利用） */
                #ccacm_icon {
                    width: 48px !important;
                    height: 48px !important;
                    background: url(img/icons.png) ${-4 * 48}px ${-0 * 48}px !important; /* 歯車の絵柄を指定[4,0] */
                    cursor: pointer !important;
                    filter: drop-shadow(0px 0px 4px #000) !important;
                    position: relative;
                    z-index: 20;
                    pointer-events: auto;       /* アイコン自体はクリック可能にする */
                    transition: filter 0.1s ease-out;
                }

                /* ホバー時に光らせる演出 */
                #ccacm_icon:hover {
                    filter: drop-shadow(0px 0px 6px rgba(255,255,255,0.7)) brightness(1.0) !important;
                }

                /* アイコン背後の回転する光(shine.png) */
                #ccacm_shine {
                    position: absolute;
                    width: 60px;
                    height: 60px;
                    top: -10px;
                    left: -5px;
                    background: url(img/shine.png) no-repeat center;
                    background-size: contain;
                    z-index: 1;
                    opacity: 0;                 /* 通常時は透明 */
                    animation: ccacmRotate 20s infinite linear;
                    pointer-events: none;
                }

                /* 歯車にマウスを乗せた時だけ背後のShineを表示（ふわっと浮き出る） */
                .ccacm-base:has(#ccacm_icon:hover) #ccacm_shine {
                    opacity: 0.6;
                    transition: opacity 0.3s ease-out;
                }
            `;
            document.head.appendChild(style);

            // 1秒おきに時刻をチェックするループ
            setInterval(() => {
                if (!this.config.enabled) return; // 無効時は何もしない
                
                const now = new Date();
                const todayStr = now.toLocaleDateString();
                const currentTimeStr = now.getHours().toString().padStart(2, '0') + ":" +
                                     now.getMinutes().toString().padStart(2, '0');

                // すでに本日、指定時刻に実行済みならスキップ（多重実行防止）
                if (this.config.lastExecutedDay === todayStr &&
                    this.config.lastExecutedTime === this.config.targetTime) return;

                // 指定時刻に到達した場合の処理
                if (currentTimeStr === this.config.targetTime) {
                    this.config.lastExecutedDay = todayStr;
                    this.config.lastExecutedTime = this.config.targetTime;
                    
                    // ゲームをセーブ
                    Game.WriteSave();
                    // 通知を表示
                    Game.Notify('自動終了', '設定時刻です。終了します。', [23, 11], 3); // パンテオンの効果延長の画像
                    
                    // 2秒の猶予を持たせてからタブを閉じる、または空白ページへ移動
                    setTimeout(() => {
                        window.open('', '_self');
                        window.close();
                        setTimeout(() => { if (!window.closed) window.location.replace("about:blank"); }, 2000);
                    }, 2000);
                }
            }, 1000);

            this.prepareIcon();
        },

        // アイコン要素を生成して画面に配置する関数
        prepareIcon: function() {
            if (l('ccacm_base')) return; // 二重生成防止
            
            const target = l('sectionLeft'); // クッキーがある左側の画面エリア
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

                // マウスホバーでツールチップ（説明文）を表示
                icon.onmouseover = () => {
                    Game.tooltip.draw(icon, '<div style="padding:8px;width:180px;text-align:center;"><b>CCACM 設定</b><br>クリックで設定画面を開く</div>', 'this');
                };
                icon.onmouseout = () => { Game.tooltip.hide(); };
                
                // クリックで設定用ダイアログを表示
                icon.onclick = (e) => {
                    PlaySound('snd/tick.mp3');
                    this.openConfigPrompt();
                    e.preventDefault();
                    e.stopPropagation();
                };

                // 要素を組み立てて追加
                shaker.appendChild(icon);
                base.appendChild(shine);
                base.appendChild(shaker);
                target.appendChild(base);
            } else {
                // まだゲーム画面がロードされていない場合は1秒待機して再試行
                setTimeout(() => this.prepareIcon(), 1000);
            }
        },

        // 設定画面（プロンプト）の生成
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

        // 自動終了の有効/無効を切り替える関数
        toggleEnabled: function() {
            this.config.enabled = !this.config.enabled;
            PlaySound('snd/tick.mp3');
            const btn = l('ccacm_toggle_btn');
            if (btn) {
                btn.className = `smallFancyButton option ${this.config.enabled ? 'on' : 'off'}`;
                btn.innerText = `自動終了: ${this.config.enabled ? 'ON' : 'OFF'}`;
            }
            Game.WriteSave();
            Game.Notify(`自動終了${this.config.enabled ? '有効' : '無効'}化`, `自動終了が${this.config.enabled ? '有効' : '無効'}になりました。`, [1, 7], 0.75); // 「!」の画像
        },

        // 設定時刻を更新する関数
        updateTime: function(val) {
            if (!val) return;
            this.config.targetTime = val;
            Game.Notify('時刻保存', '終了時刻を ' + val + ' にセットしました。', [8, 35], 2); // タイムマシンの天界アプグレの画像
            Game.WriteSave();
        },

        // ゲームのセーブデータへの書き出し
        save: function() { return JSON.stringify(this.config); },
        // ゲームのセーブデータからの読み込み
        load: function(str) {
            if (str) {
                try {
                    const loaded = JSON.parse(str);
                    this.config = Object.assign(this.config, loaded);
                } catch(e) {}
            }
        }
    };

    // Gameオブジェクトが利用可能になるまで待機してModを登録
    const registerLoop = setInterval(() => {
        if (typeof Game !== 'undefined' && Game.ready) {
            Game.registerMod(CCACM.name, CCACM);
            clearInterval(registerLoop);
        }
    }, 1000);
})();