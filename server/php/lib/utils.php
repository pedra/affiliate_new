<?php
/* UTILS
------------------------------------------------------------------------------*/
function human_filesize($bytes, $decimals = 2)
{
	if ($bytes == 0) return '0 B';
	$factor = floor((strlen($bytes) - 1) / 3);
	if ($factor > 0) $sz = 'KMGT';
	return sprintf("%.{$decimals}f&nbsp;", 
		$bytes / pow(1024, $factor)) . 
		($sz[$factor - 1] ?? '') . 
		'B';
}

function static_content ()
{	
	$path = trim($_SERVER['REQUEST_URI'], '/');
	$uri = explode('/', $path);
	
	// Loading assets ... (e.g. css/style.css)
	if (in_array($uri[0], explode(',', ENV['ASSETS'])))
	download(PATH_PUBLIC . '/' . $path, false);
}

function download($file, $download = true)
{
	$filename = basename($file);
	$ext = explode('.', $filename);
	$ext = strtolower(end($ext));

	if ($ext == 'css')
		$mimeType = 'text/css';
	else if ($ext == 'js')
		$mimeType = 'text/javascript';
	else if ($ext == 'svg')
		$mimeType = 'image/svg+xml';
	else {
		$mimeType = @mime_content_type($file);
		$mimeType = $mimeType === false ? 'application/octet-stream' : $mimeType;
	}

	if ($download) {
		header('Content-Description: File Transfer');
		header('Content-Disposition: attachment; filename="' . $filename . '"');
	}
	header("Content-Type: $mimeType");
	header('Expires: 0');
	header('Cache-Control: must-revalidate');
	header('Pragma: public');
	header('Content-Length: ' . filesize($file));
	flush();
	readfile($file);

	exit();
}

function secured_encrypt($data)
{
	$first_key = base64_decode(ENV['KEY1']);
	$second_key = base64_decode(ENV['KEY2']);

	$method = "aes-256-cbc";
	$iv_length = openssl_cipher_iv_length($method);
	$iv = openssl_random_pseudo_bytes($iv_length);

	$first_encrypted = openssl_encrypt($data, $method, $first_key, OPENSSL_RAW_DATA, $iv);
	$second_encrypted = hash_hmac('sha3-512', $first_encrypted, $second_key, TRUE);

	$output = base64_encode($iv . $second_encrypted . $first_encrypted);
	return $output;
}

function secured_decrypt($input)
{
	$first_key = base64_decode(ENV['KEY1']);
	$second_key = base64_decode(ENV['KEY2']);
	$mix = base64_decode($input);

	$method = "aes-256-cbc";
	$iv_length = openssl_cipher_iv_length($method);

	$iv = substr($mix, 0, $iv_length);
	$second_encrypted = substr($mix, $iv_length, 64);
	$first_encrypted = substr($mix, $iv_length + 64);

	$data = openssl_decrypt($first_encrypted, $method, $first_key, OPENSSL_RAW_DATA, $iv);
	$second_encrypted_new = hash_hmac('sha3-512', $first_encrypted, $second_key, TRUE);

	if (hash_equals($second_encrypted, $second_encrypted_new))
		return $data;

	return false;
}

function goToHome()
{
	header('Location: /');
	exit();
}

function goToUrl($url)
{
	header('Location: ' . $url);
	exit();
}

function goTo404() {
	header('Location: /404');
	exit();
}


function postRequest($url, $data)
{
	$data = json_encode($data);
	$ch = curl_init($url);

	// Set cURL options.
	curl_setopt($ch, CURLOPT_HEADER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array(
		'Accept: application/json',
		'Content-Type: application/json',
		'Content-Length: ' . strlen($data)));
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

	// Execute the request.
	$response = curl_exec($ch);
	if (curl_errno($ch)) {
		return false;
		//e(['response' => $response, 'error' => curl_error($ch)], true);
	}
	curl_close($ch);	
	return json_decode($response);
}

// TOOLS ---------------------------------------------------------------------*/
function debug($var, $exit = false)
{
	$o = '<div><b>' . date("Y-m-d H:i:s") . '</b><br><pre style="border:1px solid #000;padding:1rem;font-family:monospace,sans-serif">' . print_r($var, true) . '</pre></div>';
	file_put_contents(PATH_PUBLIC . '/debug.html', $o, FILE_APPEND);
	if ($exit) exit(print_r($var, true));
}

function e($o = null, $exit = false)
{
	echo "<pre>" . print_r($o, 1) . "</pre>";
	$exit && exit();
}

function myException($exception)
{
	ob_end_clean();
	echo "<b>Exception:</b> " . $exception->getMessage();
}

function exceptions_error_handler($severity, $message, $filename, $lineno) {
	ob_end_clean();
    throw new ErrorException($message, 0, $severity, $filename, $lineno);
}