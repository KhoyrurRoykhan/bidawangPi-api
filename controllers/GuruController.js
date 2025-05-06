import Guru from "../models/GuruModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateTokenKelas } from "./utils/generateToken.js"; // Pakai helper token

// Ambil data semua guru
export const getGuru = async (req, res) => {
  try {
    const guru = await Guru.findAll({
      attributes: ['id', 'nama', 'email', 'instansi', 'token', 'kkm']
    });
    res.json(guru);
  } catch (error) {
    console.log(error);
  }
};


// Registrasi guru baru
export const RegisterGuru = async (req, res) => {
  const { nama, email, password, confPassword, instansi, kkm } = req.body;
  if (password !== confPassword)
    return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  const token = generateTokenKelas();

  try {
    await Guru.create({
      nama,
      email,
      password: hashPassword,
      instansi,
      token,
      kkm // kkm opsional, gunakan defaultValue jika tidak dikirim
    });
    res.json({ msg: "Registrasi Guru Berhasil" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Terjadi kesalahan saat registrasi guru" });
  }
};


// Login guru
export const LoginGuru = async (req, res) => {
  try {
    const guru = await Guru.findOne({
      where: { email: req.body.email }
    });

    if (!guru) return res.status(404).json({ msg: "Email tidak ditemukan" });

    const match = await bcrypt.compare(req.body.password, guru.password);
    if (!match) return res.status(400).json({ msg: "Password salah" });

    const userId = guru.id;
    const nama = guru.nama;
    const email = guru.email;
    const instansi = guru.instansi;
    const token = guru.token;
    const kkm = guru.kkm;

    const accessToken = jwt.sign(
      { userId, nama, email, instansi, token, kkm },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '25s' }
    );
    const refreshToken = jwt.sign(
      { userId, nama, email, instansi, token },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    await Guru.update({ refresh_token: refreshToken }, {
      where: { id: userId }
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Terjadi kesalahan saat login guru" });
  }
};

// Logout guru
export const LogoutGuru = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const guru = await Guru.findOne({
    where: { refresh_token: refreshToken }
  });

  if (!guru) return res.sendStatus(204);

  await Guru.update({ refresh_token: null }, {
    where: { id: guru.id }
  });

  res.clearCookie('refreshToken');
  return res.sendStatus(200);
};

export const getMeGuru = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ msg: "Tidak ada token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const guru = await Guru.findOne({
      where: {
        id: decoded.userId
      },
      attributes: ["id", "nama", "email", "instansi", "token", "kkm"]
    });

    if (!guru) return res.status(404).json({ msg: "Guru tidak ditemukan" });

    res.json(guru);
  } catch (error) {
    return res.status(403).json({ msg: "Token tidak valid" });
  }
};

// Update nilai KKM
export const updateKKM = async (req, res) => {
  const { kkm } = req.body;
  const guruId = req.guruId;

  try {
    await Guru.update({ kkm }, {
      where: { id: guruId }
    });
    res.json({ msg: "KKM berhasil diperbarui" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Gagal memperbarui KKM" });
  }
};


// Ambil KKM berdasarkan token kelas
export const getKKMByToken = async (req, res) => {
  const { token_kelas } = req.query;

  try {
    const guru = await Guru.findOne({
      where: { token: token_kelas },
      attributes: ['kkm']
    });

    if (!guru) return res.status(404).json({ msg: "KKM tidak ditemukan untuk token tersebut" });

    res.json({ kkm: guru.kkm });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Gagal mengambil KKM" });
  }
};
