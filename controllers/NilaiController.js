import Users from "../models/UserModel.js";
import Nilai from "../models/NilaiModel.js";

// Ambil semua nilai siswa (bisa include data user juga)
export const getAllNilaiSiswa = async (req, res) => {
  try {
    const nilai = await Nilai.findAll({
      include: [{
        model: Users,
        attributes: ['id', 'nama', 'nisn', 'token_kelas']
      }]
    });
    res.json(nilai);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Gagal mengambil data nilai siswa" });
  }
};

// Ambil nilai siswa berdasarkan token_kelas
export const getNilaiByTokenKelas = async (req, res) => {
  const { token_kelas } = req.query;
  try {
    const nilai = await Nilai.findAll({
      include: [{
        model: Users,
        where: { token_kelas },
        attributes: ['id', 'nama', 'nisn', 'token_kelas']
      }]
    });
    res.json(nilai);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Gagal mengambil data nilai berdasarkan token kelas" });
  }
};

// Ambil nilai kuis tertentu saja
export const getNilaiByKuis = async (req, res) => {
  const { kuis } = req.query; // contoh: kuis=kuis_1
  if (!kuis || !/^kuis_[1-6]$/.test(kuis)) {
    return res.status(400).json({ msg: "Kolom kuis tidak valid" });
  }

  try {
    const nilai = await Nilai.findAll({
      attributes: ['id', [kuis, 'nilai']],
      include: [{
        model: Users,
        attributes: ['id', 'nama', 'nisn', 'token_kelas']
      }]
    });

    res.json(nilai);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Gagal mengambil nilai berdasarkan kuis" });
  }
};

// Update nilai kuis_1 untuk user yang sedang login
export const updateKuis1 = async (req, res) => {
  const { email } = req; // dari middleware
  const { nilai } = req.body;

  if (typeof nilai !== 'number' || nilai < 0 || nilai > 100) {
    return res.status(400).json({ msg: "Nilai harus berupa angka antara 0 - 100" });
  }

  try {
    // ✅ Cari user berdasarkan email
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    const userId = user.id;

    // ✅ Cek apakah entri nilai sudah ada
    const existingNilai = await Nilai.findOne({ where: { id: userId } });

    if (!existingNilai) {
      // Belum ada, buat baru
      await Nilai.create({
        id: userId,
        kuis_1: nilai
      });
    } else {
      // Sudah ada, update
      await Nilai.update({ kuis_1: nilai }, { where: { id: userId } });
    }

    res.json({ msg: "Nilai kuis_1 berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Gagal memperbarui nilai kuis_1" });
  }
};

// Update nilai kuis_2 untuk user yang sedang login
export const updateKuis2 = async (req, res) => {
  const { email } = req; // dari middleware
  const { nilai } = req.body;

  if (typeof nilai !== 'number' || nilai < 0 || nilai > 100) {
    return res.status(400).json({ msg: "Nilai harus berupa angka antara 0 - 100" });
  }

  try {
    // ✅ Cari user berdasarkan email
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    const userId = user.id;

    // ✅ Cek apakah entri nilai sudah ada
    const existingNilai = await Nilai.findOne({ where: { id: userId } });

    if (!existingNilai) {
      // Belum ada, buat baru
      await Nilai.create({
        id: userId,
        kuis_2: nilai
      });
    } else {
      // Sudah ada, update
      await Nilai.update({ kuis_2: nilai }, { where: { id: userId } });
    }

    res.json({ msg: "Nilai kuis_1 berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Gagal memperbarui nilai kuis_1" });
  }
};

// Update nilai kuis_2 untuk user yang sedang login
export const updateKuis3 = async (req, res) => {
  const { email } = req; // dari middleware
  const { nilai } = req.body;

  if (typeof nilai !== 'number' || nilai < 0 || nilai > 100) {
    return res.status(400).json({ msg: "Nilai harus berupa angka antara 0 - 100" });
  }

  try {
    // ✅ Cari user berdasarkan email
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    const userId = user.id;

    // ✅ Cek apakah entri nilai sudah ada
    const existingNilai = await Nilai.findOne({ where: { id: userId } });

    if (!existingNilai) {
      // Belum ada, buat baru
      await Nilai.create({
        id: userId,
        kuis_3: nilai
      });
    } else {
      // Sudah ada, update
      await Nilai.update({ kuis_3: nilai }, { where: { id: userId } });
    }

    res.json({ msg: "Nilai kuis_1 berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Gagal memperbarui nilai kuis_1" });
  }
};

// Update nilai kuis_4 untuk user yang sedang login
export const updateKuis4 = async (req, res) => {
  const { email } = req; // dari middleware
  const { nilai } = req.body;

  if (typeof nilai !== 'number' || nilai < 0 || nilai > 100) {
    return res.status(400).json({ msg: "Nilai harus berupa angka antara 0 - 100" });
  }

  try {
    // ✅ Cari user berdasarkan email
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    const userId = user.id;

    // ✅ Cek apakah entri nilai sudah ada
    const existingNilai = await Nilai.findOne({ where: { id: userId } });

    if (!existingNilai) {
      // Belum ada, buat baru
      await Nilai.create({
        id: userId,
        kuis_4: nilai
      });
    } else {
      // Sudah ada, update
      await Nilai.update({ kuis_4: nilai }, { where: { id: userId } });
    }

    res.json({ msg: "Nilai kuis_1 berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Gagal memperbarui nilai kuis_1" });
  }
};

// Update nilai kuis_5 untuk user yang sedang login
export const updateKuis5 = async (req, res) => {
  const { email } = req; // dari middleware
  const { nilai } = req.body;

  if (typeof nilai !== 'number' || nilai < 0 || nilai > 100) {
    return res.status(400).json({ msg: "Nilai harus berupa angka antara 0 - 100" });
  }

  try {
    // ✅ Cari user berdasarkan email
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    const userId = user.id;

    // ✅ Cek apakah entri nilai sudah ada
    const existingNilai = await Nilai.findOne({ where: { id: userId } });

    if (!existingNilai) {
      // Belum ada, buat baru
      await Nilai.create({
        id: userId,
        kuis_5: nilai
      });
    } else {
      // Sudah ada, update
      await Nilai.update({ kuis_5: nilai }, { where: { id: userId } });
    }

    res.json({ msg: "Nilai kuis_1 berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Gagal memperbarui nilai kuis_1" });
  }
};

// Update nilai evaluasi untuk user yang sedang login
export const updateEvaluasi = async (req, res) => {
  const { email } = req; // dari middleware
  const { nilai } = req.body;

  if (typeof nilai !== 'number' || nilai < 0 || nilai > 100) {
    return res.status(400).json({ msg: "Nilai harus berupa angka antara 0 - 100" });
  }

  try {
    // ✅ Cari user berdasarkan email
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    const userId = user.id;

    // ✅ Cek apakah entri nilai sudah ada
    const existingNilai = await Nilai.findOne({ where: { id: userId } });

    if (!existingNilai) {
      // Belum ada, buat baru
      await Nilai.create({
        id: userId,
        evaluasi: nilai
      });
    } else {
      // Sudah ada, update
      await Nilai.update({ evaluasi: nilai }, { where: { id: userId } });
    }

    res.json({ msg: "Nilai kuis_1 berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Gagal memperbarui nilai kuis_1" });
  }
};