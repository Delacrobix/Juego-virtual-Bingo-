- El contador atrás solo se inicia para los usuarios externos al ejecutor

- Poner el conjunto de las reglas del juego en una lista tipo 'Hoja'

- Poner un titulo en el modulo de registro que de mas feedback al usuario de donde esta. (front end)

- Organizar mejor las balotas

- Mostrar los juegos de los otros en la partida 

- borrar todos los console.log

- Dar feedback al usuario mediante mensajes que no sean alerts

- al ganador, ponerle un botón que le permita volver al inicio.

- Permitir a los jugadores estar en el lobby indefinidamente, colocando un botón de "buscar un juego" para iniciar la búsqueda.

- Poner en el Lobby un botón de iniciar solo un juego

- Realizar el envío de cartas a un jugador que se haya desconectado, vuelva a ingresar y el juego aun este activo esto debe retornar las tablas del jugador con las fichas marcadas por el. Se debe buscar su ID en el juego, en caso de que haya sido descalificado, no podrá volver

- En caso de que el juego este en curso y un nuevo usuario entre, lanzar un mensaje que vuelva pronto 

- Controlar el caso en que salgan todas las balotas 

- Eliminar el count_state

- Cando solo un jugador juega, el juego no se cierra cuando un jugador es descalificado

- Detener el juego una vez haya terminado (backend)

- Mejorar optimización a la hora de buscar balotas

- Revisar el caso de que un usuario no se pueda registrar si funciona correctamente

BUGS:
 - No funciona la autenticación por google
 - Cuando se recarga la pagina el jugador se vuelve a inscribir al mismo juego generando nuevas cartas. Si el juego esta terminado crea un nuevo juego.
 - si el juego termina, por cualquier razon, desactivar las cartas de todos los jugadores.
 - No se notifica que ya hay un ganador de la partida. Podria hacerse con websockets via NodeJS.