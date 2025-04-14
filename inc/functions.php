<?php

/**
 * Plugin Function file.
 *
 * @since 1.0.1
 *
 * @package Popzy
 */

defined('ABSPATH') || exit;

/**
 * Installs a custom page with the specified title, name, and template file.
 *
 * @param string $page_title               The title of the page.
 * @param string $page_name                The name (slug) of the page.
 * @param string $page_template_file_name The filename of the page template.
 * @return void
 */
function avc_install_page($page_title, $page_name, $page_template_file_name)
{
	// Check if a page with the specified name does not exist.
	// if (! get_page_by_path($page_name)) {
	// 	$args = array(
	// 		'post_title'  => $page_title,
	// 		'post_name'   => $page_name,
	// 		'post_status' => 'publish',
	// 		'post_author' => 1,
	// 		'post_type'   => 'page',
	// 	);
	// 	// Insert a new page.
	// 	$id = wp_insert_post($args);
	// 	// Add post meta for the page template.
	// 	add_post_meta($id, '_wp_page_template', $page_template_file_name);
	// }
}

/**
 * Retrieves the configuration from the specified file.
 *
 * @param string $config_file_name The name of the configuration file.
 * @return array
 *
 * @since 1.0.0
 */
function avc_get_config($config_file_name)
{
	$config_file_path = __DIR__ . '/../config/' . $config_file_name . '.php';
	if (file_exists($config_file_path)) {
		return require $config_file_path;
	}
	return array();
}
/**
 * Remove post views from database when post is deleted.
 *
 * @global object $wpdb
 *
 * @param int $post_id
 * @return void
 */

function delete_post_views($post_id)
{
	global $wpdb;

	$data = [
		'where'		=> ['id' => $post_id],
		'format'	=> ['%d']
	];

	$data = apply_filters('pvc_delete_post_views_where_clause', $data, $post_id);

	$wpdb->delete($wpdb->prefix . 'post_views', $data['where'], $data['format']);
}
