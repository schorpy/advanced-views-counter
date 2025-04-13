<?php

namespace AVC\App\Models;

if (! defined('ABSPATH')) {
    exit;
}

use AVC\Helpers\Cache;

class PopupModel
{
    public static function get_all()
    {
        $query = new \WP_Query([
            'post_type'      => 'popzy',
            'posts_per_page' => -1,
        ]);

        $popups = [];

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();


                $popups[] = [
                    'id'          => get_the_ID(),
                    'title'       => get_the_title(),
                    'date'        => get_the_date(),
                    'status'      => get_post_status(),
                    'target'      => get_post_meta(get_the_ID(), 'popzy_target', true),
                    'settings'    => get_post_meta(get_the_ID(), 'popzy_settings', true)
                ];
            }
            wp_reset_postdata();

            return $popups;
        }

        return [];
    }
    public static function get_popup($type, $id)
    {
        if (!in_array($type, ['homepage', 'page', 'post'])) {
            return null;
        }

        $cache_key = match ($type) {
            'homepage' => 'homepage',
            'page' => $id ? "page_{$id}" : 'all_pages',
            'post' => $id ? "post_{$id}" : 'all_posts',
            default => null,
        };

        // Handle page
        if ($type === 'page' && $id) {
            // Step 1: Check cache for specific page first
            $page_cache = Cache::get_cache("page_{$id}");
            if ($page_cache !== false) {
                return $page_cache;
            }

            // Step 2: If specific page cache is not found, query the database for specific page
            $specific_page_from_db = self::get_from_db("page_{$id}");
            if ($specific_page_from_db !== null) {

                return $specific_page_from_db;
            }

            // Step 3: If specific page is not found, return the 'all_pages' popup

            $all_pages_cache = Cache::get_cache("all_pages");
            if ($all_pages_cache !== false) {
                return $all_pages_cache;
            }

            // Step 4: If both specific page and all pages caches are not found, fetch 'all_pages' from the database
            $all_pages_from_db = self::get_from_db("all_pages");
            if ($all_pages_from_db !== null) {

                return $all_pages_from_db;
            }


            return null;
        }

        //handle post

        if ($type === 'post' && $id) {

            $post_cache = Cache::get_cache("post_{$id}");
            if ($post_cache !== false) {
                return $post_cache;
            }

            $specific_post_from_db = self::get_from_db("post_{$id}");
            if ($specific_post_from_db !== null) {

                return $specific_post_from_db;
            }

            $all_posts_cache = Cache::get_cache("all_posts");
            if ($all_posts_cache !== false) {
                return $all_posts_cache;
            }

            $all_posts_from_db = self::get_from_db("all_posts");
            if ($all_posts_from_db !== null) {
                return $all_posts_from_db;
            }


            return null;
        }

        if (!$cache_key) {
            return null;
        }

        // Fetch popup from cache (for other types)
        $popup = Cache::get_cache($cache_key);
        if ($popup !== false) {
            return $popup;
        }

        return self::get_from_db($cache_key);
    }

    private static function get_from_db($cache_key)
    {

        $query = new \WP_Query([
            'post_type'      => 'popzy',
            'posts_per_page' => 1,
            'meta_query'     => [
                [
                    'key'   => 'popzy_target',
                    'value' => $cache_key,
                    'compare' => '='
                ]
            ]
        ]);

        if ($query->have_posts()) {
            $query->the_post();
            $post_content = get_the_content(); // Get the raw content
            $blocks = parse_blocks($post_content); // Parse Gutenberg blocks
            $description = '';


            foreach ($blocks as $block) {
                $description .= render_block($block);
            }

            $popup = [
                'id'          => get_the_ID(),
                'title'       => get_the_title(),
                'description' => $description,
                'target'      => get_post_meta(get_the_ID(), 'popzy_target', true),
                'settings'    => get_post_meta(get_the_ID(), 'popzy_settings', true)
            ];
            wp_reset_postdata();

            Cache::set_cache($cache_key, $popup);
            return $popup;
        }

        return null;
    }
}
