<?php

namespace Advico\App\Controllers;

if (! defined('ABSPATH')) exit;

use Advico\Libs\Utils\Cache;

use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;


class Settings
{

    public function get_counts()
    {

        $post_types = get_post_types(['public' => true], 'objects');

        unset($post_types['reply'], $post_types['attachment']);

        $saved_settings = json_decode(get_option('advico_settings_count', '{}'), true);

        $selected_exclude_visitors = $saved_settings['exclude_visitors'] ?? [];
        $selected_post_types = $saved_settings['post_types'] ?? [];
        $selected_interval_count = $saved_settings['interval_count'] ?? "";
        $selected_interval_unit = $saved_settings['interval_unit'] ?? "";

        // Siapkan array post_types dengan properti 'selected'
        $post_type_settings = [];
        foreach ($post_types as $slug => $obj) {
            $post_type_settings[] = [
                'id' => $slug,
                'label' => $obj->label,
                'selected' => in_array($slug, (array) $selected_post_types),
            ];
        }


        // Daftar exclude_visitors statis + 'selected'
        //crawlers,logged in users, guests ,selected user roles
        //selected user roles: Administrator, Author, Contributor, Editor, Subscriber
        $exclude_visitors = [
            ['id' => 'crawlers', 'label' => 'Crawlers'],
            ['id' => 'bots', 'label' => 'AI Bots'],
            ['id' => 'logged_in', 'label' => 'Logged in Users'],
            ['id' => 'guests', 'label' => 'Guests'],
            ['id' => 'administrator', 'label' => 'Administrator'],
            ['id' => 'author', 'label' => 'Author'],
            ['id' => 'contributor', 'label' => 'Contributor'],
            ['id' => 'editor', 'label' => 'Editor'],
            ['id' => 'subscriber', 'label' => 'Subscriber'],
        ];

        foreach ($exclude_visitors as &$exclude) {
            $exclude['selected'] = in_array($exclude['id'], (array) $selected_exclude_visitors);
        }

        // Kembalikan semua data
        $settings = [
            'post_types' => $post_type_settings,
            'exclude_visitors' => $exclude_visitors,
            'interval_count' => $selected_interval_count,
            'interval_unit' => $selected_interval_unit,
        ];

        return new \WP_REST_Response([
            'status' => 'success',
            'data' => $settings,
        ], 200);
    }

    public function update_counts(WP_REST_Request $request)
    {
        $params = json_decode($request->get_body(), true);

        /// Validate and sanitize the input
        $post_types = isset($params['post_type']) ? array_map('sanitize_text_field', (array) $params['post_type']) : [];
        $exclude_visitors = isset($params['visitor_type']) ? array_map('sanitize_text_field', (array) $params['visitor_type']) : [];
        $interval_count = isset($params['interval_count']) ? sanitize_text_field($params['interval_count']) : '24';
        $interval_unit = isset($params['interval_unit']) ? sanitize_text_field($params['interval_unit']) : 'hours';
        // Merge with existing settings
        $settings = json_decode(get_option('advico_settings_count'), true) ?? [];

        $settings['post_types'] = $post_types;
        $settings['exclude_visitors'] =  $exclude_visitors;
        $settings['interval_count'] = $interval_count;
        $settings['interval_unit'] = $interval_unit;
        // Save as JSON
        update_option('advico_settings_count', wp_json_encode($settings));

        Cache::set_cache('advico_settings_count', $settings);

        return new \WP_REST_Response([
            'status' => 'success',
            'message' => 'Settings updated successfully',
            'data' => [
                'post_types' => $post_types,
                'interval_count' => $interval_count,
                'interval_unit' => $interval_unit,
            ]
        ], 200);
    }


    public function get_display()
    {

        $post_types = get_post_types(['public' => true], 'objects');

        unset($post_types['reply'], $post_types['attachment']);

        $saved_settings = json_decode(get_option('avc_settings', '{}'), true);

        $selected_exclude_visitors = $saved_settings['user_types'] ?? [];
        $selected_views_label = $saved_settings['views_label'] ?? [];
        $selected_post_types = $saved_settings['post_types'] ?? [];
        $selected_page_types = $saved_settings['page_types'] ?? [];
        $selected_display_styles = $saved_settings['display_styles'] ?? [];

        // Siapkan array post_types dengan properti 'selected'
        $post_type_settings = [];
        foreach ($post_types as $slug => $obj) {
            $post_type_settings[] = [
                'id' => $slug,
                'label' => $obj->label,
                'selected' => in_array($slug, (array) $selected_post_types),
            ];
        }

        // Daftar page types statis + 'selected'
        $page_types = [
            ['id' => 'home', 'label' => 'Home'],
            ['id' => 'archive', 'label' => 'Archive'],
            ['id' => 'single', 'label' => 'Single'],
        ];
        foreach ($page_types as &$page_type) {
            $page_type['selected'] = in_array($page_type['id'], (array) $selected_page_types);
        }

        // Daftar display styles statis + 'selected'
        $display_styles = [
            ['id' => 'icon', 'label' => 'Icon'],
            ['id' => 'label', 'label' => 'Label'],
        ];
        foreach ($display_styles as &$style) {
            $style['selected'] = in_array($style['id'], (array) $selected_display_styles);
        }
        $exclude_visitors = [
            ['id' => 'crawlers', 'label' => 'Crawlers'],
            ['id' => 'logged_in', 'label' => 'Logged in Users'],
            ['id' => 'guests', 'label' => 'Guests'],
            ['id' => 'administrator', 'label' => 'Administrator'],
            ['id' => 'author', 'label' => 'Author'],
            ['id' => 'contributor', 'label' => 'Contributor'],
            ['id' => 'editor', 'label' => 'Editor'],
            ['id' => 'subscriber', 'label' => 'Subscriber'],
        ];

        foreach ($exclude_visitors as &$exclude) {
            $exclude['selected'] = in_array($exclude['id'], (array) $selected_exclude_visitors);
        }

        // return data
        $settings = [
            'views_label' => $selected_views_label,
            'position' => $saved_settings['position'] ?? 'after',
            'post_types' => $post_type_settings,
            'page_types' => $page_types,
            'display_styles' => $display_styles,
            'user_types' => $exclude_visitors,
        ];

        return new \WP_REST_Response([
            'status' => 'success',
            'data' => $settings,
        ], 200);
    }


    public function update_display(WP_REST_Request $request)
    {
        $params = json_decode($request->get_body(), true);

        /// Validate and sanitize the input
        $post_types = isset($params['post_type']) ? array_map('sanitize_text_field', (array) $params['post_type']) : [];
        $page_types = isset($params['page_type']) ? array_map('sanitize_text_field', (array) $params['page_type']) : [];
        $display_styles = isset($params['display_style']) ? array_map('sanitize_text_field', (array) $params['display_style']) : [];
        $label = isset($params['views_label']) ? sanitize_text_field($params['views_label']) : '';
        $position = isset($params['position']) ? sanitize_text_field($params['position']) : 'after';
        $user_types = isset($params['user_type']) ? array_map('sanitize_text_field', (array) $params['user_type']) : [];
        // Merge with existing settings
        $settings = json_decode(get_option('avc_settings'), true) ?? [];

        $settings['post_types'] = $post_types;
        $settings['page_types'] = $page_types;
        $settings['display_styles'] = $display_styles;
        $settings['views_label'] = $label;
        $settings['position'] = $position;
        $settings['user_types'] = $user_types;
        // Save as JSON
        update_option('avc_settings', wp_json_encode($settings));
        Cache::set_cache('avc_settings', $settings);
        return new \WP_REST_Response([
            'status' => 'success',
            'message' => 'Settings updated successfully',
            'data' => [
                'post_types' => $post_types,
                'page_types' => $page_types,
                'display_styles' => $display_styles,
                'views_label' => $label,
                'position' => $position
            ]
        ], 200);
    }
}
