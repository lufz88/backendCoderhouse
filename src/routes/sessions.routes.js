import { Router } from 'express';
import passport from 'passport';
import { passportError } from '../utils/messageErrors.js';
import sessionController from '../controllers/sessions.controller.js';

const routerSession = Router();

routerSession.post('/login', passport.authenticate('login'), sessionController.postSession);

routerSession.get('/current', passportError('jwt'), sessionController.getCurrentSession);

routerSession.get(
	'/github',
	passport.authenticate('github', { scope: ['user: email'] }),
	sessionController.getGithubCreateUser
);

routerSession.get(
	'/githubSession',
	passport.authenticate('github'),
	sessionController.getGithubSession
);

routerSession.get('/logout', sessionController.getLogout);

export default routerSession;
