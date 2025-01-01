import { Router } from 'express';
import { HomeController } from './home-controller.js';

const homeRouter = Router();

homeRouter.get('/', HomeController.getHomePage);
homeRouter.post('/contact', HomeController.contactMe);

export default homeRouter;
