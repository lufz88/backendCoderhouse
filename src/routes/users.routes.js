import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import multer from 'multer';
import { authorization, passportError } from '../utils/messageErrors.js';

const upload = multer({ dest: 'documents/' });

const routerUser = Router();

routerUser.get('/', usersController.getUsers);

routerUser.post('/recovery', usersController.recoveryPassword);

routerUser.post('/resetpassword/:token', usersController.resetPassword);

routerUser.post('/:uid/documents', upload.array('documents'), usersController.uploadDocuments);

routerUser.delete(
	'/deleteInactiveUsers',
	passportError('jwt'),
	authorization(['admin']),
	usersController.deleteInactiveUsers
);

routerUser.delete(
	'/:uid',
	passportError('jwt'),
	authorization(['admin']),
	usersController.deleteUser
);

export default routerUser;
