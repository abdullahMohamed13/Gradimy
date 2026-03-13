<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, content-type");
 
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
 
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