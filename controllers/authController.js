const admin = require("../firebase");
const jwt = require("jsonwebtoken");

const db = admin.firestore();
const JWT_SECRET = process.env.JWT_SECRET;

exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email ve şifre gerekli" });

    // Var mı kontrol et
    const usersRef = db.collection("users");
    const existing = await usersRef.where("email", "==", email).get();

    if (!existing.empty)
      return res.status(409).json({ error: "Bu email zaten kayıtlı" });

    // Yeni kullanıcı
    const newUser = {
      email,
      password,
      createdAt: Date.now(),
    };

    const ref = await usersRef.add(newUser);

    res.status(201).json({
      message: "Kayıt başarılı",
      userId: ref.id,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usersRef = db.collection("users");
    const snapshot = await usersRef
      .where("email", "==", email)
      .where("password", "==", password)
      .get();

    if (snapshot.empty)
      return res.status(401).json({ error: "Geçersiz email veya şifre" });

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    const token = jwt.sign(
      { userId: userDoc.id, email: userData.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};
