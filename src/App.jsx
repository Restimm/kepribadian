import { useState, useEffect, useRef } from "react";
import "./App.css";

import background from "./assets/background.png";
import backgroundAndroid from "./assets/background_android.png";
import langkah1 from "./assets/langkah1.png";
import langkah2 from "./assets/langkah2.png";
import langkah3 from "./assets/langkah3.png";
import logo from "./assets/logo.png";
import bunga from "./assets/bunga.png";


/* ==================================================
   DATA DIMENSI (BIG FIVE / OCEAN)
================================================== */

const PER_PAGE = 5;

const DIMENSIONS = [
  {
    key: "O",
    label: "Keterbukaan",
    color: "#d65b7c",
    /* GANTI dengan deskripsi O dari Figma */
    title: "Keterbukaan terhadap hal baru, rasa ingin tahu, dan imajinasi.",
    frasa: "terbuka pada hal baru, penasaran, dan imajinatif",
    frasaRendah: "lebih nyaman dengan hal-hal yang sudah familiar",
  },
  {
    key: "C",
    label: "Kehati-hatian",
    color: "#2d8eb8",
    title: "Tanggung jawab, keteraturan, dan kemampuan mengatur diri.",
    frasa: "teratur, disiplin, dan bertanggung jawab",
    frasaRendah: "lebih santai dan spontan dalam mengatur sesuatu",
  },
  {
    key: "E",
    label: "Ekstraversi",
    color: "#f0a43a",
    title: "Interaksi sosial, keaktifan, dan energi dalam bersosialisasi.",
    frasa: "energik, ramah, dan mudah bersosialisasi",
    frasaRendah: "lebih menikmati ketenangan dan waktu sendiri",
  },
  {
    key: "A",
    label: "Keramahan",
    color: "#5cad68",
    title: "Empati, kepedulian, dan kecenderungan bekerja sama dengan orang lain.",
    frasa: "peduli, hangat, dan mudah bekerja sama",
    frasaRendah: "lugas dan tegas dalam mempertahankan pendapat",
  },
  {
    key: "N",
    label: "Neurotisisme",
    color: "#8a6bbf",
    title: "Kecenderungan mengalami kekhawatiran, ketegangan, atau perubahan emosi.",
    frasa: "peka terhadap emosi dan tekanan di sekitarmu",
    frasaRendah: "tenang dan stabil secara emosi",
  },
];

const SCALE = [
  { value: 1, label: "Sangat Tidak Sesuai" },
  { value: 2, label: "Tidak Sesuai" },
  { value: 3, label: "Netral" },
  { value: 4, label: "Sesuai" },
  { value: 5, label: "Sangat Sesuai" },
];


/* ==================================================
   DATA PERTANYAAN
   - reverse: true -> skor dibalik (6 - jawaban)
   - Soal 1-5 (O) MASIH CONTOH, ganti dengan soal asli
================================================== */

const QUESTIONS = [
  /* O : soal 1-5, reverse nomor 4  (MASIH CONTOH) */
  { id: 1, dim: "O", reverse: false, text: "Aku suka mencoba hal-hal baru yang belum pernah kulakukan." },
  { id: 2, dim: "O", reverse: false, text: "Aku sering memikirkan ide-ide yang kreatif atau tidak biasa." },
  { id: 3, dim: "O", reverse: false, text: "Aku penasaran dengan banyak hal di sekitarku." },
  { id: 4, dim: "O", reverse: true,  text: "Aku lebih nyaman dengan cara lama daripada mencoba cara baru." },
  { id: 5, dim: "O", reverse: false, text: "Aku menikmati seni, musik, atau karya imajinatif." },

  /* C : soal 6-10, reverse nomor 9 */
  { id: 6,  dim: "C", reverse: false, text: "Kalau punya tugas, aku berusaha menyelesaikannya sesuai waktu yang sudah ditentukan." },
  { id: 7,  dim: "C", reverse: false, text: "Aku biasanya punya rencana sebelum mulai mengerjakan sesuatu." },
  { id: 8,  dim: "C", reverse: false, text: "Aku tetap berusaha menyelesaikan sesuatu meskipun sedang nggak mood." },
  { id: 9,  dim: "C", reverse: true,  text: "Aku sering menunda sesuatu sampai waktunya benar-benar mepet." },
  { id: 10, dim: "C", reverse: false, text: "Aku merasa lebih nyaman kalau barang dan kegiatan yang harus kulakukan tertata dengan jelas." },

  /* E : soal 11-15, reverse nomor 15 */
  { id: 11, dim: "E", reverse: false, text: "Aku cukup mudah memulai obrolan dengan orang yang baru kukenal." },
  { id: 12, dim: "E", reverse: false, text: "Aku menikmati suasana yang ramai dan banyak orang." },
  { id: 13, dim: "E", reverse: false, text: "Kalau ada diskusi atau kegiatan kelompok, aku biasanya cukup aktif ikut terlibat." },
  { id: 14, dim: "E", reverse: false, text: "Setelah banyak berinteraksi dengan orang lain, aku biasanya merasa lebih bersemangat." },
  { id: 15, dim: "E", reverse: true,  text: "Aku lebih nyaman diam dan mengamati daripada ikut banyak ngobrol dalam kelompok." },

  /* A : soal 16-20, reverse nomor 20 */
  { id: 16, dim: "A", reverse: false, text: "Aku biasanya berusaha memahami perasaan orang lain sebelum memberikan pendapat." },
  { id: 17, dim: "A", reverse: false, text: "Kalau ada teman yang sedang kesulitan, aku terdorong untuk membantunya." },
  { id: 18, dim: "A", reverse: false, text: "Aku tetap menghargai pendapat orang lain meskipun berbeda dengan pendapatku." },
  { id: 19, dim: "A", reverse: false, text: "Aku cukup mudah bekerja sama dengan orang lain meskipun kami punya cara berpikir yang berbeda." },
  { id: 20, dim: "A", reverse: true,  text: "Kalau terjadi perbedaan pendapat, aku lebih memilih mempertahankan keinginanku daripada mencari jalan tengah." },

  /* N : soal 21-25, reverse nomor 24 */
  { id: 21, dim: "N", reverse: false, text: "Aku sering kepikiran tentang hal-hal yang belum tentu terjadi." },
  { id: 22, dim: "N", reverse: false, text: "Kalau ada sesuatu yang berjalan di luar rencana, aku bisa merasa cukup panik atau cemas." },
  { id: 23, dim: "N", reverse: false, text: "Kritik atau komentar negatif tentang diriku terkadang terbawa ke pikiran cukup lama." },
  { id: 24, dim: "N", reverse: true,  text: "Aku biasanya tetap tenang ketika menghadapi situasi yang membuat orang lain panik." },
  { id: 25, dim: "N", reverse: false, text: "Hal kecil yang mengganggu bisa membuat suasana hatiku berubah cukup lama." },
];


/* ==================================================
   TEKS KETERANGAN PER DIMENSI & LEVEL
================================================== */

const INTERPRETASI = {
  O: {
    rendah: {
      desc: "Kamu lebih nyaman dengan hal-hal yang sudah dikenal dan terbukti. Kamu cenderung praktis, konsisten, dan realistis dalam melihat sesuatu.",
      tip: "Coba sesekali melangkah keluar dari kebiasaan, misalnya mencoba satu hal kecil yang baru setiap minggu.",
    },
    sedang: {
      desc: "Kamu cukup terbuka pada hal baru, tetapi tetap menimbang dulu sebelum mencoba. Rasa penasaran dan kehati-hatianmu berjalan seimbang.",
      tip: "Pertahankan keseimbangan ini, dan beri ruang untuk ide-ide yang sedikit di luar kebiasaan.",
    },
    tinggi: {
      desc: "Kamu penuh rasa ingin tahu, imajinatif, dan senang mengeksplorasi ide serta pengalaman baru. Kamu mudah tertarik pada seni, gagasan, dan sudut pandang yang berbeda.",
      tip: "Salurkan kreativitasmu ke satu proyek nyata agar ide-idemu tidak berhenti di kepala.",
    },
  },
  C: {
    rendah: {
      desc: "Kamu cenderung santai, fleksibel, dan spontan. Kamu tidak terlalu terikat pada jadwal dan rencana yang kaku.",
      tip: "Daftar tugas sederhana atau pengingat bisa membantu menjaga hal-hal penting tetap tepat waktu.",
    },
    sedang: {
      desc: "Kamu cukup teratur dan bisa diandalkan, namun masih punya ruang untuk fleksibel saat keadaan berubah.",
      tip: "Tentukan 2–3 prioritas utama setiap hari agar tetap fokus tanpa merasa tertekan.",
    },
    tinggi: {
      desc: "Kamu terorganisir, disiplin, dan bertanggung jawab. Kamu suka punya rencana dan berusaha menyelesaikan sesuatu dengan baik.",
      tip: "Ingat untuk memberi ruang istirahat dan menerima hasil yang cukup baik, tidak harus selalu sempurna.",
    },
  },
  E: {
    rendah: {
      desc: "Kamu cenderung tenang, reflektif, dan lebih menikmati waktu sendiri atau lingkaran kecil yang akrab. Keramaian bisa terasa melelahkan bagimu.",
      tip: "Beri dirimu waktu untuk mengisi ulang energi, dan tetap jaga komunikasi dengan beberapa orang terdekat.",
    },
    sedang: {
      desc: "Kamu bisa menikmati kebersamaan sekaligus waktu sendiri, dan mampu menyesuaikan diri dengan suasana.",
      tip: "Kenali kapan kamu butuh bersosialisasi dan kapan butuh sendiri, lalu atur porsinya.",
    },
    tinggi: {
      desc: "Kamu energik, ramah, dan mudah bergaul. Kamu merasa bersemangat ketika berada di dekat orang lain.",
      tip: "Sesekali luangkan waktu tenang untuk merefleksikan diri agar energimu tetap seimbang.",
    },
  },
  A: {
    rendah: {
      desc: "Kamu cenderung lugas, kritis, dan berani mempertahankan pendapat. Kamu lebih mengutamakan logika dibanding menyenangkan semua orang.",
      tip: "Menyampaikan pendapat dengan nada yang hangat bisa membuat kerja sama terasa lebih mudah.",
    },
    sedang: {
      desc: "Kamu cukup peduli dan kooperatif, namun tetap bisa tegas ketika diperlukan.",
      tip: "Pertahankan keseimbangan antara empati dan batasan pribadimu.",
    },
    tinggi: {
      desc: "Kamu hangat, peduli, dan mudah bekerja sama. Kamu cenderung percaya pada orang lain dan senang membantu.",
      tip: "Jangan lupa menjaga batasan diri. Boleh berkata “tidak” tanpa merasa bersalah.",
    },
  },
  N: {
    rendah: {
      desc: "Kamu cenderung tenang dan stabil secara emosi, tidak mudah terguncang oleh tekanan atau masalah kecil.",
      tip: "Pertahankan caramu mengelola tekanan, dan tetap peka bila orang di sekitarmu sedang kesulitan.",
    },
    sedang: {
      desc: "Kamu bisa merasa khawatir atau tegang pada situasi tertentu, tetapi umumnya mampu pulih dan menyesuaikan diri.",
      tip: "Kenali pemicu stresmu dan siapkan kebiasaan menenangkan, seperti bernapas dalam, jalan santai, atau bercerita pada orang terpercaya.",
    },
    tinggi: {
      desc: "Kamu cenderung peka secara emosi: mudah merasa khawatir, tegang, atau terpengaruh perubahan suasana. Kepekaan ini juga bisa menjadi kekuatan karena kamu waspada dan peduli pada detail.",
      tip: "Latih teknik menenangkan diri, jaga pola tidur, dan jangan ragu bercerita pada orang terpercaya atau konselor bila terasa berat.",
    },
  },
};

const LEVEL_LABEL = {
  rendah: "Rendah",
  sedang: "Sedang",
  tinggi: "Tinggi",
};


/* ==================================================
   FUNGSI BANTU
================================================== */

/* Skor tiap dimensi: total (5-25) dan persen (0-100) */
function hitungSkor(answers) {
  const hasil = {};

  DIMENSIONS.forEach((d) => {
    const soal = QUESTIONS.filter((q) => q.dim === d.key);

    const total = soal.reduce((sum, q) => {
      const v = answers[q.id] ?? 0;
      return sum + (q.reverse ? 6 - v : v);
    }, 0);

    hasil[d.key] = {
      total,
      rata: +(total / soal.length).toFixed(2),
      persen: Math.round(((total - soal.length) / (soal.length * 4)) * 100),
    };
  });

  return hasil;
}

function levelDari(persen) {
  if (persen < 40) return "rendah";
  if (persen < 70) return "sedang";
  return "tinggi";
}

/* Dua pernyataan yang paling menonjol dari jawaban user */
function ambilSorotan(dimKey, answers) {
  return QUESTIONS
    .filter((q) => q.dim === dimKey)
    .map((q) => {
      const v = answers[q.id] ?? 3;
      const adj = q.reverse ? 6 - v : v;
      return {
        id: q.id,
        text: q.text,
        adj,
        jawaban: SCALE[v - 1].label,
      };
    })
    .filter((s) => Math.abs(s.adj - 3) >= 1)
    .sort((a, b) => Math.abs(b.adj - 3) - Math.abs(a.adj - 3))
    .slice(0, 2);
}

/* Kesimpulan keseluruhan */
function buatKesimpulan(skor) {
  const urut = [...DIMENSIONS].sort(
    (a, b) => skor[b.key].persen - skor[a.key].persen
  );

  const dominan = urut.filter((d) => skor[d.key].persen >= 60).slice(0, 2);
  const terendah = urut[urut.length - 1];

  let judul;
  const paragraf = [];

  if (dominan.length > 0) {
    judul = `Paling menonjol: ${dominan.map((d) => d.label).join(" & ")}`;

    paragraf.push(
      `Berdasarkan 25 jawabanmu, kamu cenderung ${dominan
        .map((d) => d.frasa)
        .join(", serta ")}.`
    );
  } else {
    judul = "Profil yang seimbang";

    paragraf.push(
      "Skormu relatif seimbang di kelima dimensi. Artinya kamu fleksibel dan bisa menyesuaikan diri dengan beragam situasi."
    );
  }

  if (skor[terendah.key].persen < 40) {
    paragraf.push(
      `Pada dimensi ${terendah.label}, skormu paling rendah. Kamu ${terendah.frasaRendah}, dan itu bukan hal yang buruk, hanya gaya khasmu.`
    );
  }

  const acuan = dominan[0] ?? urut[0];
  const tip = INTERPRETASI[acuan.key][levelDari(skor[acuan.key].persen)].tip;

  return { judul, paragraf, tip, dominan };
}


/* ==================================================
   NAVBAR
   Props:
   - page   : halaman aktif (1-4)
   - info   : "about" | "guide" | null (popup yang terbuka)
   - onHome : klik Beranda / nama aplikasi
   - onInfo : buka popup ("about" atau "guide")
================================================== */

function Navbar({ page, info, onHome, onInfo }) {
  const [open, setOpen] = useState(false);

  const pilih = (fn) => {
    setOpen(false);
    fn();
  };

  return (
    <header className="navbar">

      {/* Nama aplikasi */}
      <button
        type="button"
        className="navbar-brand"
        onClick={() => pilih(onHome)}
      >
        <span className="navbar-title">
          Kepribadian
        </span>

        <span className="navbar-subtitle">
          Bimbingan &amp; Asesmen Masalah Individu
        </span>
      </button>


      {/* Menu */}
      <nav className={`navbar-menu ${open ? "open" : ""}`}>

        <button
          type="button"
          className={`nav-link ${page === 1 && !info ? "active" : ""}`}
          onClick={() => pilih(onHome)}
        >
          Beranda
        </button>

        <button
          type="button"
          className={`nav-link ${info === "about" ? "active" : ""}`}
          onClick={() => pilih(() => onInfo("about"))}
        >
          Tentang
        </button>

        <button
          type="button"
          className={`nav-link ${info === "guide" ? "active" : ""}`}
          onClick={() => pilih(() => onInfo("guide"))}
        >
          Panduan
        </button>

      </nav>


      {/* Tombol menu (khusus layar kecil) */}
      <button
        type="button"
        className={`navbar-burger ${open ? "open" : ""}`}
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>

    </header>
  );
}


/* ==================================================
   POPUP TENTANG / PANDUAN
================================================== */

function InfoModal({ type, onClose }) {

  /* Tutup dengan tombol Esc */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isAbout = type === "about";

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-label={isAbout ? "Tentang Aplikasi" : "Panduan Pengerjaan"}
      >

        {isAbout ? (
          <>
            <h2>Tentang Aplikasi</h2>

            <p className="modal-text">
              Aplikasi ini adalah tes kepribadian berbasis model
              Big Five (OCEAN) yang menggambarkan kecenderungan
              kepribadianmu dalam lima dimensi. Tes terdiri dari
              25 pernyataan dan dikerjakan sekitar 5–10 menit.
            </p>

            <div className="modal-dims">
              {DIMENSIONS.map((d) => (
                <div
                  className="modal-dim"
                  key={d.key}
                  style={{ "--c": d.color }}
                >
                  <span className="modal-dim-key">{d.key}</span>

                  <div>
                    <strong>{d.label}</strong>
                    <p>{d.title}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="modal-note">
              Hasil tes adalah gambaran kecenderungan, bukan
              diagnosis atau penilaian benar-salah.
            </p>
          </>
        ) : (
          <>
            <h2>Panduan Pengerjaan</h2>

            <ol className="modal-steps">
              <li>
                Baca setiap pernyataan, lalu pilih satu jawaban yang
                paling menggambarkan dirimu.
              </li>
              <li>
                Jawab dengan jujur sesuai keadaanmu yang sebenarnya.
                Tidak ada jawaban benar atau salah.
              </li>
              <li>
                Setiap bagian berisi 5 pernyataan. Tombol
                {" "}<strong>Berikutnya</strong> aktif setelah semuanya
                terjawab.
              </li>
              <li>
                Setelah 25 pernyataan selesai, kamu akan melihat
                grafik, penjelasan, dan kesimpulan kepribadianmu.
              </li>
            </ol>

            <div className="modal-scale-title">Skala jawaban</div>

            <div className="modal-scale">
              {SCALE.map((s) => (
                <span className="modal-scale-item" key={s.value}>
                  <b>{s.value}</b> {s.label}
                </span>
              ))}
            </div>
          </>
        )}

        <button
          type="button"
          className="modal-close"
          onClick={onClose}
        >
          Tutup
        </button>

      </div>
    </div>
  );
}


/* ==================================================
   KUESIONER (HALAMAN 3)
================================================== */

function pesanProgress(percent) {
  if (percent === 0) return "Yuk mulai, jawab sejujurnya ya!";
  if (percent < 25) return "Awal yang bagus, lanjutkan!";
  if (percent < 50) return "Kamu sudah melangkah jauh!";
  if (percent < 75) return "Sudah lebih dari setengah, semangat!";
  if (percent < 100) return "Tinggal sedikit lagi!";
  return "Semua terjawab! Siap lihat hasilmu";
}

function Kuesioner({ answers, setAnswers, qPage, setQPage, onBack, onFinish }) {
  const topRef = useRef(null);
  const [toast, setToast] = useState(null);

  const totalPages = QUESTIONS.length / PER_PAGE;
  const dim = DIMENSIONS[qPage];

  const pageQuestions = QUESTIONS.slice(
    qPage * PER_PAGE,
    (qPage + 1) * PER_PAGE
  );

  const answeredTotal = Object.keys(answers).length;
  const percent = Math.round((answeredTotal / QUESTIONS.length) * 100);

  const pageComplete = pageQuestions.every((q) => answers[q.id]);
  const isLast = qPage === totalPages - 1;

  /* Cincin progress */
  const ringR = 26;
  const ringC = 2 * Math.PI * ringR;

  /* Scroll ke atas setiap pindah bagian soal */
  useEffect(() => {
    const scroller = topRef.current?.closest(".quiz-scroll");
    if (scroller) {
      scroller.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [qPage]);

  /* Toast hilang otomatis */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2300);
    return () => clearTimeout(t);
  }, [toast]);

  const pilih = (q, value) => {
    const next = { ...answers, [q.id]: value };

    const soalDim = QUESTIONS.filter((x) => x.dim === q.dim);
    const sebelum = soalDim.every((x) => answers[x.id]);
    const sesudah = soalDim.every((x) => next[x.id]);

    setAnswers(next);

    if (!sebelum && sesudah) {
      const d = DIMENSIONS.find((x) => x.key === q.dim);
      setToast({
        id: Date.now(),
        text: `Bagian ${d.label} selesai`,
      });
    }
  };

  const handleNext = () => {
    if (!pageComplete) return;

    if (isLast) {
      onFinish();
    } else {
      setQPage((p) => p + 1);
    }
  };

  const handleBack = () => {
    if (qPage === 0) {
      onBack();
    } else {
      setQPage((p) => p - 1);
    }
  };

  return (
    <div className="kz-wrapper" ref={topRef}>

      {/* ================= PROGRESS DINAMIS ================= */}
      <div className="kz-progress">

        {/* Cincin persen */}
        <div className="kz-ring">
          <svg viewBox="0 0 64 64">
            <circle
              className="kz-ring-bg"
              cx="32"
              cy="32"
              r={ringR}
            />
            <circle
              className="kz-ring-fg"
              cx="32"
              cy="32"
              r={ringR}
              strokeDasharray={ringC}
              strokeDashoffset={ringC * (1 - percent / 100)}
              transform="rotate(-90 32 32)"
            />
          </svg>
          <div className="kz-ring-text">{percent}%</div>
        </div>

        <div className="kz-progress-main">

          <div className="kz-progress-info">
            <span className="kz-msg" key={pesanProgress(percent)}>
              {pesanProgress(percent)}
            </span>
            <span className="kz-count">
              {answeredTotal} / {QUESTIONS.length}
            </span>
          </div>

          <div className="kz-bar">
            <div
              className="kz-bar-fill"
              style={{ width: `${percent}%` }}
            />
            <i className="kz-tick" style={{ left: "25%" }} />
            <i className="kz-tick" style={{ left: "50%" }} />
            <i className="kz-tick" style={{ left: "75%" }} />
          </div>

          <div className="kz-steps">
            {DIMENSIONS.map((d, i) => {
              const soal = QUESTIONS.filter((q) => q.dim === d.key);
              const done = soal.filter((q) => answers[q.id]).length;
              const full = done === soal.length;

              return (
                <div
                  key={d.key}
                  className={`kz-chip ${i === qPage ? "active" : ""} ${full ? "full" : ""}`}
                  style={{ "--c": d.color }}
                  title={d.label}
                >
                  <div className="kz-chip-top">
                    <span className="kz-chip-key">{d.key}</span>
                    <span className="kz-chip-count">
                      {done}/{soal.length}
                    </span>
                  </div>

                  <div className="kz-chip-track">
                    <div
                      className="kz-chip-fill"
                      style={{ width: `${(done / soal.length) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>


      {/* ================= JUDUL BAGIAN ================= */}
      <div
        className="kz-badge"
        key={`badge-${dim.key}`}
        style={{ "--c": dim.color }}
      >
        Bagian {qPage + 1} dari {totalPages} · {dim.label}
      </div>

      <h2 className="kz-title" key={dim.key}>
        {dim.title}
      </h2>


      {/* ================= DAFTAR SOAL ================= */}
      <div className="kz-list" key={`bagian-${qPage}`}>
        {pageQuestions.map((q, i) => {
          const terjawab = !!answers[q.id];

          return (
            <section
              key={q.id}
              className={`kz-question ${i % 2 === 0 ? "light" : "dark"} ${terjawab ? "answered" : ""}`}
              style={{ "--c": dim.color }}
            >
              <p className="kz-text">
                <span className="kz-num">{i + 1}</span>
                <span>{q.text}</span>
              </p>

              <div
                className="kz-options"
                role="radiogroup"
                aria-label={`Soal ${i + 1}`}
              >
                {SCALE.map((s) => (
                  <label
                    key={s.value}
                    className={`kz-option ${answers[q.id] === s.value ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={s.value}
                      checked={answers[q.id] === s.value}
                      onChange={() => pilih(q, s.value)}
                    />
                    <span className="kz-radio" />
                    <span className="kz-label">{s.label}</span>
                  </label>
                ))}
              </div>
            </section>
          );
        })}
      </div>


      {/* ================= TOMBOL ================= */}
      <div className="kz-actions">
        <button
          type="button"
          className="kz-btn kz-btn-back"
          onClick={handleBack}
        >
          Kembali
        </button>

        <button
          type="button"
          className={`kz-btn kz-btn-next ${pageComplete ? "ready" : ""}`}
          onClick={handleNext}
          disabled={!pageComplete}
        >
          {isLast ? "Lihat Hasil" : "Berikutnya"}
        </button>
      </div>


      {/* ================= TOAST ================= */}
      {toast && (
        <div className="kz-toast" key={toast.id}>
          {toast.text}
        </div>
      )}

    </div>
  );
}


/* ==================================================
   HASIL (HALAMAN 4)
================================================== */

/* Angka yang menghitung naik */
function AngkaNaik({ nilai, aktif }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!aktif) return;

    let raf;
    const mulai = performance.now();
    const durasi = 1200;

    const tick = (t) => {
      const p = Math.min((t - mulai) / durasi, 1);
      setN(Math.round(nilai * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [nilai, aktif]);

  return <>{n}</>;
}

/* Grafik radar OCEAN */
function Radar({ skor, show }) {
  const C = 160;
  const R = 105;

  const titik = (i, persen, extra = 0) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / DIMENSIONS.length;
    const r = (R * persen) / 100 + extra;
    return [C + r * Math.cos(a), C + r * Math.sin(a)];
  };

  const ring = (p) =>
    DIMENSIONS.map((_, i) => titik(i, p).join(",")).join(" ");

  const dataPoly = DIMENSIONS
    .map((d, i) => titik(i, skor[d.key].persen).join(","))
    .join(" ");

  return (
    <svg viewBox="0 0 320 320" className="rs-radar" role="img" aria-label="Grafik radar OCEAN">
      <defs>
        <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d65b7c" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8a6bbf" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {/* Cincin latar */}
      {[25, 50, 75, 100].map((p) => (
        <polygon key={p} points={ring(p)} className="rs-ring" />
      ))}

      {/* Garis sumbu */}
      {DIMENSIONS.map((d, i) => {
        const [x, y] = titik(i, 100);
        return (
          <line key={d.key} x1={C} y1={C} x2={x} y2={y} className="rs-axis" />
        );
      })}

      {/* Area data */}
      <polygon
        points={dataPoly}
        className={`rs-poly ${show ? "show" : ""}`}
      />

      {/* Titik + label */}
      {DIMENSIONS.map((d, i) => {
        const p = skor[d.key].persen;
        const [dx, dy] = titik(i, p);
        const [lx, ly] = titik(i, 100, 28);

        return (
          <g key={d.key}>
            <circle
              cx={dx}
              cy={dy}
              r="5.5"
              fill={d.color}
              className={`rs-dot ${show ? "show" : ""}`}
              style={{ transitionDelay: `${0.6 + i * 0.1}s` }}
            />

            <text
              x={lx}
              y={ly - 2}
              textAnchor="middle"
              className="rs-lbl-key"
              fill={d.color}
            >
              {d.key}
            </text>

            <text
              x={lx}
              y={ly + 12}
              textAnchor="middle"
              className="rs-lbl-pct"
            >
              {p}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* Gauge melingkar */
function Gauge({ persen, color, show }) {
  const r = 38;
  const c = 2 * Math.PI * r;

  return (
    <div className="rs-gauge">
      <svg viewBox="0 0 100 100">
        <circle className="rs-gauge-bg" cx="50" cy="50" r={r} />
        <circle
          className="rs-gauge-fg"
          cx="50"
          cy="50"
          r={r}
          stroke={color}
          strokeDasharray={c}
          strokeDashoffset={show ? c * (1 - persen / 100) : c}
          transform="rotate(-90 50 50)"
        />
      </svg>

      <div className="rs-gauge-center">
        <strong>
          <AngkaNaik nilai={persen} aktif={show} />
        </strong>
        <small>%</small>
      </div>
    </div>
  );
}

function Hasil({ skor, answers, nav, onReview, onReset }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 150);
    return () => clearTimeout(t);
  }, []);

  const kesimpulan = buatKesimpulan(skor);

  return (
    <div className="result-page">

      {/* Navbar */}
      <Navbar {...nav} />

      <div className="rs-container">

        {/* Judul */}
        <div className="rs-hero">
          <h1>Hasil Kepribadianmu</h1>
          <p>
            Inilah gambaran profil Big Five (OCEAN) berdasarkan
            25 jawabanmu.
          </p>
        </div>


        {/* Radar + Kesimpulan */}
        <div className="rs-top">

          <div className="rs-card rs-radar-card">
            <h3>Peta Kepribadian</h3>
            <Radar skor={skor} show={show} />
          </div>

          <div className="rs-card rs-summary">
            <span className="rs-tag">Kesimpulan</span>

            <h2>{kesimpulan.judul}</h2>

            {kesimpulan.dominan.length > 0 && (
              <div className="rs-chips">
                {kesimpulan.dominan.map((d) => (
                  <span
                    key={d.key}
                    className="rs-chip"
                    style={{ "--c": d.color }}
                  >
                    {d.label} {skor[d.key].persen}%
                  </span>
                ))}
              </div>
            )}

            {kesimpulan.paragraf.map((p, i) => (
              <p key={i} className="rs-para">
                {p}
              </p>
            ))}

            <div className="rs-tip">
              <strong>Saran untukmu</strong>
              <p>{kesimpulan.tip}</p>
            </div>
          </div>

        </div>


        {/* Rincian per dimensi */}
        <h3 className="rs-section-title">Rincian per Dimensi</h3>

        <div className="rs-grid">
          {DIMENSIONS.map((d, i) => {
            const persen = skor[d.key].persen;
            const level = levelDari(persen);
            const info = INTERPRETASI[d.key][level];
            const sorotan = ambilSorotan(d.key, answers);

            return (
              <div
                key={d.key}
                className="rs-card rs-dim"
                style={{
                  "--c": d.color,
                  animationDelay: `${i * 0.12}s`,
                }}
              >

                <div className="rs-dim-head">
                  <Gauge persen={persen} color={d.color} show={show} />

                  <div>
                    <div className="rs-dim-name">
                      {d.label} ({d.key})
                    </div>

                    <span className={`rs-level rs-level-${level}`}>
                      {LEVEL_LABEL[level]}
                    </span>
                  </div>
                </div>

                <p className="rs-desc">{info.desc}</p>

                {sorotan.length > 0 && (
                  <div className="rs-hl">
                    <div className="rs-hl-title">Dari jawabanmu</div>

                    <ul>
                      {sorotan.map((s) => (
                        <li key={s.id}>
                          <span className="rs-hl-text">“{s.text}”</span>
                          <span className="rs-hl-ans">{s.jawaban}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="rs-dim-tip">
                  <strong>Saran:</strong> {info.tip}
                </div>

              </div>
            );
          })}
        </div>


        <p className="rs-disclaimer">
          Hasil ini adalah gambaran kecenderungan berdasarkan jawabanmu
          saat ini, bukan diagnosis. Jika ada hal yang terasa berat,
          kamu bisa berbicara dengan guru BK, konselor, atau orang
          yang kamu percaya.
        </p>


        <div className="result-actions">
          <button onClick={onReview}>
            Periksa Jawaban
          </button>

          <button onClick={onReset}>
            Ulangi dari Awal
          </button>
        </div>

      </div>

    </div>
  );
}


/* ==================================================
   APP
================================================== */

function App() {
  const [page, setPage] = useState(1);

  /* Transisi antar halaman */
  const [leaving, setLeaving] = useState(false);

  /* Popup menu navbar: "about" | "guide" | null */
  const [info, setInfo] = useState(null);

  /* State kuesioner (disimpan di sini supaya tidak hilang saat Kembali) */
  const [answers, setAnswers] = useState({});
  const [qPage, setQPage] = useState(0);
  const [skor, setSkor] = useState(null);

  /* Pindah halaman dengan animasi keluar lalu masuk.
     "sesudah" dijalankan setelah animasi keluar selesai. */
  const goTo = (next, sesudah) => {
    if (leaving) return;

    setInfo(null);
    setLeaving(true);

    setTimeout(() => {
      if (sesudah) sesudah();
      setPage(next);
      setLeaving(false);
    }, 320);
  };

  /* Props navbar (dipakai di semua halaman) */
  const nav = {
    page,
    info,
    onHome: () => {
      setInfo(null);
      if (page !== 1) goTo(1);
    },
    onInfo: (tipe) => setInfo((prev) => (prev === tipe ? null : tipe)),
  };


  const renderPage = () => {

    /* ==================================================
       HALAMAN 1
    ================================================== */

    if (page === 1) {
      return (
        <div className="home">

          {/* Background: otomatis ganti di layar HP (maks. 700px) */}
          <picture>
            <source
              media="(max-width: 700px)"
              srcSet={backgroundAndroid}
            />

            <img
              src={background}
              alt="Kenal Yuk"
              className="background"
            />
          </picture>

          {/* Navbar */}
          <Navbar {...nav} />

          {/* Tombol Mulai */}
          <button
            className="start-button"
            onClick={() => goTo(2)}
          >
            Mulai
          </button>

        </div>
      );
    }


    /* ==================================================
       HALAMAN 2
    ================================================== */

    if (page === 2) {
      return (
        <div className="intro-page">

          {/* Gelembung dekoratif */}
          <span className="bubble b1" />
          <span className="bubble b2" />
          <span className="bubble b3" />
          <span className="bubble b4" />

          {/* Navbar */}
          <Navbar {...nav} />

          {/* Tombol Kembali */}
          <button
            className="back-button"
            onClick={() => goTo(1)}
          >
            Kembali
          </button>


          {/* Logo */}
          <img
            src={logo}
            alt="Logo"
            className="logo"
          />


          {/* Judul */}
          <h1 className="intro-title">
            Mari Kenali Diri!
          </h1>


          {/* Tombol Selanjutnya */}
          <button
            className="next-button"
            onClick={() => goTo(3)}
          >
            Selanjutnya
          </button>


          {/* Tiga langkah */}
          <div className="steps">

            {/* Langkah 1 */}
            <div className="step">

              <img
                src={langkah1}
                alt="Langkah 1"
              />

              <div className="step-content">

                <span className="step-label step-one">
                  Langkah 1
                </span>

                <p>
                  Isilah jawaban dengan sejujur-jujurnya
                  yang terjadi
                </p>

              </div>

            </div>


            {/* Langkah 2 */}
            <div className="step">

              <img
                src={langkah2}
                alt="Langkah 2"
              />

              <div className="step-content">

                <span className="step-label step-two">
                  Langkah 2
                </span>

                <p>
                  Tidak ada jawaban yang benar dan salah
                  semua kembali ke diri sendiri
                </p>

              </div>

            </div>


            {/* Langkah 3 */}
            <div className="step">

              <img
                src={langkah3}
                alt="Langkah 3"
              />

              <div className="step-content">

                <span className="step-label step-three">
                  Langkah 3
                </span>

                <p>
                  Hasil akan keluar untuk menentukan
                  dirimu
                </p>

              </div>

            </div>

          </div>


          {/* Bunga */}
          <img
            src={bunga}
            alt=""
            className="flower"
          />

        </div>
      );
    }


    /* ==================================================
       HALAMAN 3 - 25 PERTANYAAN
    ================================================== */

    if (page === 3) {
      return (
        <div className="quiz-page">

          {/* Navbar */}
          <Navbar {...nav} />

          {/* Gelembung dekoratif */}
          <span className="bubble b1" />
          <span className="bubble b2" />
          <span className="bubble b3" />
          <span className="bubble b4" />

          <div className="quiz-scroll">
            <Kuesioner
              answers={answers}
              setAnswers={setAnswers}
              qPage={qPage}
              setQPage={setQPage}
              onBack={() => goTo(2)}
              onFinish={() => {
                setSkor(hitungSkor(answers));
                goTo(4);
              }}
            />
          </div>

        </div>
      );
    }


    /* ==================================================
       HALAMAN 4 - HASIL
    ================================================== */

    return (
      <Hasil
        skor={skor}
        answers={answers}
        nav={nav}
        onReview={() => goTo(3)}
        onReset={() =>
          goTo(1, () => {
            setAnswers({});
            setQPage(0);
            setSkor(null);
          })
        }
      />
    );
  };


  return (
    <>
      <div
        className={`page-shell ${leaving ? "leaving" : "entering"}`}
        key={page}
      >
        {renderPage()}
      </div>

      {/* Popup Tentang / Panduan */}
      {info && (
        <InfoModal
          key={info}
          type={info}
          onClose={() => setInfo(null)}
        />
      )}
    </>
  );
}

export default App;
