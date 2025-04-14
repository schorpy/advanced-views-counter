<?php


namespace AVC\App\Controllers;

if (! defined('ABSPATH')) {
    exit;
}


class Visit
{
    public function update(\WP_REST_Request $request)
    {
        // 🔒 Validate Nonce
        $nonce = $request->get_header('X-WP-Nonce');
        if (!wp_verify_nonce($nonce, 'wp_rest')) {
            return new \WP_REST_Response(['status' => 'error', 'message' => 'Invalid nonce'], 403);
        }
        // 🔍 1. Detect Bot (User-Agent)
        $user_agent = $request->get_header('user-agent') ?: ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown');
        if ($this->is_bot($user_agent)) {
            return new \WP_REST_Response(['status' => 'error', 'message' => 'Bot detected'], 403);
        }
        $params = $request->get_json_params();

        $post_id = $params['postId'] ?? null;
        if (!$post_id) {
            return new \WP_REST_Response(['status' => 'error', 'message' => 'Post ID is required'], 400);
        }
        // 🔍 2. Get IP Address
        $ip_address = $this->get_client_ip();


        //     // 🔥 4. Generate Click ID
        $clickid = 'CTZ' . bin2hex(random_bytes(10));

        //     // 🏷 5. Get or Set Session ID
        //     if (!isset($_COOKIE['session_id'])) {
        //         $session_id = bin2hex(random_bytes(8));
        //         setcookie('session_id', $session_id, time() + 86400, '/', '', true, true);
        //     } else {
        //         $session_id = sanitize_text_field($_COOKIE['session_id']);
        //     }
        global $wpdb;
        $table = $wpdb->prefix . 'avc_views';

        $period = gmdate('Ymd');
        // 📥 6. Store in Database
        $wpdb->query($wpdb->prepare(
            "INSERT INTO $table (id, type, period, count)
             VALUES (%d, 1, %s, 1)
             ON DUPLICATE KEY UPDATE count = count + 1",
            $post_id,
            $period
        ));

        return new \WP_REST_Response([
            'status' => 'success',
            'data'   => [
                'update'  => $status,

            ]
        ], 200);
    }

    private function get_client_ip()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            return explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
        } else {
            return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        }
    }

    // 🛑 Cek User-Agent untuk Bot
    private function is_bot($user_agent)
    {
        $bot_keywords = ['bot', 'crawl', 'spider', 'fetch', 'slurp', 'mediapartners'];
        foreach ($bot_keywords as $bot) {
            if (stripos($user_agent, $bot) !== false) {
                return true;
            }
        }
        return false;
    }
}
