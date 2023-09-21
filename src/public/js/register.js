const socket = io();

const form = document.querySelector('#formRegister');

form.addEventListener('submit', event => {
	event.preventDefault();
	const dataForm = new FormData(event.target);
	const userData = Object.fromEntries(dataForm);
	console.log(userData);
	socket.emit('submit register', userData);
});

socket.on('register response', res => {
	if (res) {
		Swal.fire({
			title: 'Usuario creado con éxito',
		}).then(res => {
			if (res) {
				window.location.href = '/static';
			}
		});
	} else {
		Swal.fire({
			title: 'El email ya se ha utilizado',
		});
	}
});
