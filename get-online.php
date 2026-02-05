<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Обработка CORS для preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Включение логов для отладки
error_reporting(E_ALL);
ini_set('display_errors', 1);

$server = $_GET['server'] ?? 'lite';
$cache_time = 60; // Кэшируем на 60 секунд

// Ваши серверы
$servers = [
    'lite' => [
        'ip' => 'VolvetMC.aternos.me', 
        'port' => 29953,
        'name' => 'Lite режим',
        'max_players' => 500
    ],
    'crit' => [
        'ip' => 'phoenix-pe.ru', 
        'port' => 19132,
        'name' => 'Crit режим',
        'max_players' => 300
    ]
];

// Проверяем наличие сервера в списке
if (!isset($servers[$server])) {
    echo json_encode([
        'success' => false,
        'error' => 'Неизвестный сервер',
        'online' => 0,
        'max' => 0,
        'status' => 'error'
    ]);
    exit();
}

$server_config = $servers[$server];

// Функция для проверки онлайн через разные методы
function checkServerOnline($ip, $port) {
    $result = [
        'online' => false,
        'players' => 0,
        'max_players' => 0
    ];
    
    // Метод 1: Пробуем Minecraft Query (для Java)
    $query_result = checkWithQuery($ip, $port);
    if ($query_result['online']) {
        return $query_result;
    }
    
    // Метод 2: Пробуем через API mcstatus.io
    $api_result = checkWithAPI($ip, $port);
    if ($api_result['online']) {
        return $api_result;
    }
    
    // Метод 3: Пробуем через API mcsrvstat.us
    $api2_result = checkWithMCSrvStat($ip, $port);
    if ($api2_result['online']) {
        return $api2_result;
    }
    
    return $result;
}

function checkWithQuery($ip, $port) {
    try {
        // Используем Minecraft Query Protocol
        $socket = @fsockopen('udp://' . $ip, $port, $errno, $errstr, 3);
        
        if (!$socket) {
            return ['online' => false, 'players' => 0, 'max_players' => 0];
        }
        
        // Формируем basic stat запрос
        $data = pack('c3x3', 0xFE, 0xFD, 0x09) . pack('N', 1) . pack('c', 0x00);
        
        stream_set_timeout($socket, 2);
        fwrite($socket, $data);
        
        $response = fread($socket, 4096);
        fclose($socket);
        
        if ($response && strlen($response) > 5) {
            // Парсим ответ
            $parts = explode("\x00", $response);
            if (count($parts) > 7) {
                return [
                    'online' => true,
                    'players' => intval($parts[7]),
                    'max_players' => intval($parts[8])
                ];
            }
        }
    } catch (Exception $e) {
        error_log("Query error: " . $e->getMessage());
    }
    
    return ['online' => false, 'players' => 0, 'max_players' => 0];
}

function checkWithAPI($ip, $port) {
    try {
        $url = "https://api.mcstatus.io/v2/status/java/{$ip}:{$port}";
        $context = stream_context_create([
            'http' => [
                'timeout' => 5,
                'header' => "User-Agent: VolvetMC Shop\r\n"
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false
            ]
        ]);
        
        $response = @file_get_contents($url, false, $context);
        
        if ($response) {
            $data = json_decode($response, true);
            if ($data && isset($data['online']) && $data['online']) {
                return [
                    'online' => true,
                    'players' => $data['players']['online'] ?? 0,
                    'max_players' => $data['players']['max'] ?? 0
                ];
            }
        }
    } catch (Exception $e) {
        error_log("API error: " . $e->getMessage());
    }
    
    return ['online' => false, 'players' => 0, 'max_players' => 0];
}

function checkWithMCSrvStat($ip, $port) {
    try {
        $url = "https://api.mcsrvstat.us/2/{$ip}:{$port}";
        $context = stream_context_create([
            'http' => [
                'timeout' => 5,
                'header' => "User-Agent: VolvetMC Shop\r\n"
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false
            ]
        ]);
        
        $response = @file_get_contents($url, false, $context);
        
        if ($response) {
            $data = json_decode($response, true);
            if ($data && isset($data['online']) && $data['online']) {
                return [
                    'online' => true,
                    'players' => $data['players']['online'] ?? 0,
                    'max_players' => $data['players']['max'] ?? 0
                ];
            }
        }
    } catch (Exception $e) {
        error_log("MCSrvStat error: " . $e->getMessage());
    }
    
    return ['online' => false, 'players' => 0, 'max_players' => 0];
}

try {
    // Проверяем онлайн
    $online_data = checkServerOnline($server_config['ip'], $server_config['port']);
    
    // Если сервер оффлайн, используем максимальное значение
    if (!$online_data['online']) {
        // Можно добавить заглушку или оставить 0
        $players = 0;
        $max_players = $server_config['max_players'];
        $status = 'offline';
    } else {
        $players = $online_data['players'];
        $max_players = $online_data['max_players'] > 0 ? $online_data['max_players'] : $server_config['max_players'];
        $status = 'online';
    }
    
    // Возвращаем результат
    echo json_encode([
        'success' => true,
        'online' => $players,
        'max' => $max_players,
        'status' => $status,
        'server' => $server,
        'name' => $server_config['name']
    ]);
    
} catch (Exception $e) {
    // В случае ошибки возвращаем заглушку
    error_log("Server check error: " . $e->getMessage());
    
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'online' => 0,
        'max' => $server_config['max_players'],
        'status' => 'error',
        'server' => $server
    ]);
}
?>
