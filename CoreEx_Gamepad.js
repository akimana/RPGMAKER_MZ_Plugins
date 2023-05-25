/*:
 * @target MZ
 * @plugindesc Vibrate Game Controller
 * @author Akitoshi Manabe
 * @url
 * @lisense MIT
 * @help Version 1.0.0
 *
 * Useage:
 *   1. Call the plugin command "Vibrate Gamepad".
 *   2. Execute "playEffect".
 *   Preset to common event and call that others.
 *
 * Limitations:
 *   Web deploy is not supported.
 *   1. Firefox was not supported.
 *   2. It may become unusable if the version of nwjs changes.
 * 
 * For experimental implementation in WebAPI specification
 *   Cancellation does not work.
 *   It is easy to handle if you set the vibration "duration" modestly
 * 
 * via: MDN
 * https://developer.mozilla.org/ja/docs/Web/API/Gamepad/vibrationActuator
 *
 * @command playEffect
 * @text Viberate Gamepad
 *
 * @arg startDelay
 * @type number
 * @default 0
 * 
 * @arg duration
 * @type number
 * @default 600
 * 
 * @arg weakMagnitude
 * @type number
 * @default 0.4
 * @decimals 1
 * 
 * @arg strongMagnitude
 * @type number
 * @default 0.6
 * @decimals 1
 */

/*:ja
 * @target MZ
 * @plugindesc ゲームコントローラを振動させるプラグイン
 * @author Akitoshi Manabe
 * @url
 * @lisense MIT
 * @help Version 1.0.0
 * 
 * 使い方：
 * イベントの実行内容を編集時
 * 1. イベントコマンドで本プラグインを呼び出します。
 * 2. 必要に応じて引数を変更してください。
 * プリセット：コモンイベントに登録して個別イベントで呼び出します。
 *
 * 制限:
 * web デプロイはサポートしていません。
 * 1. Firefox は対象外
 * 2. nwjs バージョンが変わると使えなくなる可能性があります。
 * 
 * WebAPI仕様に関連して試験的実装のため
 * 振動アクチュエータの上書きができないようです。キャンセルが効きませんので
 * 振動継続時間(duration)を控えめに設定しておくと扱いやすいです。
 * 
 * 参考：MDN
 * https://developer.mozilla.org/ja/docs/Web/API/Gamepad/vibrationActuator
 * 
 * @command playEffect
 * @text 振動する
 * @desc フォースフィードバックを実行するコマンドです。
 *
 * @arg startDelay
 * @type number
 * @default 0
 * @text 開始待ち時間(msec)
 * @desc コマンド発動して振動開始するまでの遅延時間（msec）
 * 
 * @arg duration
 * @type number
 * @default 600
 * @text 振動継続時間(msec)
 * @desc コマンド発動により振動する時間
 * 
 * @arg weakMagnitude
 * @type number
 * @default 0.4
 * @decimals 1
 * @text 弱振動値
 * @desc 体感できる値をデフォルトにしています。
 * 
 * @arg strongMagnitude
 * @type number
 * @default 0.6
 * @decimals 1
 * @text 強振動値
 * @desc 体感できる値をデフォルトにしています。
 */
(()=>{
    "use strict";

    if ( Utils.RPGMAKER_NAME !== "MZ" ) return;

    // plugin information
    const scriptName = Utils.extractFileName(document.currentScript.src);
    const pluginName = scriptName.split(".")[0];

    // implementation
    const Input_Clear = Input.clear;
    Input.clear = function () {
        Input_Clear.call(this);
        this._gamepadEffect = null;
    }
    Input.setForceFeedback = function ( params = {} ) {
        this._gamepadEffect = Object.assign({
            startDelay: 0,
            duration: 600,
            weakMagnitude: 1.0,
            strongMagnitude: 1.0,
        }, params );
    }
    Input._gamepadPlayEffect = function ( gamepad ) {
        if ( this._gamepadEffect && gamepad.vibrationActuator ) {
            gamepad.vibrationActuator.playEffect("dual-rumble", this._gamepadEffect);
            this._gamepadEffect = null;
        }
    }

    const Input__updateGamepadState = Input._updateGamepadState;
    Input._updateGamepadState = function (gamepad) {
        this._gamepadPlayEffect(gamepad);
        Input__updateGamepadState.call(this, gamepad);
    }

    // PluginCommands
    PluginManager.registerCommand(pluginName, "playEffect", args => {
        let params = Object.entries(args).reduce((r,[k,v]) => (r[k] = v|0,r), {});
        Input.setForceFeedback( params );
    });

})();