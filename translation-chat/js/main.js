const messagesList = document.getElementById('messagesList');
const selectLangs = document.getElementById('selectLangs');
const textArea = document.getElementById('textArea');
const mic = document.getElementById('mic');

textArea.addEventListener('keydown', e => {
  if (e.keyCode === 13 && e.shiftKey) {
    const maxLineHeight = 5;
    let lineHeight = Number(textArea.getAttribute("rows"));
    while (textArea.scrollHeight > textArea.offsetHeight && lineHeight < maxLineHeight) {
      lineHeight++;
      textArea.setAttribute("rows", lineHeight);
    }
  } else if (e.keyCode === 13) {
    if (!me || !textArea.value) {
      e.preventDefault();
      return;
    }

    const submitTxt = textArea.value; // 入力したテキスト
    const selectedlang = selectLangs.value; // 翻訳する言語

    translatorApi(submitTxt, selectedlang);

  }
});