<?php
// header("Content-Type: application/json");
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     exit;
// }

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, content-type");
 
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
 
header("Content-Type: application/json");
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["error" => "No data provided"]);
    exit;
}

$name = $data["name"] ?? null;
$deadline = $data["deadline"] ?? null;
$doctor_id = $data["doctor_id"] ?? null;
$subject_id = $data["subject_id"] ?? null;

if (!$name || !$deadline || !$doctor_id || !$subject_id) {
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO projects (name, deadline, doctor_id, subject_id) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssii", $name, $deadline, $doctor_id, $subject_id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Project added", "id" => $conn->insert_id]);
} else {
    echo json_encode(["error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>