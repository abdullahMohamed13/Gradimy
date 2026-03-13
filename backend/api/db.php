<?php
header("Access-Control-Allow-Origin: *");

// $host = "localhost";
// $user = "root";
// $password = "";
// $dbname = "grademe";

$host = "DB_HOST";
$user = "DB_USER";
$password = "DB_PASS";
$dbname = "DB_NAME";

$conn = new mysqli($host, $user, $password, $dbname, 59142);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>