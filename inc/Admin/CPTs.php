<?php

namespace AVC\Admin;

if (! defined('ABSPATH')) {
    exit;
}


use AVC\App\Traits\Singleton;
use AVC\Libs\Utils\CPT;

class CPTs
{
    use Singleton;

    /**
     * Initializes the admin menu.
     *
     * @return void
     */
    public function init()
    {
        $this->register_cpt();
    }
    public function register_cpt()
    {
        CPT::make('popzy')
            ->title('Popzy')
            ->singular_name('Popzy')
            ->plural_name('Popzy')
            ->supports(['title', 'editor'])
            ->add_category_support()
            ->add_tag_support()
            ->register();
    }
}
