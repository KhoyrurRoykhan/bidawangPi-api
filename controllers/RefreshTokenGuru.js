import Guru from "../models/GuruModel.js";
import jwt from "jsonwebtoken";

export const refreshTokenGuru = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    const guru = await Guru.findAll({
      where: {
        refresh_token: refreshToken
      }
    });

    if (!guru[0]) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);

      const userId = guru[0].id;
      const nama = guru[0].nama;
      const email = guru[0].email;
      const instansi = guru[0].instansi;
      const token = guru[0].token;

      const accessToken = jwt.sign(
        { userId, nama, email, instansi, token },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15s' }
      );

      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
  }
};
