<?php


namespace AVC\App\Controllers;

if (! defined('ABSPATH')) {
    exit;
}


class Visit
{
    public function get_cid(\WP_REST_Request $request)
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

        // 🔍 2. Get IP Address
        $ip_address = $this->get_client_ip();


        // 🔥 4. Generate Click ID
        $clickid = 'CTZ' . bin2hex(random_bytes(10));

        // 🏷 5. Get or Set Session ID
        if (!isset($_COOKIE['session_id'])) {
            $session_id = bin2hex(random_bytes(8));
            setcookie('session_id', $session_id, time() + 86400, '/', '', true, true);
        } else {
            $session_id = sanitize_text_field($_COOKIE['session_id']);
        }
        global $wpdb;
        $table_name = 'ctz_visits';
        // 📥 6. Store in Database
        $wpdb->insert($table_name, [
            'click_id'    => $clickid,
            'session_id' => $session_id,
            'ip_address' => $ip_address,
            'user_agent' => $user_agent,
            'created_at' => current_time('mysql'),
        ]);

        return new \WP_REST_Response([
            'status' => 'success',
            'data'   => [
                'clickid'    => $clickid,
                'session_id' => $session_id,
                'ip_address' => $ip_address,
                'user_agent' => $user_agent,
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
