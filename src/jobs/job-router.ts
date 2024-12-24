// jobs/jobRouter.ts
import { Router } from 'express';
import { JobController } from './job-controller.js';

const jobsRouter = Router();

// jobsRouter.get('/', JobController.getAllJobs);
jobsRouter.get('/:id', JobController.getJobApplicationById);
// jobsRouter.get('/:id', JobController.getJobApplicationById);
//jobsRouter.post('/jobs', JobController.createJob);
//jobsRouter.put('/jobs/:id', JobController.updateJob);
//jobsRouter.delete('/jobs/:id', JobController.deleteJob);
jobsRouter.post('/:id/apply', JobController.applyForJob);

export default jobsRouter;
