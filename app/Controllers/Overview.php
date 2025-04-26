<?php

/**
 * Posts Controller
 *
 * This file is used to register all actions for the Posts Controller.
 *
 * @since 1.0.0
 */

namespace Advico\App\Controllers;

if (! defined('ABSPATH')) {
    exit;
}


class Overview
{
    /**
     * Get chart function.
     */
    public function get_chart()
    {
        global $wpdb;
        $table_views = $wpdb->prefix . 'advico_views';

        $results = $wpdb->get_results($wpdb->prepare(
            "SELECT period, SUM(count) as total
             FROM %i
             WHERE period BETWEEN %s AND %s
             GROUP BY period
             ORDER BY period ASC",
            $table_views,
            gmdate('Ymd', strtotime('-6 days')), //date() is affected by runtime timezone changes which can cause date/time to be incorrectly displayed. Use gmdate() instead. 
            gmdate('Ymd')
        ));

        $chartData = [];

        foreach ($results as $row) {
            // Convert '20250410' to a readable date format
            $period = $row->period;
            $date = substr($period, 0, 4) . '-' . substr($period, 4, 2) . '-' . substr($period, 6, 2);

            $chartData[$date] = (int) $row->total;
        }

        // Fill missing dates with 0
        for ($i = 6; $i >= 0; $i--) {
            $day = gmdate('Y-m-d', strtotime("-$i days"));
            if (!isset($chartData[$day])) {
                $chartData[$day] = 0;
            }
        }

        ksort($chartData); // Ensure order by date

        // Format for chart
        $finalData = [];
        foreach ($chartData as $date => $count) {
            $finalData[] = [
                'date' => gmdate("d M Y", strtotime($date)),
                'views' => $count
            ];
        }



        return new \WP_REST_Response([
            'status' => 'success',
            'data'   => $finalData,
        ], 200);
    }


    /**
     * Get referers function.
     */

    public function get_referers(\WP_REST_Request $request)
    {
        global $wpdb;
        $table_ref = $wpdb->prefix . 'advico_referers';
        $results = $wpdb->get_results($wpdb->prepare(
            "SELECT referer_url, SUM(count) as total
             FROM %i
             WHERE period BETWEEN %s AND %s
             GROUP BY referer_hash
             ORDER BY total DESC
             LIMIT 10",
            $table_ref,
            gmdate('Ymd', strtotime('-6 days')),
            gmdate('Ymd')
        ));

        $finalData = [];

        foreach ($results as $row) {
            $referer = $row->referer_url ?? 'Unknown';

            $finalData[] = [
                'name' => $referer,
                'views' => (int) $row->total
            ];
        }

        return new \WP_REST_Response([
            'status' => 'success',
            'data'   => $finalData
        ], 200);
    }

    /**
     * Get Post function.
     */

    public function get_posts(\WP_REST_Request $request)
    {
        global $wpdb;
        $table_views = $wpdb->prefix . 'advico_views';
        $results = $wpdb->get_results($wpdb->prepare(
            "SELECT id, SUM(count) as total
             FROM %i
             WHERE period BETWEEN %s AND %s
             GROUP BY id
             ORDER BY total DESC
             LIMIT 5",
            $table_views,
            gmdate('Ymd', strtotime('-6 days')),
            gmdate('Ymd')
        ));

        $finalData = [];
        foreach ($results as $row) {
            $post = get_post($row->id);
            if ($post) {
                $finalData[] = [
                    'title' => $post->post_title,
                    'url' => get_permalink($row->id),
                    'views' => (int) $row->total
                ];
            }
        }

        return new \WP_REST_Response([
            'status' => 'success',
            'data'   => $finalData
        ], 200);
    }
}
