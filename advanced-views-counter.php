<?php

/**
 * Plugin Name:     Advanced Views Counter
 * Plugin URI:      
 * Description:     Advanced Views Counter lets you track and display the number of views for your posts, pages, or custom post types in a powerful, flexible, and performance-optimized way. Easily monitor content popularity with detailed view counts and advanced filtering options.
 * Author:          Schorpy
 * Author URI:      https://github.com/schorpy
 * License:         GPL-3.0
 * License URI:     http://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain:     advanced-views-counter
 * Version:         1.0.0
 *
 * 
 */



if (!defined('ABSPATH')) {
    exit;
}

define('AVC_NAME', 'Advanced Views Counter');
define('AVC_VERSION', '1.0.0');
define('AVC_PLUGIN_FILE', __FILE__);
define('AVC_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('AVC_PLUGIN_URL', plugin_dir_url(__FILE__));
define('AVC_PLUGIN_ASSETS_URL', AVC_PLUGIN_URL . '/assets');
define('AVC_ROUTE_PREFIX', 'avc/v1');

// load composer
require_once __DIR__ . '/vendor/autoload.php';

//initialize
function AdvancedViewsCounter_init()
{
    \AVC\Core\Plugin::init();
}
// Hook for plugin initialization.
add_action('plugins_loaded', 'AdvancedViewsCounter_init');

register_activation_hook(__FILE__, [\AVC\Core\Plugin::class, 'activate']);
register_deactivation_hook(__FILE__, [\AVC\Core\Plugin::class, 'deactivate']);
register_uninstall_hook(__FILE__, [\AVC\Core\Plugin::class, 'uninstall']);
