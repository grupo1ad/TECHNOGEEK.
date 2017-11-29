<?php 

class Usuario{
	public $usuario;
	private $pass;
	public $correo;
	public $nombre;
	public $apellido;
	private $identificacion;
	public $telefono;
	public $direccion;
	public $genero;
	public $resultado;

	
	public function __construct(){
		$this->conexion=new mysqli("localhost", "root", "", "tecnogeek");
	}


	public function registro(){
		$this->usuario=$_POST['usuario'];
		$this->pass=$_POST['pass'];
		$this->correo=$_POST['mail'];
		$this->nombre=$_POST['nombre'];
		$this->apellido=$_POST['apellido'];
		$this->identificacion=$_POST['identificacion'];
		$this->telefono=$_POST['tel'];
		$this->direccion=$_POST['direc'];
		$this->genero=$_POST['genero'];

		$query="INSERT INTO `usuario` (`id`, `usuario`, `password`, `correo`, `nombre`, `apellido`, `identificacion`, `telefono`, `direccion`, `genero`) VALUES (NULL, '$this->usuario', '$this->pass', '$this->correo', '$this->nombre', '$this->apellido', '$this->identificacion', '$this->telefono', '$this->direccion', '$this->genero');";
				$this->resultado=$this->conexion->query($query);
	}
	public function __destruct(){

		if ($this->resultado) {
        header ("Location:index.html");
 		} else {
         echo "El Registro No Se Guardó";
         }
	}

}
$usuario=new Usuario();
$usuario->registro();

?>