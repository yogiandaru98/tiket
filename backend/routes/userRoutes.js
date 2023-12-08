// backend/routes/userRoutes.js
const path = require("path");
const express = require("express");
const User = require("../models/User");
const Bio = require("../models/Bio");
const Paket = require("../models/Paket");
const Tiket = require("../models/Tiket");
const router = express.Router();

//signup route
router.get("/signup", (req, res) => {
  /**
   * The file path for the signup HTML file.
   * @type {string}
   */
  const signupPath = path.join(__dirname, "../../public/signup.html");
  res.sendFile(signupPath);
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password, fullname } = req.body;

    if (!username || !password || !fullname) {
      return res
        .status(400)
        .json({ error: "Please provide username, password, and fullname" });
    }

    /**
     * Creates a new user.
     *
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @param {string} fullname - The full name of the user.
     * @returns {Promise<User>} A promise that resolves to the newly created user.
     */
    const newUser = await User.create({ username, password, fullname });
    res.redirect("/users/dashboard"); // Redirect to signin page after successful signup
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//signin route
router.get("/signin", (req, res) => {
  if (req.session.user) {
    return res.redirect("/users/dashboard");
  }
  /**
   * The file path for the signin HTML file.
   * @type {string}
   */
  const signinPath = path.join(__dirname, "../../public/signin.html");
  res.sendFile(signinPath);
});

router.post("/signin", async (req, res) => {
  //klk udah login gk bisa balik ke login
  if (req.session.user) {
    return res.redirect("/users/dashboard");
  }
  const { username, password } = req.body;

  try {
    /**
     * Represents a user object.
     * @typedef {Object} User
     * @property {string} username - The username of the user.
     * @property {string} password - The password of the user.
     */
    const user = await User.findOne({ where: { username } });
    if (!user || user.password !== password) {
      return res.status(401).send("Invalid username or password");
    }

    // Inisialisasi req.session jika belum ada
    if (!req.session) {
      req.session = {};
    }

    req.session.user = user; // Set user di session setelah berhasil sign-in
    res.redirect("/users/dashboard"); // Redirect ke dashboard setelah sign-in berhasil
  } catch (error) {
    res.status(500).send("Error signing in");
  }
});

//logout route
router.get("/logout", (req, res) => {
  req.session.destroy(); // Destroy session on logout
  res.redirect("/users/signin"); // Redirect to signin page after logout
});

router.get("/dashboard", (req, res) => {
  // Deteksi login jika tidak ada, redirect ke signin
  if (!req.session || !req.session.user) {
    return res.redirect("/users/signin");
  } else {
    const user = req.session.user;
    // cek bio
    Bio.findOne({ where: { UserId: user.id } }).then((bio) => {
      if (!bio) {
        return res.redirect("/users/pengaturan");
      }
    });

    const dashboardPath = path.join(__dirname, "../../public/dashboard.html");
    res.sendFile(dashboardPath);
  }
});

router.get("/pengaturan", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/users/signin");
  } else {
    const pengaturan = path.join(__dirname, "../../public/pengaturan.html");
    res.sendFile(pengaturan);
  }
});

router.get("/selfUser", async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/users/signin");
  }

  const { user } = req.session;
  try {
    const { username, fullname } = await User.findOne({
      where: { id: user.id },
    });
    res.json({ username, fullname });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/selfUserAndBio", async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/users/signin");
  }

  const { user } = req.session;
  try {
    const { username, fullname } = await User.findOne({
      where: { id: user.id },
    });

    const { alamat, no_hp, jenis_kelamin } = await Bio.findOne({
      where: { UserId: user.id },
    });

    const userWithBio = {
      username,
      fullname,
      alamat,
      no_hp,
      jenis_kelamin,
    };

    res.json(userWithBio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/addBio", async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/users/signin");
  }

  const { alamat, no_hp, jenis_kelamin } = req.body;
  const { user } = req.session;

  try {
    const bio = await Bio.create({
      alamat,
      no_hp,
      jenis_kelamin,
      UserId: user.id,
    });
    res.redirect("/users/pengaturan");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/cari", async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/users/signin");
  }
  try {
    const { tujuan } = req.query;

    if (!tujuan) {
      return res.status(400).send("Please provide a valid search value");
    }

    // Lakukan pencarian berdasarkan 'tujuan'
    // Pastikan untuk memformat hasil pencarian ke dalam bentuk JSON
    const paket = await Paket.findAll({
      where: { tujuan },
    });

    // Kirim data hasil pencarian sebagai JSON untuk redirect ke halaman hasilPencarian
    res.redirect(
      `/users/hasilPencarian?tujuan=${encodeURIComponent(
        JSON.stringify(paket)
      )}`
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/hasilPencarian", async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/users/signin");
  }
  try {
    const { tujuan } = req.query;

    if (!tujuan) {
      return res.status(400).send("Please provide a valid search value");
    }

    // Ubah kembali data JSON menjadi objek JavaScript
    const hasilPencarian = JSON.parse(decodeURIComponent(tujuan));

    // Di sini, kirim data hasil pencarian ke halaman 'hasilPencarian.html'
    res.sendFile(path.join(__dirname, "../../public/cari.html"));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/pesan/:id", async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/users/signin");
  }
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("Please provide a valid search value");
    }

    // Lakukan pencarian berdasarkan 'tujuan'
    // Pastikan untuk memformat hasil pencarian ke dalam bentuk JSON
    const paket = await Paket.findOne({
      where: { id },
    });

    // Kirim data hasil pencarian sebagai JSON untuk redirect ke halaman hasilPencarian
    res.redirect(
      `/users/pesan?tujuan=${encodeURIComponent(JSON.stringify(paket))}`
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/pesan", async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/users/signin");
  }
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).send("Please provide a valid search value");
    }

    // Ubah kembali data JSON menjadi objek JavaScript
    const hasilPencarian = JSON.parse(decodeURIComponent(id));

    // Di sini, kirim data hasil pencarian ke halaman 'hasilPencarian.html'
    res.sendFile(path.join(__dirname, "../../public/booking.html"));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

const generateRandomCode = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let code = "";

  for (let i = 0; i < 3; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  for (let i = 0; i < 6; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return code;
};

router.post("/pesan", async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/users/signin");
  }
  try {
    const { kode_kursi, PaketId } = req.body;
    const kode_booking = generateRandomCode();
    const tanggal_booking = Date.now();

    if ( !kode_kursi || !PaketId) {
      return res.status(400).send("Please provide a valid search value");
    }

    // Lakukan pencarian berdasarkan 'tujuan'
    // Pastikan untuk memformat hasil pencarian ke dalam bentuk JSON
    const tiket = await Tiket.create({
      kode_booking,
      kode_kursi,
      PaketId,
      UserId: req.session.user.id,
      tanggal_booking,
    });

    // Kirim data hasil pencarian sebagai JSON untuk redirect ke halaman hasilPencarian
    res.redirect("/users/dashboard");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/booked", async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/users/signin");
  }
  try {
    const { user } = req.session;
    const tiketData = await Tiket.findAll({
      where: {
        UserId: user.id, // Sesuaikan dengan nama field yang merepresentasikan ID pengguna
      },
      include: [{
        model: Paket, // Sertakan model Paket jika Anda ingin mendapatkan informasi terkait paket tiket
      }],
    });

    // Kirim data tiket dalam bentuk JSON sebagai respons
    res.json(tiketData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/keranjang", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/users/signin");
  } else {
    const keranjang = path.join(__dirname, "../../public/keranjang.html");
    res.sendFile(keranjang);
  }
});

router.get("/paketAll", async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/users/signin");
  } else {
    try {
      const paketData = await Paket.findAll();
      res.json(paketData);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}
);


module.exports = router;
