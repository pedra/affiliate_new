<?php
// Redirects if host is fd2e.com
if ($_SERVER['HTTP_HOST'] == 'fd2e.com') {
	goToUrl(ENV['URL'] . '/c' . $_SERVER['REQUEST_URI']);
	exit;
}

// ROUTER ----------------------------------------------------------------------
(new Lib\Router())
	// Page
	->get('/', '\Module\Page\Home', 'index')
	->get('/profile', '\Module\Page\Profile', 'index')

	// DEBUG begin
	->get('/debug', '\Module\User', 'TEST')
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