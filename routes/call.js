const express = require('express');
const router = express.Router();

// Rota para iniciar uma chamada
router.post('/call', (req, res) => {
  const { userId, contactId } = req.body;
  console.log("dentro da call")
  res.status(200).send({ message: 'Chamada iniciada' });
});

module.exports = router;
