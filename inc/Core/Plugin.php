<?php

namespace AVC\Core;

if (! defined('ABSPATH')) {
    exit;
}

use AVC\Core\Api;
use AVC\Admin\Menu;
use AVC\Admin\CPTs;
use AVC\App\Traits\Singleton;
use AVC\Assets\Admin;
use AVC\Assets\Frontend;
// use AVC\Libs\Utils\CPT;
use AVC\Libs\Utils\Metaboxes;


final class Plugin
{
    use Singleton;


    public static function init()
    {

        // Code::getInstance();
        API::getInstance()->init();
        // Assets::getInstance();
        // CPTs::getInstance();
        CPTs::getInstance()->init();
        Metaboxes::getInstance();

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
