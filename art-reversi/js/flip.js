// 置ける場所があるか確認
canTurnOver = () => {
  board.forEach((_, x) => {
    if (board[x] !== 0 || isFrame(x)) {
      return;
    }
    // ボードの状態を確認
    exploreBoard(x);
  });


  if (canPutList.length === 0) {
    board.forEach((_, x) => {
      if (board[x] !== 0 || isFrame(x)) {
        return;
      }
      // 救済処理
      comeBackBoard(x);
    });
  }
}

// ボードの状態を確認する（重要！）
exploreBoard = (id, list) => {
  // 隣接する8方向確認する
  directions.forEach(dir => {
    const targetId = id + dir; // チェックするID
    const targetCell = board[targetId]; // チェックするピースの状態

    if (targetCell && targetCell !== colorNum()) { // ブランクではなくて、自分の色でもない場合
      // あったらその先をチェックする
      for (let i = 1; i < size; i++) {
        const nextTargetId = targetId + dir * i;
        if (!board[nextTargetId] || isFrame(nextTargetId)) { // ブランク、もしくは端ならば return
          return;
        }
        if (board[nextTargetId] === colorNum()) {
          let j = 0;
          while (board[targetId + dir * j] !== colorNum()) {
            if (list) { // クリックの時（第2引数あり）
              list.push(targetId + dir * j);
              j++;
            } else { // 置ける場所を返す
              canPutList.push(id);
              j++;
            }
          }
        }
      }
    }
  });
}

comeBackBoard = id => {
  directions.forEach(dir => {
    const targetId = id + dir; // チェックするID
    const targetCell = board[targetId]; // チェックするピースの状態

    if (targetCell && targetCell !== colorNum()) {
      canPutList.push(id);
    }
  });
}

// 端であるかどうか 端なら true を返す
isFrame = id => {
  if (
    size > id ||
    size * (size - 1) <= id ||
    id % size === 0 ||
    id % size === size - 1
  ) {
    return true;
  }
}
