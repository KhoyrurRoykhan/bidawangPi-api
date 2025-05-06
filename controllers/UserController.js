import Users from "../models/UserModel.js";
import Nilai from "../models/NilaiModel.js";
import Guru from "../models/GuruModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['id', 'nama', 'nisn', 'email', 'progres_belajar', 'progres_tantangan', 'token_kelas']
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const Register = async (req, res) => {
  const { nama, nisn, email, password, confPassword, token_kelas } = req.body;

  if (password !== confPassword)
    return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    // 1. Buat user baru
    const newUser = await Users.create({
      nama,
      nisn,
      email,
      password: hashPassword,
      token_kelas,
      progres_belajar: 0,
      progres_tantangan: 0
    });

    // 2. Buat entri nilai default
    await Nilai.create({
      id: newUser.id,
      kuis_1: null,
      kuis_2: null,
      kuis_3: null,
      kuis_4: null,
      kuis_5: null,
      kuis_6: null
    });

    res.json({ msg: "Registrasi Berhasil" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Terjadi kesalahan saat registrasi" });
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) return res.status(404).json({ msg: "Email tidak ditemukan" });

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ msg: "Password salah" });

    const userId = user.id;
    const nama = user.nama;
    const email = user.email;

    const accessToken = jwt.sign({ userId, nama, email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1d'
    });
    const refreshToken = jwt.sign({ userId, nama, email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d'
    });

    await Users.update({ refresh_token: refreshToken }, {
      where: { id: userId }
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Terjadi kesalahan saat login" });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const user = await Users.findOne({
    where: { refresh_token: refreshToken }
  });

  if (!user) return res.sendStatus(204);

  await Users.update({ refresh_token: null }, {
    where: { id: user.id }
  });

  res.clearCookie('refreshToken');
  return res.sendStatus(200);
};

// controller/User.js
export const countUsersByTokenKelas = async (req, res) => {
  try {
    const { token_kelas } = req.query;
    const count = await Users.count({
      where: { token_kelas }
    });
    res.json({ count });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Gagal menghitung siswa" });
  }
};

// Menghitung siswa yang selesai belajar (progres_belajar = 22)
export const countSiswaSelesaiBelajar = async (req, res) => {
  try {
    const { token_kelas } = req.query;
    const count = await Users.count({
      where: {
        token_kelas,
        progres_belajar: 28
      }
    });
    res.json({ count });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Gagal menghitung siswa selesai belajar" });
  }
};

// Menghitung siswa yang selesai tantangan (progres_tantangan = 12)
export const countSiswaSelesaiTantangan = async (req, res) => {
  try {
    const { token_kelas } = req.query;
    const count = await Users.count({
      where: {
        token_kelas,
        progres_tantangan: 12
      }
    });
    res.json({ count });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Gagal menghitung siswa selesai tantangan" });
  }
};


// Get all users by token_kelas
export const getUsersByTokenKelas = async (req, res) => {
  try {
    const { token_kelas } = req.query;

    if (!token_kelas) {
      return res.status(400).json({ msg: "Token kelas tidak ditemukan dalam permintaan" });
    }

    const users = await Users.findAll({
      where: { token_kelas },
      attributes: ['id', 'nama', 'nisn', 'email', 'progres_belajar', 'progres_tantangan', 'token_kelas']
    });

    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Gagal mengambil data user berdasarkan token kelas" });
  }
};

//update userby id
export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, nisn } = req.body;

    const user = await Users.findByPk(id);
    if (!user) return res.status(404).json({ msg: "Siswa tidak ditemukan" });

    await Users.update({ nama, nisn }, {
      where: { id }
    });

    res.json({ msg: "Data siswa berhasil diperbarui" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Gagal memperbarui data siswa" });
  }
};

// Delete user by id
export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Users.findByPk(id);
    if (!user) return res.status(404).json({ msg: "Siswa tidak ditemukan" });

    await Users.destroy({
      where: { id }
    });

    res.json({ msg: "Data siswa berhasil dihapus" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Gagal menghapus data siswa" });
  }
};


// controller untuk ambil progres_belajar berdasarkan token siswa login
export const getProgresBelajarSiswa = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ msg: "Token tidak ditemukan" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await Users.findOne({
      where: { id: decoded.userId },
      attributes: ['progres_belajar']
    });

    if (!user) return res.status(404).json({ msg: "Siswa tidak ditemukan" });

    res.json({ progres_belajar: user.progres_belajar });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ msg: "Token tidak valid" });
  }
};

// controller untuk ambil progres_tantangan berdasarkan token siswa login
export const getProgresTantanganSiswa = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ msg: "Token tidak ditemukan" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await Users.findOne({
      where: { id: decoded.userId },
      attributes: ['progres_tantangan']
    });

    if (!user) return res.status(404).json({ msg: "Siswa tidak ditemukan" });

    res.json({ progres_tantangan: user.progres_tantangan });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ msg: "Token tidak valid" });
  }
};

// Controller untuk update progres_belajar siswa berdasarkan token
export const updateProgresBelajarSiswa = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ msg: "Token tidak ditemukan" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;

    const { progres_belajar } = req.body;

    if (progres_belajar == null)
      return res.status(400).json({ msg: "Nilai progres_belajar tidak boleh kosong" });

    const user = await Users.findByPk(userId);
    if (!user) return res.status(404).json({ msg: "Siswa tidak ditemukan" });

    user.progres_belajar = progres_belajar;
    await user.save();

    res.json({ msg: "Progres belajar berhasil diperbarui", progres_belajar: user.progres_belajar });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const getKKM = async (req, res) => {
  try {
    const token_kelas = req.token_kelas; // dari JWT
    const guru = await Guru.findOne({
      where: { token: token_kelas },
      attributes: ['kkm']
    });

    if (!guru) return res.status(404).json({ msg: "KKM tidak ditemukan" });
    res.json({ kkm: guru.kkm });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Gagal mengambil KKM" });
  }
};
