<?php

namespace Module\Page;
use \Module\Page\BasePage;
use \Module\Auth as Auth;

class Profile extends BasePage {

	function __construct()
	{
		parent::__construct();
	}

	public function index($params, $queries, $post)
	{
		$user = (new Auth)->check();
		$id = $user['id'];
		$name = $user['name'];

		include_once PATH_TEMPLATE . '/page/profile.php';
		exit();
	}

	public function affiliates($params, $queries, $post)
	{
		$user = (new Auth)->check();
		$id = $user['id'];
		$name = $user['name'];
		$level = $user['level'];

		$res = $this->db->query(
			"select 
				u.id uid,
				a.name aname,
                a.code acode,
                a.email aemail,
				u.level level,
				u.verified verified,
				u.approved approved,
				u.enabled enabled,
				u.name name,
				u.code code,
				u.phone phone,
				u.email email,
				u.company company,
				c.name country,
				c.phonecode phonecode,
				u.projects projects,
				u.secpass secpass

			from user u
			left join country c on c.id = u.country 
			left join user a on a.id = u.affiliate " . 
			($level < 20 ? " where u.affiliate = :id" : ""), 
			 $level < 20 ? [':id' => $id] : []
		);

		if (isset($res[0])) {
			$registered = [];
			$verified = [];
			$approved = [];
			$enabled = [];

			foreach($res as $k => $v) {

				$v['password'] = $level >= 20 ? secured_decrypt($v['secpass']) : false;
				unset($v['secpass']);

				if($v['enabled'] != null) {
					$v['status'] = 'enabled';
					array_push($enabled, $v);
				}
				elseif($v['approved'] != null) {
					$v['status'] = 'approved';
					array_push($approved, $v);
				}
				elseif($v['verified'] != null) {
					$v['status'] = 'verified';
					array_push($verified, $v);
				}
				else {
					$v['status'] = 'registered';
					array_push($registered, $v);
				}
			}
			return ['error' => false, 'data' => [
				'id' => $id,
				'name' => $name,
				'level' => $level >= 20 ? 'adm' : 'user',
				'verified' => $verified,
				'approved' => $approved,
				'enabled' => $enabled,
				'registered' => $registered
			]];
		}
		return [
			'error' => true, 
			'msg' => 'No affiliates found.', 
			'link' => $user['link']
		];
	}
}