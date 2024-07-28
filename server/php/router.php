<?php
// Redirects if host is fd2e.com
if ($_SERVER['HTTP_HOST'] == 'fd2e.com') {
	goToUrl(ENV['URL'] . '/c' . $_SERVER['REQUEST_URI']);
	exit;
}

// ROUTER ----------------------------------------------------------------------
(new Lib\Router())
	->get('/xxx/(.*)', '\Module\User', 'xxx')
	// Page
	->get('/', '\Module\Page\Home', 'index')
	->get('/profile', '\Module\Page\Profile', 'index')

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

	// Ping
	->get('/ping', '\Module\Ping', 'index')
	
	// Show "home" page if no route is found
	->get('/404', '\Module\Page\BasePage', 'notFounds')
	->get('(.*)', '\Module\Page\Homes', 'notFounds')
	->run();



	/**
	---	Router Syntax ---

	(new Lib\Router())  // Call Router ...
	->< verb > ('< path >', '\< namespace ~ >\< class >', '< action/method >' )
	->< verb > ('< path >', < closure function ($params, $queries, $post) ... > )
	->< verb > ('< path >', < string: path to static page in PATH_TEMPLATE > )

	Verb = get | post | delete
		- OR -
	Verb = "all" to listen to all available verbs in the same path (get|post|delete)

	Path = 
		Simple: /path/to/route (without the host - is: https://site_name.com/path/to/route)

			- OR -
		Regex: path/to/(.*) (with the host - is: https://site_name.com/path/to/12345)
			results: params[0] = 12345
		
			- OR -
		Regex: path/to/(?<id>.*?)/(?<name>[^/]*) (with the host - is: https://site_name.com/path/to/12345/John%20Doe)
			results: params['id'] = 12345
					 params['name'] = John Doe	


	Run the Router with one of the following options:

	->resolve() // Run the router ...
	->mount() // Call the Actions ...

			- OR -
	->run() // Resolve && Mount.


	E.g.: 
	(new Lib\Router())
		->get('/', '\Module\Page', 'home')
		->run();  
		
		https://site_name.com/ 
			returns: 
				class:	\Module\Page.php
				method: home($params, $queries, $post)

			- AND -		
		https://site_name.com/< anything > 
			returns DEFAULT: 
				class:	\Module\Page.php | 
				method: notFound($params, $queries, $post)
	
	 */