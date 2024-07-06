<?php
namespace Lib;
class Mysql
{
	private $pdo = null;
	private $stmt = null;
	private $deletedField = 'deleted';
	public $error;

	function __construct()
	{
		if(isset(ENV['DB_DELETED_FIELD'])) $this->deletedField = ENV['DB_DELETED_FIELD'];
		$this->pdo = new \PDO(
			"mysql:host=" . ENV['DB_HOST'] .
			";dbname=" . ENV['DB_NAME'] .
			";charset=" . ENV['DB_CHARSET'],
			ENV['DB_USER'],
			ENV['DB_PASSWORD'],
			[
				\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
				\PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC
			]
		);
	}

	function __destruct()
	{
		if ($this->stmt !== null) $this->stmt = null;
		if ($this->pdo !== null) $this->pdo = null;
	}

	function query($sql, $data = null): array | null
	{
		$this->stmt = $this->pdo->prepare($sql);
		$this->stmt->execute($data);

		$res = [];
		while ($r = $this->stmt->fetch()) {
			$res[] = $r;
		}

		return $res;
	}

	function insert($sql, $data = null): int | null
	{
		$this->stmt = $this->pdo->prepare($sql);
		$this->stmt->execute($data);
		return $this->pdo->lastInsertId();
	}

	function update($sql, $data = null): int | null
	{
		$this->stmt = $this->pdo->prepare($sql);
		$this->stmt->execute($data);
		return $this->stmt->rowCount();
	}

	// destructive delete
	function delete($table, $id): int | null
	{
		$this->stmt = $this->pdo->prepare("delete from $table where id = :id");
		$this->stmt->execute([":id" => $id]);
		return $this->stmt->rowCount();
	}

	// soft delete
	function softDelete($table, $id): int | null
	{
		$this->stmt = $this->pdo->prepare("update $table set {$this->deletedField} = now() where id = :id");
		$this->stmt->execute([":id" => $id]);
		return $this->stmt->rowCount();
	}

	// soft undelete
	function softUnDelete($table, $id): int|null
	{
		$this->stmt = $this->pdo->prepare("update $table set {$this->deletedField} = null where id = :id");
		$this->stmt->execute([":id" => $id]);
		return $this->stmt->rowCount();
	}
}