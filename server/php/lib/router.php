<?php

namespace Lib;

class Router
{
	private $routers = [];
	private $method = '';
	private $path = [];

	private $defaultController = '\Module\Page\Home';
	private $defaultAction = 'notFound';
	private $controller = null;
	private $action = null;
	private $params = [];
	private $query = [];
	private $post = [];
	private $error = false;
	private $return = '';

	public function __construct($path = null)
	{
		$this->routers = [
			'get' => [],
			'post' => [],
			'delete' => []
		];
		$this->method = strtolower($_SERVER['REQUEST_METHOD'] ?? 'get');
		$this->path = explode('/', trim($_SERVER['PATH_INFO'] ?? '', '/'));
		$this->controller = $this->defaultController;
		$this->action = $this->defaultAction;
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
		$url = trim($url, '/');
		$this->routers[$method][$url] = [
			$ctrl = is_callable($ctrl) || 
					(is_string($ctrl) && strlen($ctrl) > 0) || 
					is_bool($ctrl) ? $ctrl : $this->controller,
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
		$this->query = $_GET;
		$this->post = $_POST;

		$dec = $this->searchRouter($this->routers);
		if ($dec) {
			if ($dec[0]) $this->controller = $dec[0];
			if($dec[0] === false) $this->controller = false;
			if ($dec[1]) $this->action = $dec[1];
			if ($dec[2]) $this->params = $dec[2];
			return $this;
		}
		return $this;
	}

	public function mount()
	{
		$this->return = null;
		$this->error = false;

		// Static page...
		if($this->controller === false){
			$page = PATH_TEMPLATE . '/' . $this->action;
			if(file_exists($page)) {
				include_once $page;
				exit;
			}
			$this->controller = $this->defaultController;
			$this->action = $this->defaultAction;
		}

		// Anonymous functions as controller
		if(is_callable($this->controller))			
			return $this->send(($this->controller)($this->params, $this->query, $this->post));

		// Class exists?
		if (class_exists($this->controller)) {
			$controller = new $this->controller;
		} else {
			$this->error = true;
			return $this->send();
		}

		// Action exists?
		$action = $this->action;
		if ($controller && is_object($controller)) {
			if (method_exists($controller, $this->action))
				$this->return = $controller->$action($this->params, $this->query, $this->post);
			elseif (method_exists($controller, 'index'))
				$this->return = $controller->index($this->params, $this->query, $this->post);
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

	public function send($data = [])
	{
		header('Content-Type: application/json');
		if ($this->error || $data === false) {
			header('HTTP/1.1 404 Not Found');
			ob_end_clean();
		} else {
			header('HTTP/1.1 200 OK');
			echo json_encode($data);
		}
		exit();
	}
}