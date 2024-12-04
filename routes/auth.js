const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

const JWT_SECRET = "7e31dd87-5bd0-4496-bd34-29fada787497";

// Registro
router.post("/register", async (req, res) => {
  const { email, password, name, userType } = req.body;
  try {
    const user = new User({ email, password, name, userType });
    await user.save();
    res.status(201).json({ message: "Usuário registrado!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Credenciais inválidas!" });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/user", async (req, res) => {
  const { email } = req.query; // Obtém o email da query string

  if (!email) {
    return res.status(400).json({ error: "Email é obrigatório." });
  }

  try {
    // Busca o usuário no MongoDB
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Retorna as informações do usuário (exceto o password)
    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

module.exports = router;
