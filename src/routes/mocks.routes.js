import { Router } from 'express';
import mocksController from '../controllers/mocks.controller.js';
import { authorization, passportError } from '../utils/messageErrors.js';

const routerMock = Router();

routerMock.get('/', passportError('jwt'), authorization('admin'), mocksController.createProducts);

export default routerMock;
