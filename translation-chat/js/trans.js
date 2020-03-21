translatorApi = (txt, lang) => {
  const translation = new Promise(resolve => {
    // 認証トークンを取得するための関数 [getToken] を定義
    // http://docs.microsofttranslator.com/oauth-token.html

    const getToken = () => {
      const defer = $.Deferred();
      $.ajax({
        url: 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken',
        type: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/jwt',
          'Ocp-Apim-Subscription-Key': '13ecbfafa19d482aa8c0563a0cca7555',
        },
      }).done(function (data) {

        const token = data;
        defer.resolve(token);

      });
      return defer.promise();
    }

    $.when(getToken()).done(function (token) {
      const key = 'Bearer ' + token;
      const text = txt;
      const response = $.ajax({
        url: 'https://api.microsofttranslator.com/v2/http.svc/Translate',
        type: 'GET',
        data: {
          'appid': key,
          'Accept': 'application/xml',
          'text': text,
          'to': lang,
        },
        async: false,
      });

      // Translator テキスト APIを通じて取得したデータから、翻訳語が含まれるプロパティを取得
      // replace関数でタグを除去し、翻訳データのみを抽出して表示する
      const data = response.responseText;
      const transtedTxt = data.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');

      textArea.value = '';
      textArea.setAttribute("rows", 2);
      resolve(transtedTxt);
    });
  });

  translation
    .then(val => {
      // console.log(val, lang);
      addMessage(val, lang);
    })
    .catch((e) => {
      console.error(e);
    });

}