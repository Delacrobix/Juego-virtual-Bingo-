# Juego: Bingo virtual

### <strong>Tecnologías, instalación de dependencias y ejecución del programa:</strong><a name="id19"></a>

- <strong>Tecnologías usadas:</strong>
    - Java
    - Spring Boot
    - MySQL
    - NodeJS
    - MongoDB
<br></br>

<strong>Dependencias</strong>

- <strong>Base de datos:</strong> Para la ejecución de esta aplicación se necesita <a href="https://www.mysql.com" target="_blank"><strong> MySQL</strong></a> instalado. El script encargado de desplegar las tablas usadas para el proyecto se encuentra en la siguiente dirección: 

        /6_bingo-virtual/base-de-datos.sql

    donde el archivo con nombre 'base-de-datos.sql' es el script que debe ser ejecutado.

- <strong>Dependencias NodeJS:</strong> En la dirección

        /6_bingo-virtual/Bingo/nodejs/src

    ejecutar el comando

        npm install

    Para ejecutar la aplicación basada en NodeJS bastara con ejecutar en la misma dirección el comando

        nodemon app

- <strong>Dependencias maven: </strong> La instalación de las dependencias usadas por java estará gestionada por el archivo

        pom.xlm

    existente en la dirección:

        /6_bingo-virtual/Bingo/pom.xml

    Para ejecutar la aplicación Java se debe ejecutar desde el IDE. Cuando ambas aplicaciones (NodeJS y Spring Boot) estén iniciadas, puede acceder a la aplicación desde las siguientes direcciones:

        localhost:8081/Login (Para iniciar sesion)
        localhost:8081/signup (para registrarse)

### <strong>Experiencia de usuario:</strong> <a name="id20"></a>

La aplicación se compone de 4 módulos con los cuales el usuario puede interactuar: El formulario de registro, el formulario de ingreso, el lobby, y el bingo.

> Formulario de registro:
    ![Formulario de registro.](https://github.com/Delacrobix/Sofka-Canteras-2/blob/doc/DOC/images/2022-08-06_14h43_25.png)
<br>
    ![Notificación de registro exitoso.](https://github.com/Delacrobix/Sofka-Canteras-2/blob/doc/DOC/images/2022-08-06_14h46_36.png)

En el formulario de registro el usuario puede ingresar el nombre de usuario que desee y la contraseña. Dicho nombre de usuario no debe haber sido usado por ningún otro usuario registrado.

> Formulario de inicio de sesion:
    ![Formulario de inicio de sesion](https://github.com/Delacrobix/Sofka-Canteras-2/blob/doc/DOC/images/2022-08-06_14h47_16.png)

Una vez registrado el usuario puede iniciar sesion con el usuario y contraseña registrado.

> Lobby:
    ![Lobby del juego](https://github.com/Delacrobix/Sofka-Canteras-2/blob/doc/DOC/images/2022-08-06_14h48_01.png)

Una vez iniciada la sesion, el usuario sera redireccionado al lobby de la aplicación donde esperara que otros jugadores se unan para asi iniciar el juego. En caso de que ningun usuario se una se iniciara una partida single-player.

> Bingo:
    ![Bingo](https://github.com/Delacrobix/Sofka-Canteras-2/blob/doc/DOC/images/2022-08-06_14h48_51.png)

Cuando termine la cuenta regresiva en el lobby, el usuario sera redireccionado al juego. Aquí el jugador se le asignara una tabla de bingo totalmente random en la cual podrá llenar las fichas que vayan saliendo en pantalla y que coincidan con los espacios que tenga en la tabla.

El usuario también podrá visualizar los otros participantes del juego.

> Interacción con la tabla de bingo:<br>
    ![Casilla marcada satisfactoriamente](https://github.com/Delacrobix/Sofka-Canteras-2/blob/doc/DOC/images/2022-08-06_14h49_35.png)
<br>
    ![Casilla marcada que no coincide con las balotas](https://github.com/Delacrobix/Sofka-Canteras-2/blob/doc/DOC/images/2022-08-06_14h50_04.png)

Cuando el jugador decida marcar las casillas que coincidan con las balotas que hayan sido arrojadas por la balotera, dicha balota sera coloreada en rojo, indicando asi que ha sido marcada. Si por algún casual el usuario intenta marcar una casilla que no coincida con ninguna balota, el sistema informara al usuario que no puede marcar dicha casilla.

> Anuncio de la victoria:
    ![Victoria real](https://github.com/Delacrobix/Sofka-Canteras-2/blob/doc/DOC/images/2022-08-06_14h55_09.png)
    ![Descalificación](https://github.com/Delacrobix/Sofka-Canteras-2/blob/doc/DOC/images/2022-08-06_14h50_55.png)

Si el jugador considera que con las casillas marcadas en su tabla le es suficiente para ganar, tiene la opción de oprimir el botón amarillo con el nombre de 'Bingo'. Presionar este botón tiene dos posibles consecuencias, si efectivamente el usuario es el ganador, se le notificara y se pondrá una corona en su nombre en la tabla de usuarios. En caso de que lo haya presionado erróneamente el jugador sera descalificado del juego. A si mismo, cuando el juego termine, se le notificara a todos los usuarios que ya existe un ganador y se terminara el juego.
