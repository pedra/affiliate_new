<?php

namespace Module\Page;
use \Module\Page\BasePage;

class Home extends BasePage {

	function __construct()
	{
		parent::__construct();
	}
	
	public function index($params, $queries, $post) 
	{
		include_once PATH_TEMPLATE . '/page/index.php';
		exit('chegou');
	}
}