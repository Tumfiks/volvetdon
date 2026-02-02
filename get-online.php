<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$server = $_GET['server'] ?? 'lite';

// Ваши серверы
$servers = [
    'lite' => ['ip' => 'VolvetMC.aternos.me', 'port' => 29953],
    'crit' => ['ip' => 'phoenix-pe.ru', 'port' => 19132]
];

// Используем Minecraft Query
require_once('MinecraftQuery.php'); // Нужна библиотека

$query = new MinecraftQuery();
try {
    $query->Connect($servers[$server]['ip'], $servers[$server]['port']);
    $info = $query->GetInfo();
    
    echo json_encode([
        'online' => $info['Players'] ?? 0,
        'max' => $info['MaxPlayers'] ?? ($server === 'lite' ? 500 : 300),
        'status' => 'online'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'online' => 0,
        'max' => $server === 'lite' ? 500 : 300,
        'status' => 'offline',
        'error' => $e->getMessage()
    ]);
}
?>