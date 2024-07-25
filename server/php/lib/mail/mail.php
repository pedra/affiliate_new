<?php

namespace Lib\Mail;

include_once __DIR__ . '/PHPMailer.php';
include_once __DIR__ . '/Exception.php';
include_once __DIR__ . '/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class Mail 
{

	private static $node = null;

	private $error = null;

	private $mail = null;

	private $from = null;

	function __construct()
	{
		$this->error = null;
		$this->from = ENV['MAIL_FROM'];
		$this->mail = new PHPMailer(true);

		$this->mail->isSMTP();                       			//Send using SMTP
		$this->mail->SMTPAuth = true;              				//Enable SMTP authentication
		$this->mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;	//Enable implicit TLS encryption
		
		$this->mail->Host = ENV['MAIL_HOST']; 					//Set the SMTP server to send through
		$this->mail->Username = ENV['MAIL_USERNAME'];			//SMTP username
		$this->mail->Password = ENV['MAIL_PASSWORD'];			//SMTP password
		$this->mail->Port = ENV['MAIL_PORT']; 
		
		//TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
		//$this->mail->SMTPDebug = SMTP::DEBUG_SERVER;        	//Enable verbose debug output

		if (!is_object(static::$node)) static::$node = $this;
	}

	public static function this()
	{
		if (is_object(static::$node)) return static::$node;
		return static::$node = new static();
	}

	public function send
	(
		$to = null, 
		$subject = null, 
		$body = null, 
		$altBody = null,
		$attachments = null
	) {
		$this->mail->clearAllRecipients();
		$this->mail->clearAttachments();
		$this->mail->clearCustomHeaders();
		$this->error = null;

		$this->mail->setFrom($this->from);

		if (is_array($to)) foreach ($to as $t) $this->mail->addAddress($t ?? $this->from);
		else $this->mail->addAddress($to ?? $this->from);

		// Blind carbon copy - BCC
		if(isset(ENV['MAIL_BCC']) && ENV['MAIL_BCC'] != '' && ENV['MAIL_BCC'] != null) {
			$bcc = explode(',', ENV['MAIL_BCC']);
			foreach ($bcc as $b) $this->mail->addBCC(trim($b));
		}

		$this->mail->isHTML(true);
		$this->mail->Subject = $subject ?? 'Subject';
		$this->mail->Body = $body ?? 'Html Body';
		$this->mail->AltBody = $altBody ?? 'body';
		
		if($attachments != null) {
			if (is_array($attachments)) foreach ($attachments as $attachment) {
				$this->mail->addAttachment($attachment);
			} else $this->mail->addAttachment($attachments);
		}
		
		try {
			return $this->mail->send();
		} catch (Exception $e) {
			return $this->error = $this->mail->ErrorInfo;
		}
	}
}
