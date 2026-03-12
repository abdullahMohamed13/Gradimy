<?php
header("Content-Type: application/json");

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];
$name = $data["name"];
$deadline = $data["deadline"];

$sql = "UPDATE projects 
SET name='$name', deadline='$deadline'
WHERE id=$id";

if($conn->query($sql)){
    echo json_encode(["message"=>"Project updated"]);
}else{
    echo json_encode(["error"=>$conn->error]);
}

$conn->close();
?>