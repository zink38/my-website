import { Router } from 'express';
import { HomeController } from './home-controller.js';

const homeRouter = Router();

homeRouter.get('/', HomeController.getHomePage);

export default homeRouter;
