<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, content-type");
 
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
 
header("Content-Type: application/json");

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["id"])) {
    echo json_encode(["error" => "No ID provided"]);
    exit;
}

$id = $data["id"];
$name = $data["name"] ?? null;
$deadline = $data["deadline"] ?? null;
$doctor_id = $data["doctor_id"] ?? null;
$subject_id = $data["subject_id"] ?? null;

if (!$name || !$deadline || !$doctor_id || !$subject_id) {
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$stmt = $conn->prepare("UPDATE projects SET name=?, deadline=?, doctor_id=?, subject_id=? WHERE id=?");
$stmt->bind_param("ssiii", $name, $deadline, $doctor_id, $subject_id, $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Project updated"]);
} else {
    echo json_encode(["error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>