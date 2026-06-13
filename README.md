# **FOTAZA 2** - Web para compartir, comentar y valorar imagenes entre usuarios

Es una aplicación web desarrollada para la asignatura PROGRAMACION WEB II, de TUDS(Tecnicatura Universitaria en Desarrollo de Software) de la ULP (Universidad de La Punta), San Luis, Argentina.

En esta aplicación desarrollamos nuestras habilidades en el diseño de un servidor utilizando la tecnología Node.js de Javascript, conjunto a una base de datos SQL, Postgres. Es una web dinámica, donde usuarios pueden registrarse, crear publicaciones, visualizar el de otros, puntuar, comentar y seguirse entre ellos. Las publicaciones se basan en imagenes, tendrán su título, descripción y quién lo ha compartido.

*Importante aclarar* la pagina está en pleno desarrollo, se cumple con los requisitos mínimos de regularización solicitados:
Creación de publicación. 
Buscador de publicaciones/imágenes 
Módulo de comentarios. 
Valoración de imágenes 
Seguimiento de usuarios

### Video explicativo del proyecto desde su deploy:

Link Youtube: https://youtu.be/EbxFg30AQes

### Link de la aplicación desplegada:

https://tpi-fotaza-pw2.onrender.com/

----------------------------------------------------------------------------------------

## Pasos para la instalación y ejecución local

Se recuerda tener npm instalado previamente en la computadora.

### 1. Clonar el repositorio

Pueden clonarlo de la manera que les parezca más cómoda, les recomiendo posicionarse sobre la carpeta donde clonarán el proyecto, luego colocar el siguiente comando en su terminal:
git clone https://github.com/necoian/TPI-Fotaza-PW2.git


### 2. Instalar las dependencias

Hay que posicionarse sobre la carpeta TPI-Fotaza-PW2:
_cd TPI-Fotaza-PW2_
Coloca en la terminal:
_npm install_

### 3. Configurar las variables de entorno .env

En este proyecto se brinda el archivo .env.example, renombralo con .env y cambia los parámetros de conexión, seguramente lo único que deba modificar sea la contraseña de su Postgres.
(el archivo puede ser modificado en Visual Studio Code o bloc de notas en abrir con)
*Importante* si no se cambia este archivo de esta manera no se podrá acceder de forma correcta a la aplicación.

### 4. Inicializar la base de datos y cargar los datos de prueba

Brindo las dos herramientas aquí, la primera opción:

Colocar en la terminal :

_npm run db:init_

y el siguiente comando:

_npm run db:seeds_

O como segunda opción ejecutar solamente este comando:

_npm run db:setup_


### 5. Inicializar la aplicación

Colocar en la terminal :

_npm start_

Colocando en cualquier navegador web :
http://localhost:3000
Ya pueden acceder


----------------------------------------------------------------------------------------

## Usuarios de prueba:

Se brinda username y contraseña (respetar minúsculas y mayúsculas):

Administrador :
username: elAdmin
contraseña: llegoElAdmin

Usuario 1:
username: IanPereyra
contraseña: Pupi

Usuario 2:
username: RominaTolosa
contraseña: Lulu

----------------------------------------------------------------------------------------

## Servicios utilizados para este proyecto:

*Base de Datos:* se ha utilizado Supabase, tiene un plan gratuito que cumple sin inconvenientes con el proyecto realizado.

*Almacenamiento de imagenes:* se ha utilizado Cloudinary, es un servidor sencillo de utilizar y el plan gratuito permite almacenar una gran cantidad de megabytes.

*Servidor para desplegar:* se ha utilizado Render, también es sencillo de utilizar y con un plan gratuito que permite desplegar sin problemas este tipo de proyectos.


## Complicaciones o desafíos durante el desarrollo:

1. La persistencia de imágenes en la base de datos : Para poder subir las imágenes a la base de datos me aparecían dos inconvenientes, en primer lugar cualquier fallo que pudiese tener Cloudinary para subir la imagen a su servidor y luego brindar la URL correspondiente no permitía crear los posts o usuarios para colocar su avatar_url. En segundo lugar este problema ya era evidente si no se tenían las credenciales de Cloudinary (solamente está en el servidor) por lo que sucedía lo mismo. Se resolvió cambiando la subida de imagen de URL de Cloudinary a una conversión automática a base64 (los dos se pueden visualizar sin problemas en proyecto) siempre que Cloudinary fallara por lo anterior mencionado.

2. Problemas con pg_dump, db-init y db-seeds : Para poder hacer una copia local de la base de datos se me ha generado innumerable inconvenientes tanto en la copia de respaldo de la base de datos con su posterior implementación en los scripts db-init y db-seeds, los encargados de crear la estructura de la base de datos y colocar sus ejemplos. Por varios intentos y entendiendo todos los errores que iban surgiendo pude dar con ello y resolverlo. 

3. Problemas con el envío de información desde los formularios de pug : Me he encontrado con varios problemas o inconvenientes semánticos respecto a la transferencia de información desde los render .pug en sus formularios (por ejemplo publicar.pug o login.pug) a sus controladores correspondientes. Pero el ir entiendiendo bien las nomenclaturas y haciendo pruebas constantemente (cambiaba una linea de codigo y probaba en localhost) fui entendiendo mis errores y pude solucionarlo.

4. Base de datos y errores semánticos : El problema de la base de datos fue estructural, como la base de datos ya está casi completa en lo que concierne al proyecto en su totalidad, el tener restricciones o funciones que aún no estaban en esta entrega parcial para regularizar me ha obligado a modificarlo en sus distintas restricciones para que los usuarios puedan utilizar la aplicación sin inconvenientes, el mayor de ellos fue el subir el post (restringido por el estado de solicitud de pendiente a activo) el cual me daba error porque no podía pasar directamente de crearlo a un estado activo (es decir que el post ya pueda estar en el servidor), la solución fue simple, eliminar las restricciones que lo prohibian.