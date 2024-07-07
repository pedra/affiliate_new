<?php

namespace Module\Page;
use \Module\Page\BasePage;

class Join extends BasePage {

	function __construct()
	{
		parent::__construct();
	}

	public function index ($params, $queries, $post)
	{
		$sql =
			"select id, name, code
			from user
			where code = :code
			and enabled is not null"; // Check if the user is enabled by Freedomee Adm
		$res = $this->db->query($sql, [":code" => $params[0]]);
		if (isset($res[0])) {

			$name = $res[0]['name'];
			$id = $res[0]['id'];
			$code = $res[0]['code'];

			include_once PATH_TEMPLATE . '/page/join.php';
			exit;
		}

		goToHome();
	}
}