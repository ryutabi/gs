const inputColor = document.getElementById('inputColor');
const sample = document.getElementById('sample');
const colorList = document.getElementById('colorList');

let color;
let checkCode_3;
let checkCode_6;
let rgb;

// ローカルストレージ値をHTMLに表示
window.onload = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    createEl(key, value);
    inputColor.select();
  }
}

// hex と rgb を代入する
setColor = n => {
  color = inputColor.value;
  let valR = color.substring(0, n);
  let valG = color.substring(n, n * 2);
  let valB = color.substring(n * 2, n * 3);
  if (n === 1) {
    valR = valR + valR;
    valG = valG + valG;
    valB = valB + valB;
  }
  rgb = `rgb(${parseInt(valR, 16)}, ${parseInt(valG, 16)}, ${parseInt(valB, 16)})`;
}

// サンプル画面にリアルタイムに反映
changeColor = () => {
  // カラーコードの正規表現
  checkCode_3 = inputColor.value.match(/^[0-9A-Fa-f]{3}$/);
  checkCode_6 = inputColor.value.match(/^[0-9A-Fa-f]{6}$/);

  if (checkCode_3 === null && checkCode_6 === null) { // カラーコードではなかったら
    sample.style.background = '#fff';
  } else {
    sample.style.background = `#${inputColor.value}`; // カラーコードだったら
  }
}

// ローカルストレージに値を保存する
addLocalStorage = () => {
  if (!checkCode_3 && !checkCode_6) { // カラーコードではない場合、return
    alert('カラーコードを入力してください。\n Example： fff, 808080');
    return;
  }

  if (checkCode_3) {
    setColor(1);
  } else if (checkCode_6) {
    setColor(2);
  }

  const key = `#${color}`;
  const value = rgb;

  // ローカルストレージの保存
  localStorage.setItem(key, value); // key: HEX, value: RGB

  createEl(key, value);
  inputColor.value = '';
  inputColor.select();
}

// コピーする
copyCode = e => {
  const code = e.target.textContent; // コピーする文字を取得
  const textarea = document.createElement('textarea'); // 任意のtextareaを作成
  textarea.value = code; // textareaのvalueを入力
  document.body.appendChild(textarea); // appendする
  textarea.select(); // textareaのvalueを選択
  document.execCommand('copy'); // 選択したvalueをcopy
  textarea.parentElement.removeChild(textarea); // textareaをremoveChild
  alert(code + 'をコピーしました！');
}

// ローカルストレージを全削除
allDelete = () => {
  if (localStorage.length === 0) {
    return;
  }
  const confirmation = confirm('すべて削除しますか？')
  if (confirmation) {
    localStorage.clear();
    window.location.reload();
  }
}

// 選択したローカルストレージを削除
selectDelete = e => {
  const selectedColor = e.path[1].accessKey;
  const confirmation = confirm(`${selectedColor} を削除しますか？`);
  if (confirmation) {
    localStorage.removeItem(selectedColor);
    window.location.reload();
  }
}

// 要素の作成
createEl = (key, value) => {
  const tr = document.createElement('tr');
  // サンプルカラー
  const colorSample = document.createElement('td');
  colorSample.className = 'color-sample';
  colorSample.style.background = key;
  // HEX
  const hexCode = document.createElement('td');
  hexCode.className = 'hex-code';
  hexCode.textContent = key;
  hexCode.onclick = copyCode;
  // RGB
  const rgbCode = document.createElement('td');
  rgbCode.className = 'rgb-code';
  rgbCode.textContent = value;
  rgbCode.onclick = copyCode;
  // Deleteボタン
  const td = document.createElement('td');
  td.className = 'item-delete';
  td.innerHTML = '<i class="far fa-trash-alt"></i>';
  td.accessKey = key;
  td.onclick = selectDelete;

  tr.appendChild(colorSample);
  tr.appendChild(hexCode);
  tr.appendChild(rgbCode);
  tr.appendChild(td);
  colorList.appendChild(tr);
}