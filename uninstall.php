<?php

if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

require_once __DIR__ . '/vendor/autoload.php';

use Advico\Core\Uninstall;
use Advico\Libs\Utils\Cache;


if (class_exists(Cache::class) && method_exists(Cache::class, 'uninstall')) {
    Cache::uninstall();
}


if (class_exists(Uninstall::class)) {
    Uninstall::run();
}
