import { Request, Response, NextFunction } from 'express';

function notFound(req: Request, res: Response, next: NextFunction): void {
  res.status(404).render('errors', { title: '404 Not Found', message: 'Page Not Found' });
}

function internalServerError(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.error('Internal Server Error:', err);
  res.status(500).render('errors', { title: '500 Internal Server Error', message: 'An Internal Server Error occurred. Please try again later.' });
}

function emailError(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.error('Email Error:', err);
  res.status(500).render('errors', { title: 'Email Error', message: 'Error sending email. Please try again later.' });
}

export default {
  notFound,
  internalServerError,
  emailError,
};
