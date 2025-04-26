<?php

/**
 * Plugin Name:     Advanced Views Counter
 * Plugin URI:      
 * Description:     Advanced Views Counter lets you track and display the number of views for your posts, pages, or custom post types in a powerful, flexible, and performance-optimized way. Easily monitor content popularity with detailed view counts and advanced filtering options.
 * Author:          Schorpy
 * Author URI:      https://github.com/schorpy
 * License:         GPLv2 or later
 * License URI:     http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     advanced-views-counter
 * Version:         1.0.0
 *
 * 
 */



if (!defined('ABSPATH')) {
    exit;
}

// Minimum required WP version
global $wp_version;
if (version_compare($wp_version, '6.2', '<')) {
    wp_die(
        'This plugin requires WordPress version 6.2 or higher.',
        'Plugin Requirements Not Met',
        ['back_link' => true]
    );
}

define('ADVICO_PLUGIN_NAME', 'Advanced Views Counter');
define('ADVICO_PLUGIN_VERSION', '1.0.0');
define('ADVICO_PLUGIN_FILE', __FILE__);
define('ADVICO_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ADVICO_PLUGIN_URL', plugin_dir_url(__FILE__));
define('ADVICO_PLUGIN_ASSETS_URL', ADVICO_PLUGIN_URL . '/assets');
define('ADVICO_ROUTE_PREFIX', 'advico/v1');
// define('ADVICO_DEV_MODE', true); // or false for production
// load composer
require_once __DIR__ . '/vendor/autoload.php';

//initialize
function advico_plugin_init()
{
    \Advico\Core\Plugin::init();
}
// Hook for plugin initialization.
add_action('plugins_loaded', 'advico_plugin_init');

register_activation_hook(__FILE__, [\Advico\Core\Plugin::class, 'activate']);
register_deactivation_hook(__FILE__, [\Advico\Core\Plugin::class, 'deactivate']);
