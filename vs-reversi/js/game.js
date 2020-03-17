let gamesCollection;

gameBoard = () => {
  gamesCollection = db.collection('rooms').doc(`room${roomId}`).collection('games');
  gamesCollection.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      const data = change.doc.data();
      if (data.boardSize) {
        boardSize = data.boardSize;
        init(); // ゲームスタート
        boardObserve();
      }
    });
  });
}

selectSize.addEventListener('submit', e => {
  e.preventDefault();
  gameStart();
});

gameStart = () => {
  if (!isExistFriend) { // 2人揃っていない時、return
    return;
  }
  boardSize = inputBoardSize.value * 1;
  selectSizeContainer.classList.add('hidden');

  gamesCollection.doc('@boradSize').set({
    boardSize: boardSize
  })
    .then(() => {
    })
    .catch(e => {
      console.error(e);
    });
}


// ボードの状態を司る
boardObserve = () => {
  gamesCollection.orderBy('created').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      const data = change.doc.data();
      if (change.type === 'added') {
        const flipList = []; // 裏返るIDリスト
        exploreBoard(data.id, flipList); // ボードの状態を確認
        flipList.forEach(c => {
          board[c] = data.turn;
        });

        board[data.id] = data.turn;
        wasPassed = false;
        turn = 3 - data.turn;
        checkBoard();
        flipFlag = false;
      }
    });
  });
}





// クリックした時
click = e => {
  if (players[turn].color !== myColor) {
    return;
  }

  const clickCellId = e.srcElement.id * 1;

  // クリックした場所に石がある、または枠の場合 return
  if (board[clickCellId] !== 0 || isFrame(clickCellId)) {
    return;
  }
  const flipList = []; // 裏返るIDリスト
  exploreBoard(clickCellId, flipList); // ボードの状態を確認

  flipList.forEach(c => {
    board[c] = turn;
  })

  if (flipFlag) { // 置けるセルが存在する時、石を置く
    gamesCollection.add({
      created: firebase.firestore.FieldValue.serverTimestamp(),
      user: myName,
      turn: turn,
      id: clickCellId
    })
      .then(doc => {

      })
      .catch(e => {
        console.error(e);
      });
  }
}
