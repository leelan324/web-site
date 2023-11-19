(function(){
    'use strict';

    //タイマー
    const timer = document.getElementById('timer');
    //ボタン
    const start_stop = document.getElementById('btn');
    const reset = document.getElementById('reset');

    //開始時間
    let startTime = 0;
    //経過時間
    let elapsedTime = 0;
    //タイマーID(カウント停止に必要)
    let timerId = 0;
    //保存時間
    let timeToadd = 0;

    //距離
    const distm = document.getElementById('dist');
    const distkm = document.getElementById('km');

    //距離ID(距離カウント停止に必要)
    const soundId = 0;

    //気温を取得するためのボタン
    const tbtn = document.getElementById('tbtn');

    //気温(初期値)
    let temp = 15;

    //気温と音速
    const sspeed = document.getElementById('sspeed');

    //音速
    let speed = 331.5 + 0.61 * temp;
    
    //気温取得ボタンのクリック時イベント
    tbtn.addEventListener('click',function(){
        //気温取得
        temp = document.getElementById("temp").value;
        //音速再計算
        speed = 331.5 + 0.61 * temp;
        //気温と音速の更新
        sspeed.textContent = '現在設定：気温 ' + temp +'℃ / 音速 ' + speed.toFixed(1) + 'm/s';
    });

    //ミリ秒をmm:ss.ms形式に変換して表示
    function updateTimetText(){
        //m
        let m = Math.floor(elapsedTime / 60000);
        //s
        let s = Math.floor(elapsedTime % 60000 / 1000);
        //ms
        let ms = elapsedTime % 1000;
        //表示桁数
        m = ('00' + m).slice(-2); 
        s = ('00' + s).slice(-2);
        ms = ('00' + ms).slice(-3,-1);
        //表示
        timer.textContent = m + ':' + s + '.' + ms;
    }

    //距離表示
    function updateSoundText(){
        //経過時間(距離計算用)
        const etd = elapsedTime / 1000;
        //距離
        const distance = speed * etd;
        //表示桁数
        const distance2 = ('00000' + Math.floor(distance)).slice(-5);
        //km変換
        const km = Math.floor(distance) / 1000;
        //数値化
        const km2 = Number(km);
        //表示桁数(小数第一位まで)
        const km3 = km2.toFixed(1);
        //表示
        if(distance < 100000){
            //100000m未満のときはm表示する
            distm.textContent = distance2 + 'm';
        }else{
            //100kmを超えるときはkm表示のみ
            distm.style.fontSize = "36px";
            distm.textContent = '[距離が長すぎます]';
        }
        //km表示
        distkm.textContent = '(' + km3 + 'km' + ')';
    }

    //カウントする関数
    function countUp(){
        //カウント実行
        timerId = setTimeout(function(){
            //経過時間 = 現在時刻 - 開始(再開)時刻 + 保存時間
            elapsedTime = Date.now() - startTime + timeToadd;
            //mm:ss.ms形式で経過時間を表示
            updateTimetText()
            //距離を表示
            updateSoundText()
            //自身を呼ぶ
            countUp();
        //10ミリ秒後に実行
        },10);
    }

    //ボタン状態(start待機=0)
    let sw_status = 0;

    //カウント開始前はリセットボタンを無効化
    document.getElementById("reset").disabled = "true";

    //SWボタンのクリック時イベント
    start_stop.addEventListener('click',function(){
        //ボタン状態確認
        if(sw_status == 0){
            //カウント実行中はSWボタンを有効化
            document.getElementById("btn").disabled = "";
            //ボタンに表示されるテキストを変更
            document.getElementById("btn").innerHTML = "　鳴った　";
            //ボタン状態(stop待機=1)
            sw_status = 1;
            //開始時刻設定
            startTime = Date.now();
            //カウント実行
            countUp();
        }else{
            //カウント停止後はSWボタンを無効化
            document.getElementById("btn").disabled = "true";
            //カウント停止後はリセットボタンを有効化
            document.getElementById("reset").disabled = "";
            //ボタンに表示されるテキストを変更
            document.getElementById("btn").innerHTML = "結果表示中";
            //ボタン状態(start待機=0)
            sw_status = 0;
            //カウント停止
            clearTimeout(timerId);
            //距離カウント停止
            clearTimeout(soundId);
            //保存時間を足す
            timeToadd += Date.now() - startTime;
        } 
    });

    //resetボタンのクリック時イベント
    reset.addEventListener('click',function(){
        //リセット後はSWボタンを有効化
        document.getElementById("btn").disabled = "";
        //リセット後はリセットボタンを無効化
        document.getElementById("reset").disabled = "true";
        //ボタンに表示されるテキストを変更
        document.getElementById("btn").innerHTML = "　光った　";
        //経過時間を初期化
        elapsedTime = 0;
        //保存時間を初期化
        timeToadd = 0;
        //初期化後の時間
        updateTimetText();
        //初期化後の距離
        updateSoundText();
        //距離の文字サイズを元に戻す
        distm.style.fontSize = "80px";
    });
})();
