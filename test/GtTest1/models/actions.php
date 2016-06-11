<?php
include 'class.Form.php';
include 'class.Sql.php';

Sql::init('localhost', 'triton', 'root', '');

Sql::insert('texts', 0, $_POST['title'], $_POST['password'], $_POST['text']);
echo 'Done';
?>