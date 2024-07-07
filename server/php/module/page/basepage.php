<?php

namespace Module\Page;

use \Lib\Mysql as Mysql;
use \Module\Auth as Auth;

class BasePage
{

	protected $db = null;

	function __construct()
	{
		$this->db = new Mysql();
	}

	public function notFound($params, $queries, $post)
	{
		header('HTTP/1.1 404 Not Found');
		header('Status: 404 Not Found');
		include_once PATH_TEMPLATE . '/page/page404.php';
		exit();
	}

	public function goToHome()
	{
		goToHome();
		exit();
	}

	public function countries()
	{
		$sql =
			"select id, name, iso3, phonecode, native
			from country
			order by name asc";

		$res = $this->db->query($sql);

		if ($res[0])
			return $res;
		return false;
	}
}