let gamesCollection;
let gameRound = 0;

gameReady = () => {
  gamesCollection = db.collection('rooms').doc(`room${roomId}`).collection(`games${gameRound}`);
  gamesCollection.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      const data = change.doc.data();
      if (data.boardSize) {
        boardSize = data.boardSize;
        init(); // ゲームスタート
        boardObserve();
        gameRound++;
      }
    });
  });
}

selectSize.addEventListener('submit', e => {
  e.preventDefault();
  gameStart();
});

gameStart = () => {
  gamesCollection.get()
  .then(doc => {
    console.log(doc.docs.length);
    if (isExist_4_friends || doc.docs.length === 4) {
      isExist_4_friends = false;

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
    } else {
      return;
    }
  })
  .catch(e => {
    console.error(e);
    }
  );
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
        turn++;
        checkBoard();
      }
    });
  });
}


// クリックした時
click = e => {
  if (players[colorNum()].color !== myColor) {
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
    board[c] = colorNum();
  })

  // 置ける場所（canPutList）を見て、ture か false を返す
  const flipFlag = canPutList.some(num => {
    return (clickCellId === num);
  })

  if (flipFlag) { // 置けるセルが存在する時、石を置く
    gamesCollection.add({
      created: firebase.firestore.FieldValue.serverTimestamp(),
      user: myName,
      turn: colorNum(),
      id: clickCellId
    })
    .then(doc => {
    })
    .catch(e => {
      console.error(e);
    });
  }
}






againGame = () => {
  gamesCollection = db.collection('rooms').doc(`room${roomId}`).collection(`games${gameRound}`);
  gamesCollection.add({
    user: myName
  })
  .then(() => {
    // 前ゲーム内容を初期化
    againBtn.classList.add('hidden');
    table.innerHTML = '';
    navMyColor.innerHTML = '';
    navMessage.innerHTML = '';
    navMessage.className = '';
    stateContainer.classList.add('hidden');
    sumTotal.classList.add('hidden');
    gameReady();

    if (myColor === 'Black') {
      selectSizeContainer.classList.remove('hidden');
    }
  })
  .catch(e => {
    console.error(e);
  });

}
