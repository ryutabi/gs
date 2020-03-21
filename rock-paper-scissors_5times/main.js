{

  const cpu = document.getElementById('cpu');
  const result = document.getElementById('result');
  const start = document.getElementById('start');
  const oneMore = document.getElementById('oneMore');
  const message = document.getElementById('message');
  const rock = document.getElementById('rock');
  const paper = document.getElementById('paper');
  const scissors = document.getElementById('scissors');
  const coinContainer = document.getElementById('coin__container');
  const coin = document.getElementById('coin');
  const hands = ["✊", "✋", "✌️", "👍"];

  let count = 0;
  let isStarted = false; // ゲームフラグ
  let again = false; // あいこ時のフラグ
  let shuffleHand;
  let cpuHand;
  
  const init = () => {
    oneMore.className = 'hidden';
    result.className = 'hidden';
    rock.classList.remove('pushed');
    paper.classList.remove('pushed');
    scissors.classList.remove('pushed');
  }
  init();

  const gameStart = () => {
    start.className = 'hidden';
    isStarted = true;
    init();

    if (again) {
        message.textContent = 'あいこで...';
        // voice
    }
    else {
        message.textContent = 'じゃんけん...';
        // voice
    }
    shuffleHand = setInterval(shuffleStart, 50);
  }

  const shuffleStart = () => {
    cpuHand = Math.random(); // Math.floor(Math.random()*hands.length);
    if (cpuHand < 0.25) { cpuHand = 0}
    else if (cpuHand < 0.5) { cpuHand = 1 }
    else if (cpuHand < 0.75) { cpuHand = 2 }
    else { cpuHand = 3 };
    cpu.textContent = hands[cpuHand];
  }

  // 各クリックイベント
  start.addEventListener('click', gameStart);

  rock.addEventListener('click', () => {
    if (!isStarted) { return; }
    clearTimeout(shuffleHand);
    rock.classList.add('pushed');
    judge('rock', cpuHand);
  });
  
  paper.addEventListener('click', () => {
    if (!isStarted) { return; }
    clearTimeout(shuffleHand);
    paper.classList.add('pushed');
    judge('paper', cpuHand);
  });
  
  scissors.addEventListener('click', () => {
    if (!isStarted) { return; }
    clearTimeout(shuffleHand);
    scissors.classList.add('pushed');
    judge('scissors', cpuHand);
  });

  oneMore.addEventListener('click', () => {
    init();
    gameStart();
  });

  const messFunc = () => {
    if (again) {
        message.textContent = 'しょっ！';
        // voice
    } else {
        message.textContent = 'ぽんっ！';
        // voice
    } 
    isStarted = false;
  }

  // 判定分岐
  const judge = (player, cpu) => {
    messFunc();

    switch (player) {
      case 'rock':
        if (cpu === 0) {
          setTimeout (draw, 1000);
        }
        else if (cpu === 1) {
          resultMessage('Lose', '#888');
          setTimeout(()=>{getCoin(-1)}, 1000);
        }
        else if (cpu === 2) {
          resultMessage('Win', '#ff0000');
          setTimeout(()=>{getCoin(1)}, 1000);
        }
        else {
          resultMessage('Good!', '#1683F4');
          setTimeout(()=>{getCoin(2)}, 1000);
        }
        break;

      case 'paper':
        if (cpu === 0) {
          setTimeout(()=>{getCoin(1)}, 1000);
          resultMessage('Win', '#ff0000');
        }
        else if (cpu === 1) {
          setTimeout (draw, 1000);
        }
        else if (cpu === 2) {
          resultMessage('Lose', '#888');
          setTimeout(()=>{getCoin(-1)}, 1000);
        }
        else {
          resultMessage('Good!', '#1683F4');
          setTimeout(()=>{getCoin(2)}, 1000);
        }
        break;

      case 'scissors':
        if (cpu === 0) {
          resultMessage('Lose', '#888');
          setTimeout(()=>{getCoin(-1)}, 1000);
        }
        else if (cpu === 1) {
          resultMessage('Win', '#ff0000');
          setTimeout(()=>{getCoin(1)}, 1000);
        }
        else if (cpu === 2) {
          setTimeout (draw, 1000);
        }
        else {
          resultMessage('Good!', '#1683F4');
          setTimeout(()=>{getCoin(2)}, 1000);
        }
        break;

    }
  }

  // コイン
  const getCoin = (coinNum) => {
    again = false;
    const coinFunc = () => {
      const cloneCoin = coin.cloneNode(true);
      coinContainer.appendChild(cloneCoin);
      count++;
    }

    switch (coinNum) {
      // 勝ちの時（コイン+1）
      case 1:
      if (count === 4) {
        coinFunc();
        gameClear();
      } else {
        coinFunc();
        setTimeout(gameStart(), 1000);
      }
        break;
      
      // いいねの時（コイン+2）
      case 2:
        if (count === 4) {
          coinFunc();
          gameClear();
        }
        else {
          [...Array(coinNum)].forEach(() => {
            coinFunc();
          })
          if (count === 5) {
            gameClear();
          } else {
            setTimeout(gameStart(), 1000);
          }
        }
        break;
      
      // 負けの時（コイン=0）
      default:
        if (count === 0) {
          setTimeout(gameStart(), 1000);
        } else {
          // while (coinContainer.firstChild) {
          //   coinContainer.removeChild(coinContainer.firstChild);
          // }
          // count = 0;
          coinContainer.removeChild(coinContainer.firstChild);
          count--;
          setTimeout(gameStart(), 1000);
        }
        break;
    }
  }

  // 判定結果（win or lose）
  const resultMessage = (value, background) => {
      result.classList.remove('hidden');
      result.textContent = value;
      result.style.background = background;
  }
  // 判定結果（draw）
  const draw = () => {
    message.textContent = 'あいこで...';
    again = true;
    gameStart();
  }
  // ゲームクリア（5連勝）
  const gameClear = () => {
    resultMessage('Game Clear', '#ff0000');
    // oneMore.classList.remove('hidden'); 
    return;
  }

}