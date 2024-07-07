<?php

namespace Module;
use \Lib\Mysql as Mysql;
use \Lib\Mail\Mail as Mail;
use \Module\Auth as Auth;

class User {

	private $db = null;

	function __construct()
	{
		$this->db = new Mysql();
	}

	public function getUserByLink($params, $queries, $post)
	{
		(new Auth)->check();

		if(!isset($post['link'])) return false;

		$link = $post['link'];
		$sql = 
		"select id, name
			from user
			where code = :link";
		$res = $this->db->query($sql, [":link" => $link]);
		if(isset($res[0])) return $res[0];
		return false;
	}

	public function submit($params, $queries, $post)
	{
		if(!isset($post['name']) && $post['name'] != '')
			return ['error' => true, 'msg' => '"Name" cannot be empty!'];
		if(!isset($post['email']) && !filter_var($post['email'], FILTER_VALIDATE_EMAIL))
			return ['error' => true, 'msg' => '"Email" is not valid!'];
		if(!isset($post['password']) && strlen($post['password']) < 8)
			return ['error' => true, 'msg' => '"Password" must be at least 8 characters!'];
		if(!isset(($post['country'])) && !$this->countryExists(0 + $post['country'])) 
			return ['error' => true, 'msg' => '"Country" is not valid!'];
		if(!isset($post['phone']) && strlen($post['phone']) < 6)
			return ['error' => true, 'msg' => '"Phone" must be at least 6 characters!'];
		if(!isset($post['company']) && strlen($post['company']) < 6)
			return ['error' => true, 'msg' => '"Company" must be at least 6 characters!'];
		if(!isset($post['projects']) && !str_contains($post['projects'], 'around'))
			return ['error' => true, 'msg' => '"Projects" must contain "around"!'];
		if(!isset($post['affiliate']) && $post['affiliate'] == '')
			return ['error' => true, 'msg' => 'This affiliate is not enabled!<br>Check if the <b>link</b> is correct or contact us.'];
		
		$affiliate = trim($post['affiliate']);
		if(!$this->userExists($affiliate))
			return ['error' => true, 'msg' => 'This affiliate is not enabled!<br>Check if the <b>link</b> is correct or contact us.'];

		$name = trim($post['name']);
		$email = trim($post['email']);
		if($this->emailExists($email))
			return ['error' => true, 'msg' => 'Email already exists!'];

		$password = trim($post['password']);
		$country = 0 + $post['country'];
		$phone = trim($post['phone']);
		$company = trim($post['company']);
		$projects = trim($post['projects']);

		$verification_key = rand(100000, 999999);
		$verification_link = uniqid();

		$res = 72456;
		$up = 72456;
		
		$sql =
		"insert into user
			set affiliate=:affiliate,
			created=NOW(),
			verified=NULL,
			approved=NULL,
			code=:code,
			verification_key=:verification_key,
			verification_link=:verification_link,
			secpass=:secpass,

			name=:name,
			email=:email,
			password=:password,
			country=:country,
			phone=:phone,
			company=:company,
			projects=:projects";

		$res = $this->db->insert($sql, [
			":secpass" => secured_encrypt($password),
			":code" => "111",
			":verification_key" => $verification_key,
			":verification_link" => $verification_link,

			":affiliate" => $affiliate,
			":name" => $name,
			":email" => $email,
			":password" => password_hash($password, PASSWORD_DEFAULT),
			":country" => $country,
			":phone" => $phone,
			":company" => $company,
			":projects" => $projects
		]);

		if($res) {
			$can = new \Lib\Can();
			$code = $can->encode($res) . $can->encode(rand(1000, 9990));
			$sql = "update user
					set code=:code
					where id=:id";
			$up = $this->db->update($sql, [
				":code" => $code, 
				":id" => $res
			]);
			
			if($up) {
				
				$link = ENV['SHORT_URL'] . '/' . $code;
				$vlink = ENV['URL'] . '/v/' . $verification_link;
				$resEmail = $this->sendMailVerification($email, $verification_key, $vlink);

				if($resEmail) {
					return [
						'error' => false, 
						'msg' => 'Thank you for your registration!', 
						'id' => $res,
						'verification_key' => $verification_key,
						'code' => $code,
						'link' => $link,
						'vlink' => $vlink
					];
				}
				
				// Rollback if no email was sent:
				$this->db->delete('user', $res);			
				// TODO: Create a "stack" to try sending "n" times before failing.				
			}
		}
		return ['error' => true, 'msg' => 'Registration failed!'];
	}

	public function userExists($user)
	{
		$sql =
		"select id
			from user
			where id = :user
			and verified is not null
			and approved is not null";
		$res = $this->db->query($sql, [":user" => $user]);
		if(isset($res[0])) return true;
		return false;
	}

	public function countryExists($country)
	{
		$sql =
		"select id
			from country
			where id = :country";
		$res = $this->db->query($sql, [":country" => $country]);
		if(isset($res[0])) return true;
		return false;
	}

	public function emailExists($email)
	{
		// DEVELOP ONLY - BEGIN
		if ($email == 'email@.email.com') return false;
		// DEVELOP ONLY - END

		$sql =
		"select id
			from user
			where email = :email";
		$res = $this->db->query($sql, [":email" => $email]);
		if(isset($res[0])) return true;
		return false;
	}

	public function sendMailVerification ($email, $verification_key, $link)
	{
		$mail = new Mail();
		include PATH_TEMPLATE.'/mail/verify.php';

		// DEVELOP ONLY - BEGIN
		$to = [
			'paulo.rocha@outlook.com',
			'ahcordesign@gmail.com'
		];
		if (!str_contains($email, '@email.com')) array_push($to, $email);
		// DEVELOP ONLY - END

		return $mail->send(
			$to,
			$subject,			
			$body,
			$altBody
		);
	}

	public function sendMailKit($data)
	{
		/**
		 * 1 - Create user in Around API;
		 * 2 - Verify response and validade: 
		 * 		no -> return error & message;
		 * 		yes -> continue...
		 * 3 - Send email "Welcome Kit" to user;
		 * 
		 *4 - Returns "Ok"!! 
		 */

		$name = $data['name'];
		$email = $data['email'];
		$link = ENV['SHORT_URL'] . '/' . $data['code'];
		$projects = explode(',', $data['projects']);

		// 1
		$d = [
			'email' => $email,
			'password' => secured_decrypt($data['secpass']).'1234',
			'affiliate_code' => $link,
			'name' => $name . ' TEST'
		];

		$res = postRequest(ENV['AROUND_API_URL'], $d);
		debug($d);
		debug($res);
		if (!$res || !isset($res->id)) return false;

		// 2
		$name = mb_convert_encoding($name, 'ISO-8859-1', 'UTF-8');
		$mail = new Mail();
		include PATH_TEMPLATE . '/mail/welcome_kit.php';

		// DEVELOP ONLY - BEGIN
		$to = [
			'paulo.rocha@outlook.com',
			'ahcordesign@gmail.com'
		];
		if(!str_contains($email, '@email.com')) array_push($to, $email);
		// DEVELOP ONLY - END

		return $mail->send(
			$to,
			$subject,
			$body,
			$altBody
			//PATH_PUBLIC . '/PT Estrutura Freedom eE.pdf'
		);
	}


	public function verify ($params, $queries, $post)
	{
		if(!isset($post['code'])) return false;

		$code = trim($post['code']);

		$res = $this->db->query(
			"select id, verified
			 from user
			 where verification_key = :code", 
			 [":code" => $code]);

		if(isset($res[0])) return ['error' => false, 'verified' => true];		
		return ['error' => true, 'verified' => false];
	}

	public function setStatus ($params, $queries, $post)
	{
		$user = (new Auth)->check(true);
		if($user === false) return ['error' => true, 'msg' => 'Authentication error (1)'];

		if(!isset($post['id']) || 
			!isset($post['state']) || 
			($post['state'] != 'approved' && $post['state'] != 'enabled') ||
			!isset($post['set'])) return ['error' => true, 'msg' => 'Authentication error (2)'];

		$id = 0 + $post['id'];
		$state = $post['state'];
		$set = $post['set'] == '1' ? true : false;

		$res = $this->db->query(
			"select id, name, email, code, secpass, projects 
			from user 
			where id = :id and affiliate = :aft",
			[':id' => $id, ':aft' => $user['id']]);

		if(!$res) return ['error' => true, 'msg' => 'Authentication error (3)'];

		$setString = $set ? ' now() ' : ' null ';
		$up = $this->db->update(
			"update user
			 set $state = $setString
			 where id = :id",
			 [":id" => $id]);
		if($up) {
			$wk = true;
			if($user['level'] >= 20) {
				$wk = $this->sendMailKit($res[0]);
				if(!$wk) { //Rollback
					$setString = $set ? ' null ' : ' now() ';
					$this->db->update(
						"update user 
						set $state = $setString 
						where id = :id", 
						[":id" => $id]);
				}
			}
			if($wk) return ['error' => false, 'msg' => 'Status updated!'];			
		}
		return ['error' => true, 'msg' => "I couldn't change..."];
	}


	///// DEBUG
	function TEST ($params, $queries, $post)
	{
		//return 'Paulo';
		return [
			'params' => $params, 
			'queries' => $queries, 
			'GET' => $_GET, 
			'POST' => $post
		];
		//$res = $this->db->query('select * from user');
		//return ['test' => $res];
	}
}
