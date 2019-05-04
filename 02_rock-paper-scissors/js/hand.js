let handsCollection; // コレクションのグローバル変数

handsObserve = () => { // hand の更新を監視。
  // グローバル変数に代入
  handsCollection = db.collection('rooms').doc(`room${roomNum}`).collection('hands');

  handsCollection.orderBy('created').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      const data = change.doc.data();
      if (change.type === 'added') {
        if (data.user !== me) { // 自分以外の user だった時 = 相手だった時
          enemyHandNum = data.hand;
        } else if (data.user === me) {
          myHandNum = data.hand;
        }
        if (myHandNum && enemyHandNum) { // 両者の手が揃ったら
          clearTimeout(logoutId); // 自動ログアウトを解除
          fieldMessage.textContent = 'じゃんけんはじめるよ〜！';
          setTimeout(judgeMessage, 2000);
        }
      }
    });
  });
}


click = e => {
  if (isReady || !existFriend) {
    return;
  }
  const el = e.srcElement;
  const conf = confirm(`『${handsWord[el.id]}』を出すよ？`);
  if (conf) {
    isReady = true;
    myHandNum = el.id;
    el.classList.add('selected');
    selectedMyHand.textContent = hands[myHandNum];
    fieldMessage.textContent = '友達の手を待っているよ...';
    fieldMessage.classList.add('waiting');

    logoutId = setTimeout(() => { // 反応がない場合、60秒後に自動ログアウト
      alert('通信エラーかな？\nまた部屋を作って友達を呼んでみよう！');
      authLogout();
    }, 60000)

    handsCollection.add({
      created: firebase.firestore.FieldValue.serverTimestamp(),
      user: me,
      hand: myHandNum
    })
      // サクセス時の処理
      .then(doc => {
        // console.log(`${doc.id} added!`);
      })
      // エラー時の処理
      .catch(e => {
        // console.error(e);
      });
  }
}


// const handsCollection = db.collection('rooms').doc(`room${ roomNum } `).collection('hands');
//  → hands のコレクションは作成されるが、roomundefined になってしまう。
// ログイン時に handsOvserve() を走らせ、hands の更新を監視させるときに、コレクションの定義を行う。
// コレクションをグローバル変数に代入して、ドキュメントを add する