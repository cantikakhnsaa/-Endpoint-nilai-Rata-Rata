import express from "express";
import siswa from "./data/siswa.js";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Backend API Nilai Rata-rata berjalan"
  });
});

app.get("/nilai/rata-rata/:kelas", (req, res) => {
  const kelas = req.params.kelas;

  const orderBy = req.query.order_by
    ? req.query.order_by.toUpperCase()
    : "DESC";

  if (orderBy !== "ASC" && orderBy !== "DESC") {
    return res.status(400).json({
      message: "order_by harus ASC atau DESC"
    });
  }

  const siswaKelas = siswa.filter(
    (data) => data.kelas.toLowerCase() === kelas.toLowerCase()
  );

  if (siswaKelas.length === 0) {
    return res.status(404).json({
      message: "Kelas tidak ditemukan"
    });
  }

  const hasil = siswaKelas.map((data) => {
    const total = data.nilai.reduce(
      (jumlah, nilai) => jumlah + nilai,
      0
    );

    const average = Number(
      (total / data.nilai.length).toFixed(2)
    );

    return {
      name: data.nama,
      average: average
    };
  });

  if (orderBy === "ASC") {
    hasil.sort((a, b) => a.average - b.average);
  }

  if (orderBy === "DESC") {
    hasil.sort((a, b) => b.average - a.average);
  }

  res.json(hasil);
});

app.listen(port, () => {
  console.log(`server Berjalan di http://localhost:${port}`);
});