<?php

namespace Advico\Admin;

if (! defined('ABSPATH')) {
	exit;
}

use Advico\App\Traits\Singleton;

/**
 * Class Menu
 *
 * Represents the admin menu management for the plugin.
 *
 * @package Advico\Admin
 */
class Menu
{

	use Singleton;

	/**
	 * Parent slug for the menu.
	 *
	 * @var string
	 */
	private $parent_slug = 'advico-views-counter';

	/**
	 * Initializes the admin menu.
	 *
	 * @return void
	 */
	public function init()
	{
		// Hook the function to the admin menu.
		add_action('admin_menu', array($this, 'menu'));
	}

	/**
	 * Adds a menu to the WordPress admin dashboard.
	 *
	 * @return void
	 */
	public function menu()
	{

		add_menu_page(
			__('Advanced Views Counter', 'advanced-views-counter'),
			__('Advanced Views Counter', 'advanced-views-counter'),
			'manage_options',
			$this->parent_slug,
			array($this, 'admin_page'),
			ADVICO_PLUGIN_ASSETS_URL . '/icons/icon-16x16.png',
			3
		);

		$plugin_url = admin_url('/admin.php?page=' . $this->parent_slug);

		$current_page = get_admin_page_parent();

		if ($current_page === $this->parent_slug) {
			$plugin_url = '';
		}

		$submenu_pages = array(
			array(
				'parent_slug' => $this->parent_slug,
				'page_title'  => __('Dashboard', 'advanced-views-counter'),
				'menu_title'  => __('Dashboard', 'advanced-views-counter'),
				'capability'  => 'manage_options',
				'menu_slug'   => $this->parent_slug,
				'function'    => array($this, 'admin_page'), // Uses the same callback function as parent menu.
			),

			array(
				'parent_slug' => $this->parent_slug,
				'page_title'  => __('Settings', 'advanced-views-counter'),
				'menu_title'  => __('Settings', 'advanced-views-counter'),
				'capability'  => 'manage_options',
				'menu_slug'   => $plugin_url . '/#/settings',
				'function'    => array($this, 'admin_page'),
			),
		);

		$plugin_submenu_pages = apply_filters('advico_submenu_pages', $submenu_pages);

		foreach ($plugin_submenu_pages as $submenu) {

			add_submenu_page(
				$submenu['parent_slug'],
				$submenu['page_title'],
				$submenu['menu_title'],
				$submenu['capability'],
				$submenu['menu_slug'],
				$submenu['function']
			);
		}
	}


	public function admin_page()
	{
		echo '<div id="advico-admin" class="advico-app"></div>';
	}
}
