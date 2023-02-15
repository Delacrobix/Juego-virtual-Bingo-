## Bingo online 

El objetivo de este programa es permitir a usuarios jugar partidas online de bingo en modo multi-jugador.

### <strong>Instalación de dependencias y ejecución del programa:</strong>

- <strong>Base de datos:</strong> El script encargado de desplegar las tablas usadas para el proyecto se encuentra en la siguiente dirección: 

        /base-de-datos.sql

    donde el archivo con nombre 'base-de-datos.sql' es el script que debe ser ejecutado.

- <strong>Dependencias NodeJS:</strong> En la dirección

        /Bingo/nodejs/src

    ejecutar el comando

        npm install

    Para ejecutar la aplicación basada en NodeJS bastara con ejecutar en la misma dirección el comando

        nodemon app

- <strong>Dependencias maven: </strong> La instalación de las dependencias usadas por java estará gestionada por el archivo

        pom.xlm

    existente en la dirección:

        /Bingo/pom.xml

### <strong>Experiencia de usuario:</strong> <a name="id20"></a>

La aplicación se compone de 4 módulos con los cuales el usuario puede interactuar: El formulario de registro, el formulario de ingreso, el lobby, y el bingo.

> Formulario de registro:
    ![Formulario de registro.](https://github.com/Delacrobix/Sofka-Canteras-2/blob/doc/DOC/images/2022-08-06_14h43_25.png)
<br>
    ![Notificación de registro exitoso.](https://github.com/Delacrobix/Sofka-Canteras-2/blob/doc/DOC/images/2022-08-06_14h46_36.png)

En el formulario de registro el usuario puede ingresar el nombre de usuario que desee tener y la contraseña. Dicho nombre de usuario no debe haber sido usado por ningún otro usuario registrado.

> Formulario de inicio de sesion:
    ![Formulario de inicio de sesion](https://github.com/Delacrobix/Sofka-Canteras-2/blob/doc/DOC/images/2022-08-06_14h47_16.png)

Una vez registrado el usuario puede iniciar sesion con el usuario y contraseña registrado.

> Lobby:
    ![Lobby del juego](https://github.com/Delacrobix/Sofka-Canteras-2/blob/doc/DOC/images/2022-08-06_14h48_01.png)

Una vez iniciada sesion el usuario sera redireccionado al lobby de la aplicación donde esperara que otros jugadores se unan para asi iniciar el juego.

> Bingo:
    ![Bingo](https://github.com/Delacrobix/Sofka-Canteras-2/blob/doc/DOC/images/2022-08-06_14h48_51.png)

Cuando termine la cuenta regresiva en el lobby, el usuario sera redireccionado al juego en si. Aquí el jugador se le asignara una tabla de bingo totalmente random en la cual podrá llenar las fichas que vayan saliendo en pantalla y que coincidan con los espacios que tenga en la tabla.

El usuario también podrá visualizar los otros participantes del juego.

> Interacción con la tabla de bingo:<br>
    ![Casilla marcada satisfactoriamente](https://github.com/Delacrobix/Sofka-Canteras-2/blob/doc/DOC/images/2022-08-06_14h49_35.png)
<br>
    ![Casilla marcada que no coincide con las balotas](https://github.com/Delacrobix/Sofka-Canteras-2/blob/doc/DOC/images/2022-08-06_14h50_04.png)

Cuando el jugador decida marcar las casillas que coincidan con las balotas que hayan sido arrojadas por la balotera, dicha balota sera coloreada en rojo, indicando asi que ha sido marcada. Si por algún casual el usuario intenta marcar una casilla que no coincida con ninguna balota el sistema informara al usuario que no puede marcar dicha casilla.

> Anuncio de la victoria:
    ![Victoria real](https://github.com/Delacrobix/Sofka-Canteras-2/blob/doc/DOC/images/2022-08-06_14h55_09.png)
    ![Descalificación](https://github.com/Delacrobix/Sofka-Canteras-2/blob/doc/DOC/images/2022-08-06_14h50_55.png)

Si el jugador considera que con las casillas marcadas en su tabla le es suficiente para ganar, tiene la opción de oprimir el botón amarillo con el nombre de 'Bingo'. Presionar este botón tiene dos posibles consecuencias, si efectivamente el usuario es el ganador, se le notificara y se pondrá una corona en su nombre en la tabla de usuarios. En caso de que lo haya presionado erróneamente el jugador sera descalificado del juego. A si mismo, cuando el juego termine, se le notificara a todos los usuarios que ya existe un ganador y se terminara el juego.