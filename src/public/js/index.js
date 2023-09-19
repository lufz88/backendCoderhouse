const socket = io();

const form = document.querySelector('#formLogin');

form.addEventListener('submit', event => {
	event.preventDefault();
	const dataForm = new FormData(event.target);
	const userData = Object.fromEntries(dataForm);
	socket.emit('submit login', userData);
});

socket.on('login response', user => {
	if (user) {
		socket.emit('login exitoso', user);
	} else {
		Swal.fire({
			title: 'Usuario o contraseña inválidos',
		});
	}
});
