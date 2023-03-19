- Poner el conjunto de las reglas del juego en una lista tipo 'Hoja'

- Poner un titulo en el modulo de registro que de mas feedback al usuario de donde esta. (front end)

- Organizar mejor las balotas

- Mostrar los juegos de los otros en la partida 

- borrar todos los console.log

- Dar feedback al usuario mediante mensajes que no sean alerts

- Permitir a los jugadores estar en el lobby indefinidamente, colocando un botón de "buscar un juego" para iniciar la búsqueda.

- Poner en el Lobby un botón de iniciar solo un juego

- Realizar el envío de cartas a un jugador que se haya desconectado, vuelva a ingresar y el juego aun este activo esto debe retornar las tablas del jugador con las fichas marcadas por el. Se debe buscar su ID en el juego, en caso de que haya sido descalificado, no podrá volver

- En caso de que el juego este en curso y un nuevo usuario entre, lanzar un mensaje que vuelva pronto 

- Controlar el caso en que salgan todas las balotas 

- Configurar mongo ID para pasarlo por express sessions y redireccionar las vistas desde el backend

- Solucionar problema con websockets en el modulo del juego (no aparecen los usuarios en juego)

- Añadir un historial con las 3 ultimas balotas salidas

BUGS:
 - No funciona la autenticación por google
 - Cuando se recarga la pagina el jugador se vuelve a inscribir al mismo juego generando nuevas cartas. Si el juego esta terminado crea un nuevo juego.
 - si el juego termina, por cualquier razón, desactivar las cartas de todos los jugadores.