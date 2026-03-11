<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$data = file_get_contents("php://input");
file_put_contents("data.json", $data);

echo json_encode(["status" => "success"]);
?>
