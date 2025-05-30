const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "votre_cle_secrete"; // à sécuriser via .env

module.exports = function (requiredRole) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token manquant" });

    try {
      const decoded = jwt.verify(token, SECRET_KEY);

      if (decoded.role !== requiredRole) {
        return res
          .status(403)
          .json({ error: "Accès interdit : rôle insuffisant" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Token invalide" });
    }
  };
};
