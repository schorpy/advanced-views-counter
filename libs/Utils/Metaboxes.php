<?php

namespace AVC\Libs\Utils;

if (! defined('ABSPATH')) exit;

use AVC\App\Traits\Singleton;
use AVC\Helpers\Cache;

class Metaboxes
{
    use Singleton;

    private function __construct()
    {
        add_action('add_meta_boxes', [$this, 'add_popup_meta_box']);
        add_action('save_post', [$this, 'save_popup_meta']);
    }
    public function add_popup_meta_box()
    {
        add_meta_box(
            'popup_page_meta_box',
            'Popzy Setting',
            [$this, 'popup_meta_box_callback'],
            'popzy', //post type
            'advanced', //bottom location
            'high'
        );
    }

    public function popup_meta_box_callback($post)
    {
        // Ambil data meta
        $popup_target = get_post_meta($post->ID, 'popzy_target', true);
        $popup_settings = get_post_meta($post->ID, 'popzy_settings', true);

        // Default values
        $title_value = '';
        $delay_value = '';

        if (!empty($popup_settings) && is_array($popup_settings)) {
            $title_value = $popup_settings['title'] ?? '';
            $delay_value = $popup_settings['delay'] ?? '';
        }

        // get all pages and posts
        $pages = get_pages();
        $posts = get_posts([
            'post_type'      => 'post',
            'posts_per_page' => -1,
        ]);

        // Nonce field for safety
        wp_nonce_field('popzy_meta_box_nonce', 'popzy_meta_box_nonce');

        // Data for view
        $data['options'] = $this->prepare_for_view($posts, $pages);
        $data['selected'] = $popup_target;
        $data['show_title'] = esc_html($title_value);
        $data['delay'] = esc_attr($delay_value);

        \AVC\Core\View::Render('Admin.tab', $data);
    }

    /**
     * prepare for dropdown
     */
    private function prepare_for_view($posts, $pages)
    {
        $options = [
            ['id' => 'homepage', 'text' => 'Homepage'],
            ['id' => 'all_pages', 'text' => 'All Pages'],
            ['id' => 'all_posts', 'text' => 'All Posts'],
        ];

        // Specific Post
        if (!empty($posts)) {
            $options[] = [
                'id'    => 'specific_post',
                'text'  => 'Specific Post',
                'group' => array_map(fn($post) => [
                    'type'  => 'post',
                    'id'    => (string) $post->ID,
                    'text'  => esc_html($post->post_title),
                ], array_map('sanitize_post', $posts)),
            ];
        }

        // Specific Page
        if (!empty($pages)) {
            $options[] = [
                'id'    => 'specific_page',
                'text'  => 'Specific Page',
                'group' => array_map(fn($page) => [
                    'type'  => 'page',
                    'id'    => (string) $page->ID,
                    'text'  => esc_html($page->post_title),
                ], array_map('sanitize_post', $pages)),
            ];
        }

        return $options;
    }



    public function save_popup_meta($post_id)
    {
        // Security check
        if (!isset($_POST['popzy_meta_box_nonce'])) {
            return;
        }

        $nonce = sanitize_text_field(wp_unslash($_POST['popzy_meta_box_nonce']));
        if (!wp_verify_nonce($nonce, 'popzy_meta_box_nonce')) {
            return;
        }


        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }


        $settings = get_post_meta($post_id, 'popzy_settings', true);
        $settings = is_array($settings) ? $settings : [];

        $settings['title'] = sanitize_text_field(wp_unslash($_POST['popzy_option']['title'] ?? ''));
        $settings['delay'] = sanitize_text_field(wp_unslash($_POST['popzy_trigger']['delay'] ?? ''));


        update_post_meta($post_id, 'popzy_settings', $settings);


        if (!empty($_POST['popzy_target']['select'])) {
            $previous_popup_target = get_post_meta($post_id, 'popzy_target', true);
            $value = sanitize_text_field(wp_unslash($_POST['popzy_target']['select']));

            update_post_meta($post_id, 'popzy_target', sanitize_text_field(wp_unslash($_POST['popzy_target']['select'])));

            Cache::delete_cache($previous_popup_target);
        }
    }
}
