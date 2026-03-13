<?php
header("Access-Control-Allow-Origin: *");

// $host = "localhost";
// $user = "root";
// $password = "";
// $dbname = "grademe";

$host = getenv("DB_HOST");
$user = getenv("DB_USER");
$password = getenv("DB_PASS");
$dbname = getenv("DB_NAME");

$conn = new mysqli($host, $user, $password, $dbname, 59142);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>