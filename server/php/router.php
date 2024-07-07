<?php
// Redirects if host is fd2e.com
if ($_SERVER['HTTP_HOST'] == 'fd2e.com') {
	goToUrl(ENV['URL'] . '/c' . $_SERVER['REQUEST_URI']);
	exit;
}

// e([$_SERVER, $_GET, $_POST], true);

/**
 * Request: http://localhost/sub/url?q=teste&name=Paulo%20Rocha
 *
 *		[REQUEST_URI] => /sub/url?q=teste&name=Paulo%20Rocha
 *      [PATH_INFO] => /sub/url
 * 
 *      [SCRIPT_NAME] => /index.php
 *      [PHP_SELF] => /index.php/sub/url
 * 
 *      [REQUEST_METHOD] => GET
 *      [QUERY_STRING] => q=teste&name=Paulo%20Rocha
 *
 *	GET:
 *		[q] => teste
 *      [name] => Paulo Rocha
 * 
 *  Same as above, but with POST method:
 * 
 * 		[REQUEST_METHOD] => POST
 * 
 *  POST:
 * 		[q] => teste
 *      [name] => Bill Rocha
 * 
 * 
 *  JAVASCRIPT:
 * 
 * 
	var f = new FormData()
	f.append('q', 'teste')
	f.append('name', 'Bill Rocha')

	fetch('http://localhost/sub/uril?q=teste&name=Paulo%20Rocha',{method: "POST", body: f})
 * 
 * 
 */

// ROUTER ----------------------------------------------------------------------
(new Lib\Router())
	// Page
	->get('/', '\Module\Page\Home', 'index')
	->get('/profile', '\Module\Page\Profile', 'index')

	// DEBUG begin
	->get('/debug', '\Module\NuTSy', 'test')
	//->get('/debug/(?<id>.*?)/(?<name>[^/]*)', '\Module\User', 'TEST') // [id] = alphanumeric + [name] = alphanumeric
	//->get('/debug', '\Module\User', 'TEST')
	// ->get('/sub/url/(?<id>.*?)', '\Module\User', 'TEST') // > [id] = alphanumeric
	->get('/sub/url/(?<id>(\d+)?)', '\Module\User', 'TEST') // > [id] = 12345 (numeric)
	->get('/sub/url/(?<id>.*?)/(?<name>[^/]*)', '\Module\User', 'TEST') // [id] = alphanumeric + [name] = alphanumeric
	->get('/sub/url', '\Module\User', 'TEST')
	// DEBUG end
	
	// Check the link sent to the email in the affiliate registration.
	->get('/v/(.*)', '\Module\Page\Check', 'index')
	->get('/v', '\Module\Page\Check', 'goToHome')
	
	// Add affiliate
	->post('/a/submit', '\Module\User', 'submit')
	->post('/a/verify', '\Module\User', 'verify')

	// APIs
	->get('/a/countries', '\Module\Page\Join', 'countries')

	// Profile APIs
	->get('/a/affiliates', '\Module\Page\Profile', 'affiliates')
	->post('/a/setstatus', '\Module\User', 'setStatus')

	// User
	->post('/profile', '\Module\User', 'getUserByLink')
	
	// Auth
	->post('/login', '\Module\Auth', 'login')
	->post('/logout', '\Module\Auth', 'logout')
	
	// Join by affiliate link
	->get('/c/(.*)', '\Module\Page\Join', 'index')
	
	// Show "home" page if no route is found
	->get('/404', '\Module\Page\BasePage', 'notFound')
	->get('(.*)', '\Module\Page\Home', 'notFound')
	->run();