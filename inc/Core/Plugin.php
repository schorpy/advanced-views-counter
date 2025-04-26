<?php

namespace Advico\Core;

if (! defined('ABSPATH')) {
    exit;
}

use Advico\Core\Api;
use Advico\Admin\Menu;
use Advico\App\Traits\Singleton;
use Advico\Assets\Admin;
use Advico\Assets\Frontend;


final class Plugin
{
    use Singleton;


    public static function init()
    {

        API::getInstance()->init();
        \Advico\Libs\Utils\Cache::init();

        if (is_admin()) {
            Menu::getInstance()->init();
            Admin::getInstance()->bootstrap();
        }
        Frontend::getInstance()->bootstrap();

        self::load_and_cache('advico_settings');
        self::load_and_cache('advico_settings_count');

        // add_action('init', array(__CLASS__, 'register_blocks'));
    }
    public static function activate()
    {
        \Advico\Core\Install::getInstance()->init();
    }
    public static function deactivate()
    {
        \Advico\Libs\Utils\Cache::deactivate();
    }
    public static function uninstall()
    {
        \Advico\Libs\Utils\Cache::uninstall();
        \Advico\Core\Uninstall::run();
    }

    public static function register_blocks()
    {
        // register_block_type(Advico_PLUGIN_DIR . 'assets/blocks/block-1');
    }

    protected static function load_and_cache($key)
    {
        $cached = \Advico\Libs\Utils\Cache::get_cache($key);

        if (!$cached) {
            $from_option = json_decode(get_option($key, '{}'), true);
            \Advico\Libs\Utils\Cache::set_cache($key, $from_option);
        }
    }
}
