<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>生徒追加ページ</title>
</head>
<body>
  <section>
    <form action="add_act.php" method="post">
      <fieldset>
        <legend>生徒情報記入欄</legend>
        <input type="text" name="period" placeholder="LAB7">
        <input type="number" name="number" placeholder="生徒番号">
        <input type="text" name="name" placeholder="氏名">
        <input type="email" name="email" placeholder="メールアドレス">
        <input type="submit" value="登録">
      </fieldset>
    </form>


  </section>
  
</body>
</html>