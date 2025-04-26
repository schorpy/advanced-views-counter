<?php

namespace Advico\Core;

if (! defined('ABSPATH')) {
	exit;
}

if (! defined('WP_UNINSTALL_PLUGIN')) {
	exit;
}

/**
 * This class is responsible for the functionality after uninstall plugin
 */
class Uninstall
{
	/**
	 * Entry point untuk uninstall
	 *
	 * @return void
	 */
	public static function run()
	{
		self::uninstall_tables();
		self::remove_data();
	}

	/**
	 * Uninstall custom tables
	 *
	 * @return void
	 */
	private static function uninstall_tables()
	{
		global $wpdb;

		$allowed = [
			$wpdb->prefix . 'advico_views',
			$wpdb->prefix . 'advico_referers',
		];

		foreach ($allowed as $table_name) {
			$wpdb->query($wpdb->prepare("DROP TABLE IF EXISTS %i", $table_name));
		}
	}

	/**
	 * Delete from options
	 *
	 * @return void
	 */
	private static function remove_data()
	{
		delete_option('advico_settings');
		delete_option('advico_settings_count');
	}
}
