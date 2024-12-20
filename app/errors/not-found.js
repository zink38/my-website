function notFound(req, res) {
  res.status(404).render('errors/not-found');
}

export default notFound;
