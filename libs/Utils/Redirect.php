<?php

namespace AVC\Libs\Utils;

if (! defined('ABSPATH')) {
    exit;
}

use AVC\App\Traits\Singleton;

/**
 * Redirect
 * 
 * @since 1.0.0
 */
class Redirect
{
    use Singleton;

    private static $instance = null;
    private $current_slug = '';
    private $target_slug = 'Popzy';
    private $query_params = [];


    private function __construct()
    {
        add_action('init', [$this, 'capture_slug']);
        add_action('parse_request', [$this, 'handle_redirect']);
    }

    public function capture_slug()
    {
        if (isset($_SERVER['REQUEST_URI'])) {
            $request_uri = sanitize_text_field(wp_unslash($_SERVER['REQUEST_URI']));
            $this->current_slug = trim(wp_parse_url($request_uri, PHP_URL_PATH), '/');
        }
        // $this->current_slug = trim(wp_parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
        $this->query_params = array_map('sanitize_text_field', wp_unslash($_GET));
    }

    public function handle_redirect()
    {

        // Block bot request
        if (isset($_SERVER['HTTP_USER_AGENT'])) {
            $user_agent_raw = wp_unslash($_SERVER['HTTP_USER_AGENT']);
            $user_agent = strtolower(sanitize_text_field($user_agent_raw));
            $bot_keywords = array(
                'bot',
                'crawl',
                'spider',
                'robot',
                'googlebot',
                'bingbot',
                'slurp',
                'duckduckbot',
                'baiduspider',
                'yandex'
            );

            foreach ($bot_keywords as $keyword) {
                if (stripos($user_agent, $keyword) !== false) {
                    status_header(403);
                    wp_die('Access denied', 'Access Denied', ['response' => 403]);
                }
            }
        }

        $path_parts = explode('/', $this->current_slug);

        if (isset($path_parts[0]) && $path_parts[0] === $this->target_slug) {
            // Get ID from path
            $num = isset($path_parts[1]) ? sanitize_text_field($path_parts[1]) : '';

            if (empty($num)) {
                wp_die('Number parameter is required');
                exit;
            }

            // Get additional query parameters
            $utm_source = isset($this->query_params['utm_source']) ? sanitize_text_field($this->query_params['utm_source']) : '';
            $utm_medium = isset($this->query_params['utm_medium']) ? sanitize_text_field($this->query_params['utm_medium']) : '';

            // // Build redirect URL with query parameters
            // $redirect_url = "https://example.com/{$num}";
            // if ($utm_source || $utm_medium) {
            //     $redirect_url .= '?' . http_build_query([
            //         'utm_source' => $utm_source,
            //         'utm_medium' => $utm_medium
            //     ]);
            // }

            // wp_redirect($redirect_url);
            // exit;
            $redirect_url = "https://example.com/{$num}";
            if ($utm_source || $utm_medium) {
                $redirect_url .= '?' . http_build_query([
                    'utm_source' => $utm_source,
                    'utm_medium' => $utm_medium
                ]);
            }

            // Output an HTML page to prevent referrer leaking
            echo '<html><head>';
            echo '<meta name="referrer" content="no-referrer">';
            echo '<meta http-equiv="refresh" content="0;url=' . esc_url($redirect_url) . '">';
            echo '</head><body>';
            echo 'Redirecting...';
            echo '</body></html>';
            exit;
        }
    }
}
