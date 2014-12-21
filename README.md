# Chat

##Librerías
### Backend
* express: para el manejo de las peticiones GET y POST.
* path: para todo el manejo de rutas de archivos dentro de node.
* jade: motor de templates ya que trabaja muy bien con express.js.
* morgan: logs de todas las peticiones en la consola.
* socket.io: para todo el manejo de sockets.
* node-postgres: para la conexión e interacción con postgres.
* body-parser: un middleware para el *parseo* de formularios.
* bower: no es requierido, pero se utilizó para el fácil manejo e instalación de las librerías en el frontend.

### Frontend
* angular.js: maneja el subit del formulario, las llamadas http a la API y el render de los mensajes.
* bootstrap: ayuda con los estilos.
* socket.io: para la conexión con el socket en el servidor.

## Instrucciones para correr el proyecto
* Tener instalado Node.
* Tener instalado PostgreSQL.
* Crear una base de datos llamada "chat".
* Crear una tabla llamada messages.

~~~sql
CREATE TABLE messages
(
  id serial NOT NULL,
  username character varying(40),
  text text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT messages_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE messages
  OWNER TO <user>;
~~~

** Nota: el nombre de usuario en el owner será el mismo en el archivo de configuración que se usará para conectarse a postgres.

* Crear un archivo de configuración en la raíz del proyecto con nombre conf.json.

~~~js
{
  "postgres": {
    "host": "postgres://<user>:<password>@<host>/<db-name>"
  }
}
~~~
* Levantar el servidor con:

~~~js
node app.js
~~~

## Lógica
~~~
         +---------------------+        
         |      angular.js     |        
         +-----+----------^----+        
               |          |             
           req |          | res         
               |          |             
               |          |             
         +-----v----------+----+        
         |       REST API      |        
         +----------+----------+        
                    |                   
                    |                   
     +--------------+-------------+     
     |                            |     
+----v----+                   +---v----+
|   GET   |                   |  POST  |
+----+----+                   +---+----+
     |                            |     
     +--------------+-------------+     
                    |                   
                    |                   
               +----v-----+             
               | DATABASE |             
               +----------+             
~~~

### Carga inicial
1. Al cargar la vista lo primero que hace *angular.js* es enviar una petición AJAX a la API pidiendo todos los mensajes que hay guardados en la base de datos.
2. Quién recibe la petición AJAX es un router de *express.js*, el cual se encarga de traer todos los mensajes guardados apoyándose en *node-postgres*.
3. Cuado *pg* termina devuelve los datos a un *callback* de *express* que a su vez se los devuelve a *angular* en formato JSON.
4. *Angular* recibe los datos y refresca el *div* de los mensajes.

### Envío del formulario
1. Angular se encarga de validar el formulario, que los campos requeridos no estén vacíos.
2. El mismo *angular* se encarga de hacer el submit del formulario a la API para guardar el mensaje en la base de datos.
3. *Express* recibe la petición y hace el guardado del mensaje en *postgres*.

### Tiempo real
1. Si el guardado da un 200 OK socket.io se encarga de emitir el mensaje al servidor *"send message"*.
2. *Socket.io* recibe el evento de *"send message"* y hace un *broadcast* del mensaje a todos los *sockets* conectados *"get message"*.
3. *Socket.io* del lado del cliente recibe el evento *"get message"*  y le pasa la *data* a *angular*.
4. *Angular* recibe la *data* y la muestra en el *div* de mensajes, actualizando así la lista.
