<?php
define('PATH_ROOT', dirname(__FILE__));
define('ENV', parse_ini_file(PATH_ROOT . "/.env"));
define('PATH_TEMPLATE', PATH_ROOT . '/template');
define('PATH_PUBLIC', realpath(ENV['PUBLIC_PATH']));

// Helpers ---------------------------------------------------------------------
include_once PATH_ROOT . '/lib/utils.php';

// Error settings --------------------------------------------------------------
ini_set('display_errors', ENV['PRODUCTION'] ? '0' : '1');
ini_set('display_startup_errors', ENV['PRODUCTION'] ? '0' : '1');
error_reporting(E_ALL);
set_error_handler('exceptions_error_handler');

// Global Headers --------------------------------------------------------------
header("Access-Control-Allow-Origin: *");
// header("Content-Security-Policy: connect-src *; default-src *");

// Load static content ---------------------------------------------------------
static_content();

// Auto loader -----------------------------------------------------------------
spl_autoload_register(function ($class) {
	$path = PATH_ROOT . '/' . strtolower(str_replace('\\', '/', $class) . '.php');
	if (file_exists($path)) include_once $path;
});

// Cache & Session -------------------------------------------------------------
ob_start("ob_gzhandler");
session_name("plm450228");
session_start();

// Resolves requests (router) --------------------------------------------------
include_once PATH_ROOT . '/router.php';