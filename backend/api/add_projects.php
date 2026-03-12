<?php
header("Content-Type: application/json");

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = $data["name"];
$deadline = $data["deadline"];
$doctor_id = $data["doctor_id"];
$subject_id = $data["subject_id"];

$sql = "INSERT INTO projects (name, deadline, doctor_id, subject_id)
VALUES ('$name','$deadline','$doctor_id','$subject_id')";

if($conn->query($sql)){
    echo json_encode(["message" => "Project added"]);
}else{
    echo json_encode(["error" => $conn->error]);
}

$conn->close();
?>