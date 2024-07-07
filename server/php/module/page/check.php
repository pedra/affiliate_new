<?php

namespace Module\Page;
use \Module\Page\BasePage;

class Check extends BasePage {

	function __construct()
	{
		parent::__construct();
	}

	public function index($params, $queries, $post)
	{
		$code = $params[0] ?? false;
		if(!$code) return goToHome();

		$res = $this->db->query(
			"select id, verification_link
			 from user
			 where verification_link = :code", [":code" => $code]);

		if(isset($res[0]) && $res[0]['id']) {			
			include_once PATH_TEMPLATE . '/page/check.php';
			exit;
		}

		goToHome();
	}
}