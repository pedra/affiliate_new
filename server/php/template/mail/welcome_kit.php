<?php

$subject = "Hello, $name!";


$pjt = '';
$pj = '';
if(count($projects) > 0) {
	$pjt = '<tr><td style="padding:16px 0 16px 0">These platforms were chosen by you when registering:</td></tr>';
	$pj = '\n\nThese platforms were chosen by you when registering:\n';
	
	foreach ($projects as $p) {
		if($p == 'around' || $p == 'backoffice') continue;
		$pjt .= "<tr><td><b><a href=\"https://$p.freedomee.com\">$p.freedomee.com</a></b></td></tr>";
		$pj .= "\n$p.freedomee.com";
	}
}

$body = '<html><head><title>Hello, '.$name.'!</title></head><body>'.
	'<table style="width:600px;padding:32px;font-family:sans-serif;">'.
	'<tr><td><h1 style="padding:12px 0;margin:0;font-size:38px">Hello, '. $name.'!</h1></td></tr>'.
	'<tr><td>Your registration has been approved.</td></tr>'.
	'<tr><td>Now, you can use your link <b><a href="' . $link . '">' . $link . '</a></b> to invite affiliates.</td></tr>' .
	
	'<tr><td style="padding:16px 0 16px 0">These are the platforms you have access to:</td></tr>' .
	'<tr><td><b><a href="https://around.freedomee.com">around.freedomee.com</a></b></td></tr>' .
	'<tr><td><b><a href="https://backoffice.freedomee.com">backoffice.freedomee.com</a></b></td></tr>' . $pjt .
	
	'<tr><td style="padding:16px 0 16px 0">Now, access the link <b><a href="https://around.freedomee.com/quiz-goals">https://around.freedomee.com/quiz-goals</a></b> and fill out the questionnaire.</td></tr>'.
	
	'<tr><td style="padding:16px">&nbsp;</td></tr>'.
	'<tr><td>Thanks,</td></tr>'.
	'<tr><td>FreedomeE Team</td></tr>'.
	'<tr><td><img src="https://fd2e.com/img/logo.jpg" alt="logo"/></td></tr>'.
	'</table></body></html>';

$altBody = "Hello, $name!
\nYour registration has been approved. Now, you can use your link $link to invite affiliates.
\n\nThese are the platforms you have access to:
\n\nhttps://around.freedomee.com
\nhttps://backoffice.freedomee.com
$pj
\n\n\nThanks,
\nFreedomeE Team";