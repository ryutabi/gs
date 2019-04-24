// jsを記述する際はここに記載していく
{

  // ゲーム画面に遷移
  // const originPass = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48]; // 1234567890
  const originPass = [67, 72, 69, 69, 83, 69, 65, 67, 65, 68, 69, 77, 89]; // cheeseacademy
  let enterPass = [];

  window.addEventListener('keyup', (e) => {
    enterPass.push(e.keyCode);
    for (let i = 0; i < enterPass.length; i++) {
      if (originPass[i] !== enterPass[i]) {
        enterPass = [];
      }
    }

    if (originPass.length === enterPass.length) {
      const con = confirm('シークレットページに移動しますか？');
      if (con) {
        $('.wrapper').fadeOut(2000, () => {
          window.location.href = 'secret/secret.html';
        });
      } else {
        enterPass = [];
      }
    }
  });


  // 音声操作
  const btn = document.getElementById('btn');
  const act = document.getElementsByClassName('act');
  const ft = document.querySelector('.footer__copyright');
  const rec = new webkitSpeechRecognition();
  let modeFlag;
  rec.lang = 'ja-JP';

  // マイクボタンで音声操作スタート
  btn.addEventListener('click', () => {
    btn.className = 'state--active';
    btn.disabled = true;
    rec.start();
  })

  rec.onresult = e => {
    rec.stop();

    if (e.results[0].isFinal) {
      let recWord = e.results[0][0].transcript;
      console.log(recWord);

      // 背景色と文字色のモード切替
      if (recWord === 'バックグラウンド') {
        modeFlag = 'background';
      } else if (recWord === 'カラー') {
        modeFlag = 'color';
      }

      changeColor = () => {
        const wordColor = ['アクア', 'ブラック', 'ブルー', 'グレイ', 'GReeeeN', 'ライム', 'マゼンタ', 'マルーン', 'ネイビー', 'オリーブ', 'パープル', 'レッド', 'シルバー', 'ホワイト', 'イエロー'];
        const originColor = ['aqua', 'black', 'blue', 'gray', 'green', 'lime', 'magenta', 'maroon', 'navy', 'olive', 'purple', 'red', 'silver', 'white', 'yellow'];
        wordColor.forEach((value, i) => {
          if (value === recWord) {
            // console.log(i); // wordColorのindex番号
            if (modeFlag === 'background') {
              document.body.style.background = originColor[i];
              ft.style.background = originColor[i];
            } else if (modeFlag = 'color') {
              document.body.style.color = originColor[i];
              // for の新しい書き方
              for (const actItem of act) {
                actItem.style.color = originColor[i];
              }
              // for (let j = 0; j < act.length; j++) {
              //   act[j].style.color = originColor[i];
              // }
              // この場合、forEachは動かない！！
              // act.forEach((_, j) => {
              //   act[j].style.color = originColor[i];
              // })
            }
          }
        })
      }
      changeColor();


      // 画面遷移（リンク）
      if (recWord === 'ゲーム') {
        $(document.body).fadeOut(2000, () => {
          window.location.href = 'https://ryutabi.github.io/gs_lab7/01_cheese-academy/secret/secret.html';
        });
      } else if (recWord === 'ジーズアカデミー') {
        $(document.body).fadeOut(2000, () => {
          window.location.href = 'https://gsacademy.tokyo/';
        });
      } else if (recWord === 'Google') {
        $(document.body).fadeOut(2000, () => {
          window.location.href = 'https://www.google.com/';
        });
      } else if (recWord === 'Yahoo') {
        $(document.body).fadeOut(2000, () => {
          window.location.href = 'https://www.yahoo.co.jp/';
        });
      }


      // 画面操作
      if (recWord === 'リロード') {
        location.reload();
      } else if (recWord === 'バルス') {
        document.body.className = 'hidden';
      } else if (recWord === 'トップ') {
        window.scrollTo(0, 0);
      }

      // スクロール
      const speed = 10; // スクロールのスピード（1に近いほど速く）
      const move = 2; // スクロールのなめらかさ（1に近いほどなめらかに）
      const docHigh = $(document).innerHeight(); //ページ全体の高さ
      const winHigh = $(window).innerHeight(); //ウィンドウの高さ
      const bottom = docHigh - winHigh; //ページ全体の高さ - ウィンドウの高さ = ページの最下部位置
      let scrollId;

      pagScroll = () => {
        window.scrollBy(0, move); // スクロール処理
        scrollId = setTimeout(pagScroll, speed);


        if (bottom <= $(window).scrollTop()) {
          //一番下までスクロールした時に実行
          clearTimeout(scrollId);
        } else if (recWord === '止まれ') {
          clearTimeout(scrollId);
        }
      }

      if (recWord === '動け') {
        pagScroll();
      }





      rec.onend = () => {
        rec.start();
      }
      rec.onsoundstart = () => {
        btn.textContent = '.....';
      }
      rec.onsoundend = () => {
        btn.innerHTML = '<i class="fas fa-microphone"></i>';
      }
    }
  }

}