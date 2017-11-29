<meta charset="utf-8">
<?php
class Conexion{

		public function con(){
			$conexion = new mysqli ("localhost", "root", "", "tecnogeek");


			if ($conexion) {
			echo "Conexión Establecida.";
			}
			else {
			echo "Error. No se puede conectar.";
			}
		}

}

?>