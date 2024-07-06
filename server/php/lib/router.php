<?php

namespace Lib;

class Router
{
	private $routers = [];
	private $method = '';
	private $path = [];

	public $controller = '\Module\Page';
	public $action = 'home';
	public $params = [];
	public $queries = [];
	public $error = false;
	public $return = '';

	public function __construct($path = null)
	{
		$this->routers = [
			'get' => [],
			'post' => [],
			'delete' => []
		];
		$this->method = strtolower($_SERVER['REQUEST_METHOD'] ?? 'get');
		$this->path = explode('/', $path ?? trim($_SERVER['REQUEST_URI'] ?? '/', '/'));
	}

	public function get($url, $ctrl = null, $act = null)
	{
		return $this->config('get', $url, $ctrl, $act);
	}

	public function post($url, $ctrl = null, $act = null)
	{
		return $this->config('post', $url, $ctrl, $act);
	}

	public function delete($url, $ctrl = null, $act = null)
	{
		return $this->config('delete', $url, $ctrl, $act);
	}

	public function all($url, $ctrl = null, $act = null)
	{
		foreach (array_keys($this->routers) as $method) {
			$this->config($method, $url, $ctrl, $act);
		}
		return $this;
	}

	private function config($method, $url, $ctrl, $act)
	{
		$this->routers[$method][$url] = [
			$ctrl ?? $this->controller,
			$act ?? $this->action
		];
		return $this;
	}

	public function run()
	{
		return $this->resolve()->mount();
	}

	public function resolve()
	{
		$this->controller = '\Module\Index';
		$this->action = 'index';
		$this->params = [];
		$this->queries = $_GET;

		$dec = $this->searchRouter($this->routers);
		if ($dec) {
			if ($dec[0]) $this->controller = $dec[0];
			if ($dec[1]) $this->action = $dec[1];
			if ($dec[2]) $this->params = $dec[2];
			return $this;
		}

		// Second Router search
		$ac = '';
		foreach ($this->path as $k => $v) {
			$ac .= '/' . strtolower($v);
			if (isset($this->routers[$this->method][$ac])) {
				$this->controller = $this->routers[$this->method][$ac][0];
				$this->action = $this->routers[$this->method][$ac][1];
				$this->params = array_slice($this->path, $k + 1);
				break;
			}

			$this->params = $this->path;
		}
		e($this, true);
		return $this;
	}

	public function mount()
	{
		$this->return = null;
		$this->error = false;

		if (class_exists($this->controller)) {
			$controller = new $this->controller;
		} else {
			$this->error = true;
			return $this->send();
		}

		$action = $this->action;
		if ($controller && is_object($controller)) {
			if (method_exists($controller, $this->action))
				$this->return = $controller->$action($this->params, $this->queries);
			elseif (method_exists($controller, 'index'))
				$this->return = $controller->index($this->params, $this->queries);
			else {
				$this->error = true;
				return $this->send();
			}
		}

		return $this->send($this->return);
	}
	
		private function searchRouter($routes)
		{
			$req = trim(implode('/', $this->path), '/');
	
			foreach ($routes[$this->method] as $request => $route) {
				if (
					$route[0] === null
					|| !preg_match_all(
						'#^' . trim($request, '/') . '$#',
						$req,
						$matches,
						PREG_SET_ORDER
					)
				) {
					continue;
				}
				$route[2] = array_slice($matches[0], 1);
				return $route;
			}
			//não existe rotas
			return false;
		}

	public function send($data = [], $error = false)
	{
		$error = $error === false ? $this->error : $error;

		header('Content-Type: application/json');
		if ($error || $data === false) {
			header('HTTP/1.1 404 Not Found');
			ob_end_clean();
		} else {
			header('HTTP/1.1 200 OK');
			echo json_encode(["data" => $data, "error" => $error]);
		}
		exit();
	}

	// -------------------------------------------------------------- UTILS
	public function e($o = null, $exit = false)
	{
		echo "<pre>" . print_r($o === null ? $this : $o, 1) . "</pre>";
		$exit && exit();
		return $this;
	}
}