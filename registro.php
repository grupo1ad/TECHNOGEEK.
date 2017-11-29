<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>REGISTRO</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="stylesheet" href="assets/css/menu.css" />
        <link rel="shortcut icon" type="image/png" href="IMG/logosm.PNG" />

</head>

<body>

 <br><br><br>
 <center> <strong><font size="20">REGISTRO</font></strong><br></center>
   <form method="POST" action="registrar.php">
     Usuario:<input type="text" name="usuario" placeholder="Digite nombre de usuario" required/><br>
     Contraseña:<input type="password" name="pass" placeholder="***********" required/><br>
    Correo:<input type="email" name="mail" placeholder="ejemplo@gmail.com" required/><br>
    Nombre: <input type="text" name="nombre" placeholder="nombre" required/><br><BR>
    Apellido:<input type="text" name="apellido" placeholder="apellido" required/><br>
    Numero identificación:<input type="text" name="identificacion" placeholder="numero identificación" required/><br>
    Telefono:<input type="text" name="tel" placeholder="telefono" required/><br>
    Dirección:<input type="text" name="direc" placeholder="direccion" required/><br>
    Genero:<input type="text" name="genero" placeholder="M o F" required/><br>
      <button class="button" type="submit">enviar</button> 
     <a href="index.html" class="button">volver</a>
   </form>

</center> 
</body>
</html>