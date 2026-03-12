<?php
header("Content-Type: application/json");

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];

$sql = "DELETE FROM projects WHERE id=$id";

if($conn->query($sql)){
    echo json_encode(["message"=>"Project deleted"]);
}else{
    echo json_encode(["error"=>$conn->error]);
}

$conn->close();
?>