<?php

namespace AVC\Core;

if (! defined('ABSPATH')) {
    exit;
}

use AVC\Core\Api;
use AVC\Admin\Menu;
use AVC\App\Traits\Singleton;
use AVC\Assets\Admin;
use AVC\Assets\Frontend;


final class Plugin
{
    use Singleton;


    public static function init()
    {

        API::getInstance()->init();
        \AVC\Libs\Utils\Cache::init();

        if (is_admin()) {
            Menu::getInstance()->init();
            Admin::getInstance()->bootstrap();
        }
        Frontend::getInstance()->bootstrap();
    }
    public static function activate()
    {
        \AVC\Core\Install::getInstance()->init();
    }
    public static function deactivate()
    {
        \AVC\Libs\Utils\Cache::deactivate();
    }
    public static function uninstall()
    {
        \AVC\Libs\Utils\Cache::uninstall();
        \AVC\Core\Uninstall::getInstance()->init();
    }
}
