<?php

namespace AVC\Core;

if (! defined('ABSPATH')) {
    exit;
}

class View
{
    public static function Render($path, $data = array())
    {
        $viewFile = sprintf(
            '%s/Views/%s.php',
            dirname(__DIR__),
            str_replace('.', '/', $path)
        );

        if (!file_exists($viewFile)) {
            return;
        }


        (function ($data) use ($viewFile) {
            include $viewFile;
        })($data);
    }
}
