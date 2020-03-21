const rec = new webkitSpeechRecognition();
rec.lang = 'ja-JP';

const read = new SpeechSynthesisUtterance();

const languages = {
  ja: 'ja-JP',
  en: 'en-US',
  es: 'es-ES'
}

mic.addEventListener('click', () => {
  rec.start();
});

rec.onresult = e => {
  rec.stop();

  if (e.results[0].isFinal) {
    let recWord = e.results[0][0].transcript;
    textArea.value += recWord;
  }
}

readText = e => {
  const target = e.target;
  read.text = target.textContent;
  read.lang = languages[target.lang];
  speechSynthesis.speak(read);
}
