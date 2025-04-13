<?php

/**
 * Posts Controller
 *
 * This file is used to register all actions for the Posts Controller.
 *
 * @since 1.0.0
 */

namespace AVC\App\Controllers;

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

        // if (empty($datefrom) || empty($dateend)) {
        //     return new \WP_REST_Response([
        //         'status' => 'error',
        //         'message' => 'Parameter required.'
        //     ], 400);
        // }

        $results = $wpdb->get_results($wpdb->prepare(
            "SELECT period, SUM(count) as total
             FROM wp_post_views
             WHERE period BETWEEN %s AND %s
             GROUP BY period
             ORDER BY period ASC",
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

        $datefrom = $request->get_param('from') ? sanitize_text_field($request->get_param('from')) : '';
        $dateend  = $request->get_param('to') ? sanitize_text_field($request->get_param('to')) : '';

        if (empty($datefrom) || empty($dateend)) {
            return new \WP_REST_Response([
                'status' => 'error',
                'message' => 'Parameter "from" dan "to" wajib diisi.'
            ], 400);
        }

        // Konversi ke timestamp UNIX
        $from_ts = strtotime($datefrom . ' 00:00:00');
        $to_ts   = strtotime($dateend . ' 23:59:59');

        // Ambil semua leads dalam range waktu

        $results = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT click_time FROM gmk_leads 
                 WHERE click_time BETWEEN %d AND %d",
                $from_ts,
                $to_ts
            )
        );

        $refererData = [];
        // Hitung jumlah berdasarkan referer
        foreach ($results as $row) {
            $referer = $row->referer ?? 'Unknown';

            if (!isset($refererData[$referer])) {
                $refererData[$referer] = 0;
            }

            $refererData[$referer]++;
        }

        // Format untuk chart
        $finalData = [];
        foreach ($refererData as $referer => $count) {
            $finalData[] = [
                'name' => $referer,
                'lead' => $count
            ];
        }

        return new \WP_REST_Response([
            'status' => 'success',
            'data'   => $finalData
        ], 200);
    }

    /**
     * Get Agents function.
     */

    public function get_agents(\WP_REST_Request $request)
    {
        // global $wpdb;
        // return new \WP_REST_Response([
        //     'status' => 'success',
        //     'data'   => $finalData
        // ], 200);
    }
}
