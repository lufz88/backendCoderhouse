const socket = io();

const botonChat = document.querySelector('#botonChat');
const parrafosMensajes = document.querySelector('#parrafosMensajes');
const valInput = document.querySelector('#chatBox');

let user;
Swal.fire({
	title: 'Identificación de usuario',
	text: 'Por favor ingrese su usuario',
	input: 'text',

	inputValidator: valor => {
		return !valor && 'Ingrese un nombre de usuario válido';
	},
	allowOutsideClick: false,
}).then(resultado => {
	user = resultado.value;
	console.log(user);
});

botonChat.addEventListener('click', () => {
	let fechaActual = new Date().toLocaleString();
	if (valInput.value.trim().length > 0) {
		socket.emit('mensaje', {
			fecha: fechaActual,
			user: user,
			mensaje: valInput.value,
		});
		valInput.value = '';
	}
});

socket.on('mensajes', arrayMensajes => {
	parrafosMensajes.innerHTML = ''; // limpio
	arrayMensajes.forEach(msj => {
		const { fecha, user, mensaje } = msj;
		parrafosMensajes.innerHTML += `<p>${fecha} : ${user} escribió: </p> <p>${mensaje}</p>`;
	});
});
