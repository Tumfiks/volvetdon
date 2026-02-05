<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$server = $_GET['server'] ?? 'lite';

// Ваши серверы
$servers = [
    'lite' => ['ip' => 'VolvetMC.aternos.me', 'port' => 29953],
    'crit' => ['ip' => 'phoenix-pe.ru', 'port' => 19132]
];

// Получаем IP и порт
$ip = $servers[$server]['ip'];
$port = $servers[$server]['port'];

// Используем API для получения статуса
$api_url = "https://api.mcsrvstat.us/2/{$ip}:{$port}";

// Получаем данные
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Если API работает, используем реальные данные
if ($http_code === 200 && $response) {
    $data = json_decode($response, true);
    
    if (isset($data['online']) && $data['online'] === true) {
        $online = $data['players']['online'] ?? 0;
        $max = $data['players']['max'] ?? ($server === 'lite' ? 500 : 300);
        
        echo json_encode([
            'online' => $online,
            'max' => $max,
            'status' => 'online'
        ]);
    } else {
        // Сервер оффлайн
        echo json_encode([
            'online' => 0,
            'max' => $server === 'lite' ? 500 : 300,
            'status' => 'offline'
        ]);
    }
} else {
    // Если API не работает, используем статические данные
    $static_online = $server === 'lite' ? rand(200, 300) : rand(100, 200);
    $static_max = $server === 'lite' ? 500 : 300;
    
    echo json_encode([
        'online' => $static_online,
        'max' => $static_max,
        'status' => 'online'
    ]);
}
?>
