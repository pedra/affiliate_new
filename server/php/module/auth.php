<?php

namespace Module;
use \Lib\Mysql as Mysql;

class Auth {

	private $db = null;

	function __construct()
	{
		$this->db = new Mysql();
	}

	public function check ($action = false)
	{		
		if (!isset($_SESSION['user'])) {
			if($action !== false) return is_callable($action) ? $action() : false;
			goTo404();
		}

		$id = 0 + $_SESSION['user'];

		$res = $this->db->query(
			"select id, name, level from user where id = :id",
			[":id" => $id]
		);

		if (!isset($res[0])) {
			if ($action !== false) return is_callable($action) ? $action() : false;
			goTo404();
		}

		return $res[0];
	}

	// Login and Verify from email link
	public function login ($params, $queries)
	{
		if(
			!isset($_POST['email']) || 
			!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) || 
			!isset($_POST['password'])) return false;
			
			$email = $_POST['email'];
			$password = trim($_POST['password']);

			$verification_link = $_POST['verification_link'] ?? false; // from link (get)
			$verification_key = $_POST['verification_key'] ?? false; // from Join registry
			$is_verify = $verification_link !== false || $verification_key !== false;
			
			$sql = "
			select id, name, password, level
			from user
			where email = :email 
			#and approved is not null
			and verified is " . ($is_verify ? "null" : "not null");
			
			$data = [":email" => $email];
			if ($verification_link !== false) {
				$data[":check"] = $verification_link;
				$sql .= " and verification_link=:check";
			}
			if ($verification_key !== false) {
				$data[":check"] = $verification_key;
				$sql .= " and verification_key=:check";
			}
			
			$res = $this->db->query($sql, $data);
			if (isset($res[0]) && 
			password_verify($password, $res[0]['password'])) {
				
				if($is_verify) {
					$up = $this->db->update(
						"update user 
						set verified = now(), 
						verification_key = null, 
						verification_link = null 
						where id = :id", 
						[":id" => $res[0]['id']]
					);
					if (!$up) return false;
					/*
					TODO: When there is a user pre-registration table, at this point we create an entry in the USER table, copy the data and delete this line from the USER_TEMP table -- Remembering to run a "cron" to clean up old entries, lost or forgotten registrations more than 24 hours.
					*/
				}
				
				$user = [
					"id" => $res[0]["id"],
					"name" => $res[0]["name"], 
					"level" => $res[0]["level"]
				];
				$_SESSION['user'] = $user["id"];
				$_SESSION['user_level'] = $user["level"];
				$_SESSION['user_name'] = $user["name"];
				
			return $user;
		}
		return false;
	}

	public function logout ()
	{
		session_destroy();
	}
}