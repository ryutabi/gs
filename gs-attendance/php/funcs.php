<?php
//共通に使う関数を記述

//XSS
function h($str){
  return htmlspecialchars($str, ENT_QUOTES);
}

//DBConnection
function db_con(){
  try {
    $pdo = new PDO('mysql:dbname=gs_attendance_db;charset=utf8;host=localhost', 'root', '');
    // $pdo = new PDO('mysql:dbname=ryutabi_gs_db;charset=utf8;host=mysql1021.db.sakura.ne.jp', 'ryutabi', 'H8m4Ji3yKqZ9ph8t7Ph2KV22');
    return $pdo;
  } catch (PDOException $e) {
    exit('DB-CONNECTION-ERROR:'.$e->getMessage());
  }
}

//SQLError
function sqlError($stmt){ 
  $error = $stmt->errorInfo();
  exit("SQL_ERROR:".$error[2]);
}

//リダイレクト
function redirect($page){
  header("Location: ".$page);
  exit;
}