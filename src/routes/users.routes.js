import { Router } from 'express';
import passport from 'passport';
import usersController from '../controllers/users.controller.js';

const routerUser = Router();

routerUser.post('/', passport.authenticate('register'), usersController.postUser);

routerUser.get('/', usersController.getUser);

export default routerUser;
