<?php

$subject = 'Welcome to FreedomeE!';

$body = '<table style="width:600px;padding:32px;font-family:sans-serif;">'.
	'<tr><td><h1 style="padding:12px 0;margin:0;font-size:38px">Welcome to FreedomeE!</h1></td></tr>'.
	'<tr><td>You have successfully registered as an <b>Affiliate</b>.</td></tr>'.
	'<tr><td style="padding:0 0 16px 0">This is your verification code: </td></tr>' .
	'<tr><td style="padding:16px 0;text-align:center;font-size:32px;color:#468;letter-spacing:16px"><span style="padding: 16px 32px;border:2px solid #468;background:#def">'. $verification_key .'</span></td></tr>'.
	'<tr><td style="padding:16px 0 16px 0">Copy and paste it onto the registration page or click on the following link:</td></tr>'.
	'<tr><td style="text-align:center;font-size:22px"><b><a href="'.$link.'">' . $link . '</a></b></td><tr>'.
	'<tr><td style="padding:16px">&nbsp;</td></tr>'.
	'<tr><td>Thanks,</td></tr>'.
	'<tr><td>FreedomeE Team</td></tr>'.
	'<tr><td><img src="https://fd2e.com/img/logo.jpg" alt="logo"/></td></tr>'.
	'</table>';

$altBody = "Welcome to FreedomeE!
\nYou have successfully registered as an AFFILIATE.
\n\nThis is your verification code: $verification_key
\n\nCopy and paste to the registration page or check your email by following the link below:\n\n$link
\n\n\nThanks,
\nFreedomeE Team";