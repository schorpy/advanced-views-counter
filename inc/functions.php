<?php

/**
 * Plugin Function file.
 *
 * @since 1.0.0
 *
 * @package Advico
 */

defined('ABSPATH') || exit;



/**
 * Retrieves the configuration from the specified file.
 *
 * @param string $config_file_name The name of the configuration file.
 * @return array
 *
 * @since 1.0.0
 */
function advico_get_config($config_file_name)
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

function advico_delete_views($post_id)
{
	if (!is_numeric($post_id) || intval($post_id) <= 0) {
		return; // Prevent invalid deletions
	}

	global $wpdb;

	$post_id = intval($post_id);

	$wpdb->delete(
		$wpdb->prefix . 'advico_views',
		['id' => $post_id],
		['%d']
	);
}
