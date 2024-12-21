function notFound(req, res, next) {
  res.status(404).render('errors', { title: '404 Not Found', message: 'Page Not Found' });
}

function internalServerError(err, req, res, next) {
  console.error('Internal Server Error:', err);
  res.status(500).render('errors', { title: '500 Internal Server Error', message: 'An Internal Server Error occurred. Please try again later.' });
}

function emailError(err, req, res, next) {
  console.error('Email Error:', err);
  res.status(500).render('errors', { title: 'Email Error', message: 'Error sending email. Please try again later.' });
}

export default {
  notFound,
  internalServerError,
  emailError,
};
