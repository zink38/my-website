import { Request, Response, NextFunction } from 'express';
import { JobModel } from '../jobs/job-model.js';


export class HomeController {
    static async getHomePage(req: Request, res: Response, next: NextFunction) {
        try {
            const jobs = await JobModel.getAllJobs(); 
            res.render('home', { jobs });
        } catch (error) {
            // Log the error
            console.error('Failed to fetch jobs:', error);
            // Optionally, you can pass an error message to the view
            // jobs = null; // Indicate that jobs could not be fetched
        }
        
    }
}
