<?php

include "funcs.php";

$period = h($_POST["period"]);
$number = h($_POST["number"]);
$name = h($_POST["name"]);
$email = h($_POST["email"]);

$pdo = db_con();

$sql = "INSERT INTO gs_students_table(period, number, name, email)VALUES(:period, :number, :name, :email)";
$stmt = $pdo->prepare($sql);
$stmt->bindValue(':period', $period, PDO::PARAM_STR);
$stmt->bindValue(':number', $number, PDO::PARAM_STR);
$stmt->bindValue(':name', $name, PDO::PARAM_STR);
$stmt->bindValue(':email', $email, PDO::PARAM_STR);
$status = $stmt->execute();

if ($status == false) {
  sqlError($stmt);
} else {
  redirect("./add_student.php");
}

?>