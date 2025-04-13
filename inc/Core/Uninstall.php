<?php

namespace AVC\Core;

if (! defined('ABSPATH')) {
	exit;
}

if (! defined('WP_UNINSTALL_PLUGIN')) {
	exit;
}


use AVC\App\Traits\Singleton;

/**
 * This class is responsible for the functionality after uninstall plugin
 */
class Uninstall
{


	use Singleton;

	/**
	 * Initialize the class
	 *
	 * @return void
	 */
	public function init()
	{

		// $this->install_pages();
		// $this->uninstall_tables();
		$this->remove_data();
	}

	/**
	 * Install the pages
	 *
	 * @return void
	 */
	private function uninstall_pages() {}

	/**
	 * Uninstall the tables
	 *
	 * @return void
	 */
	private function uninstall_tables()
	{

		global $wpdb;

		$table_name = $wpdb->prefix . 'avc_views';
		$table_name = sanitize_key($table_name);
		$wpdb->query("DROP TABLE IF EXISTS $table_name");
	}

	/**
	 * Remove Data
	 *
	 * @return void
	 */
	private function remove_data()
	{
		// Hapus option setting
		delete_option('avc_settings_count');
	}
}
