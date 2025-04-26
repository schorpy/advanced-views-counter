<?php

namespace Advico\Libs\Utils;

if (! defined('ABSPATH')) exit;

class Cache
{
    private static $cache_dir;

    public static function init()
    {
        global $wp_filesystem;

        if (!function_exists('WP_Filesystem')) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
        }

        WP_Filesystem();

        self::$cache_dir = wp_upload_dir()['basedir'] . '/advico-counter/';

        if (!$wp_filesystem->is_dir(self::$cache_dir)) {
            $wp_filesystem->mkdir(self::$cache_dir, 0755);
        }

        add_action('init', [__CLASS__, 'ensure_cache_directory']);
    }

    public static function ensure_cache_directory()
    {
        global $wp_filesystem;

        if (!function_exists('WP_Filesystem')) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
        }

        WP_Filesystem();

        if (!$wp_filesystem->is_dir(self::$cache_dir)) {
            $wp_filesystem->mkdir(self::$cache_dir);
        }
    }




    public static function set_cache($key, $data, $ttl = 3600)
    {
        global $wp_filesystem;

        $file_path = self::$cache_dir . md5($key) . '.json';
        $cache_data = [
            'expires' => time() + $ttl,
            'data'    => $data
        ];

        if ($wp_filesystem->exists($file_path)) {
            $wp_filesystem->delete($file_path);
        }

        $wp_filesystem->put_contents($file_path, wp_json_encode($cache_data), FS_CHMOD_FILE);
    }

    public static function get_cache($key)
    {
        global $wp_filesystem;

        $file_path = self::$cache_dir . md5($key) . '.json';

        if ($wp_filesystem->exists($file_path)) {
            $cache_data = json_decode($wp_filesystem->get_contents($file_path), true);
            if ($cache_data && isset($cache_data['expires']) && $cache_data['expires'] > time()) {
                return $cache_data['data'];
            }
            $wp_filesystem->delete($file_path);
        }
        return false;
    }



    public static function delete_cache($key)
    {
        global $wp_filesystem;

        $file_path = self::$cache_dir . md5($key) . '.json';
        if ($wp_filesystem->exists($file_path)) {
            $wp_filesystem->delete($file_path);
        }
    }

    public static function deactivate()
    {
        global $wp_filesystem;

        if ($wp_filesystem->is_dir(self::$cache_dir)) {
            $files = glob(self::$cache_dir . '/*.json');
            if ($files) {
                foreach ($files as $file) {
                    if ($wp_filesystem->is_file($file)) {
                        $wp_filesystem->delete($file);
                    }
                }
            }
        }
    }

    public static function uninstall()
    {
        global $wp_filesystem;

        self::$cache_dir = wp_upload_dir()['basedir'] . '/advico-counter/';

        if ($wp_filesystem->is_dir(self::$cache_dir)) {
            $wp_filesystem->delete(self::$cache_dir, true); // `true` deletes the directory and its contents
        }
    }
}
