<?php


namespace Advico\App\Controllers;

if (! defined('ABSPATH')) {
    exit;
}

use Advico\Libs\Utils\Cache;
use Advico\Libs\Utils\Visitor;
use Advico\Libs\Utils\VisitorDisplay;

class Visit
{
    /**
     * Update Views
     * 
     */
    public function update_views(\WP_REST_Request $request)
    {
        // 🔒 Validate Nonce
        $nonce = $request->get_header('X-WP-Nonce');
        if (!wp_verify_nonce($nonce, 'wp_rest')) {
            return new \WP_REST_Response(['status' => 'error', 'message' => 'Invalid nonce'], 403);
        }

        $params = $request->get_json_params();

        $post_id = $params['postId'] ?? null;
        if (!$post_id) {
            return new \WP_REST_Response(['status' => 'error', 'message' => 'Post ID is required'], 400);
        }

        $post_id = (int) $request->get_param('postId');
        if (!$post_id || get_post_status($post_id) !== 'publish') {
            return new \WP_REST_Response(['error' => 'Invalid post ID'], 400);
        }

        $checker = new Visitor($post_id);

        if ($checker->shouldExclude()) {
            return new \WP_REST_Response([
                'post_id' => $post_id,
                'roles' => wp_get_current_user()->roles[0],
                'message' => 'Visitor excluded',
            ]);
        };

        // Get interval from cache (or fallback to 24 hours)
        $settings = Cache::get_cache("advico_settings_count");
        $interval_count = isset($settings['interval_count']) ? intval($settings['interval_count']) : 24;
        $interval_unit = isset($settings['interval_unit']) ? $settings['interval_unit'] : 'hours';
        switch ($interval_unit) {
            case 'seconds':
                $interval_seconds = $interval_count;
                break;
            case 'minutes':
                $interval_seconds = $interval_count * 60;
                break;
            case 'hours':
                $interval_seconds = $interval_count * 3600;
                break;
            case 'days':
                $interval_seconds = $interval_count * 86400; // 24 * 3600
                break;
            case 'weeks':
                $interval_seconds = $interval_count * 604800; // 7 * 24 * 3600
                break;
            case 'months':
                $interval_seconds = $interval_count * 2592000; // 30 days
                break;
            case 'years':
                $interval_seconds = $interval_count * 31536000; // 365 days
                break;
            default:
                $interval_seconds = $interval_count * 3600; // default to hours
                break;
        }

        // Set cookie expiry time
        $expiry = time() + $interval_seconds;

        $cookie_name = "advico_views[$post_id]";
        $cookie_value = $expiry . $post_id;

        $visit_id = $params['visitId'] ?? null;

        if (!$visit_id) {

            $period = gmdate('Ymd');
            global $wpdb;
            // Define the table name safely
            $table_views = $wpdb->prefix . 'advico_views';

            $wpdb->query($wpdb->prepare(
                "INSERT INTO %i (id, type, period, count)
                VALUES (%d, %d, %s, %d)
                ON DUPLICATE KEY UPDATE count = count + 1",
                $table_views,
                $post_id,
                1,
                $period,
                1
            ));

            // Get Referer header
            $referer = $request->get_header('referer');

            // Optional: fallback if not present
            if (!$referer) {
                $referer = isset($_SERVER['HTTP_REFERER'])
                    ? sanitize_text_field(wp_unslash($_SERVER['HTTP_REFERER']))
                    : null;
            }
            $referer_hash = md5($referer); // Hash the referer for storage

            $table_ref = $wpdb->prefix . 'advico_referers';
            $wpdb->query($wpdb->prepare(
                "INSERT INTO %i (id, type, referer_hash, referer_url, period, count)
                 VALUES (%d, 1, %s, %s, %s, 1)
                 ON DUPLICATE KEY UPDATE count = count + 1",
                $table_ref,
                $post_id,
                $referer_hash,
                $referer,
                $period
            ));

            return new \WP_REST_Response([
                'post_id' => $post_id,
                'counted' => true,
                'cookie' => [
                    'name'   => $cookie_name,
                    'value'  => $cookie_value,
                    'expiry' => $expiry,
                ],
            ]);
        }

        // visted (cookie)
        return new \WP_REST_Response([
            'post_id' => $post_id,
            'counted' => false,
            'cookie' => [
                'name'   => $cookie_name,
                'value'  => $cookie_header ?? '',
                'expiry' => $expiry ?? '',
            ],
        ]);
    }


    /**
     * Get Views
     * dynamic loading and prevent caching of the displayed views count.
     */
    public function get_views(\WP_REST_Request $request)
    {


        $params = $request->get_json_params();
        $post_id = absint($params['postId'] ?? 0);

        if (!$post_id) {
            return new \WP_REST_Response(['status' => 'error', 'message' => 'Post ID is required'], 400);
        }
        $checker = new VisitorDisplay($post_id);

        if ($checker->shouldExclude()) {
            return new \WP_REST_Response([
                'post_id' => $post_id,
                'roles' => wp_get_current_user()->roles[0],
                'message' => 'Visitor excluded',
            ]);
        };


        global $wpdb;
        $table_views = $wpdb->prefix . 'advico_views';

        // Get total views from database
        $views = $wpdb->get_results($wpdb->prepare(
            "SELECT SUM(count) 
            FROM %i 
            WHERE id = %d 
            AND type = 1",
            $table_views,
            $post_id
        ));


        return new \WP_REST_Response([
            'status' => 'success',
            'data'   => [
                'total_views' => absint($views) ?? 0,

            ]
        ], 200);
    }
}
