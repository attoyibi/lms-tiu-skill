const fs = require('fs');

const sqlStatements = [];

// Helper to escape single quotes
const esc = (str) => str.replace(/'/g, "''");

const verbalQuestions = [
    { text: "SINONIM: ABRASI = ...", options: ["A. Pengikisan", "B. Pembentukan", "C. Pengendapan", "D. Pelapukan", "E. Pemotongan"], correct: 0, exp: "Abrasi berarti pengikisan." },
    { text: "SINONIM: ADAGIUM = ...", options: ["A. Pepatah", "B. Janji", "C. Syarat", "D. Rumus", "E. Keputusan"], correct: 0, exp: "Adagium adalah pepatah atau peribahasa." },
    { text: "SINONIM: AFIRMASI = ...", options: ["A. Penolakan", "B. Penegasan", "C. Pendekatan", "D. Penilaian", "E. Pengecualian"], correct: 1, exp: "Afirmasi berarti penetapan atau penegasan." },
    { text: "SINONIM: AKSELERASI = ...", options: ["A. Perlambatan", "B. Percepatan", "C. Penundaan", "D. Penghentian", "E. Perpanjangan"], correct: 1, exp: "Akselerasi adalah percepatan." },
    { text: "SINONIM: ANOMALI = ...", options: ["A. Kenormalan", "B. Keabnormalan", "C. Keteraturan", "D. Kesamaan", "E. Kepastian"], correct: 1, exp: "Anomali adalah penyimpangan dari yang normal." },
    { text: "ANTONIM: ANTIPATI >< ...", options: ["A. Simpati", "B. Benci", "C. Acuh", "D. Marah", "E. Sedih"], correct: 0, exp: "Antipati adalah rasa penolakan. Antonimnya adalah simpati." },
    { text: "ANTONIM: APATIS >< ...", options: ["A. Acuh", "B. Pasif", "C. Aktif/Peduli", "D. Diam", "E. Kejam"], correct: 2, exp: "Apatis berarti tidak peduli. Antonimnya peduli." },
    { text: "ANTONIM: ASLI >< ...", options: ["A. Tulen", "B. Murni", "C. Palsu", "D. Nyata", "E. Benar"], correct: 2, exp: "Asli lawannya palsu." },
    { text: "ANTONIM: BUKIT >< ...", options: ["A. Gunung", "B. Lembah", "C. Laut", "D. Sungai", "E. Danau"], correct: 1, exp: "Bukit (tinggi) lawannya lembah (rendah)." },
    { text: "ANTONIM: CANGGIH >< ...", options: ["A. Modern", "B. Kuno", "C. Baru", "D. Hebat", "E. Maju"], correct: 1, exp: "Canggih lawannya kuno/sederhana." },
    { text: "ANALOGI: BURUNG : TERBANG = IKAN : ...", options: ["A. Berenang", "B. Berjalan", "C. Merayap", "D. Melompat", "E. Menyelam"], correct: 0, exp: "Burung bergerak dengan terbang, Ikan bergerak dengan berenang." },
    { text: "ANALOGI: GURU : SEKOLAH = DOKTER : ...", options: ["A. Pasien", "B. Obat", "C. Rumah Sakit", "D. Apotek", "E. Suntikan"], correct: 2, exp: "Guru bekerja di Sekolah, Dokter bekerja di Rumah Sakit." },
    { text: "ANALOGI: PISAU : MEMOTONG = SAPU : ...", options: ["A. Mengepel", "B. Menyapu", "C. Membersihkan", "D. Membuang", "E. Menggosok"], correct: 1, exp: "Pisau alat untuk memotong, Sapu alat untuk menyapu." },
    { text: "ANALOGI: BUKU : DIBACA = LAGU : ...", options: ["A. Dinyanyikan", "B. Didengar", "C. Ditulis", "D. Dilihat", "E. Dirasakan"], correct: 1, exp: "Buku dinikmati dengan dibaca, Lagu dinikmati dengan didengar." },
    { text: "ANALOGI: SIANG : TERANG = MALAM : ...", options: ["A. Gelap", "B. Bintang", "C. Bulan", "D. Tidur", "E. Hitam"], correct: 0, exp: "Siang kondisinya terang, Malam kondisinya gelap." }
];

// Replicate to get 30 verbal questions
for(let i=15; i<30; i++) {
    verbalQuestions.push({
        text: `SINONIM: KATA${i} = ...`,
        options: ["A. A", "B. B", "C. Benar", "D. D", "E. E"],
        correct: 2,
        exp: `Penjelasan untuk KATA${i}`
    });
}

const numQuestions = [];
for (let i = 0; i < 30; i++) {
    let type = i % 3;
    if (type === 0) {
        // Deret Angka
        let start = Math.floor(Math.random() * 10) + 1;
        let diff = Math.floor(Math.random() * 5) + 2;
        let seq = [start, start + diff, start + 2 * diff, start + 3 * diff, start + 4 * diff];
        let next = start + 5 * diff;
        numQuestions.push({
            text: `Deret angka: ${seq.join(', ')}, ... Angka selanjutnya adalah?`,
            options: [`A. ${next - 1}`, `B. ${next}`, `C. ${next + 1}`, `D. ${next + diff}`, `E. ${next + 2}`],
            correct: 1,
            exp: `Polanya adalah ditambah ${diff}. ${seq[4]} + ${diff} = ${next}.`
        });
    } else if (type === 1) {
        // Persentase
        let base = (Math.floor(Math.random() * 10) + 2) * 10;
        let pct = (Math.floor(Math.random() * 4) + 1) * 10; // 10,20,30,40%
        let res = (base * pct) / 100;
        numQuestions.push({
            text: `Berapakah ${pct}% dari ${base}?`,
            options: [`A. ${res - 5}`, `B. ${res + 5}`, `C. ${res}`, `D. ${res * 2}`, `E. ${res - 2}`],
            correct: 2,
            exp: `${pct}% dari ${base} adalah (${pct}/100) * ${base} = ${res}.`
        });
    } else {
        // Hitung Cepat
        let a = Math.floor(Math.random() * 20) + 10;
        let b = Math.floor(Math.random() * 10) + 5;
        let res = a * b;
        numQuestions.push({
            text: `Hasil dari ${a} x ${b} adalah?`,
            options: [`A. ${res - 10}`, `B. ${res}`, `C. ${res + 10}`, `D. ${res + 5}`, `E. ${res - 5}`],
            correct: 1,
            exp: `${a} x ${b} = ${res}.`
        });
    }
}

const figuralQuestions = [];
for (let i = 0; i < 30; i++) {
    figuralQuestions.push({
        text: `Tes Figural ${i + 1}: Jika pola berputar 90 derajat searah jarum jam, maka gambar selanjutnya akan menunjukkan... (Imajinasikan)`,
        options: ["A. Pola mengarah ke atas", "B. Pola mengarah ke kanan", "C. Pola mengarah ke bawah", "D. Pola mengarah ke kiri", "E. Pola tidak berubah"],
        correct: 1,
        exp: "Putaran 90 derajat searah jarum jam akan mengubah arah dari atas (awal) menjadi ke kanan."
    });
}

function generateSQL(category, dataList) {
    dataList.forEach(q => {
        let opts = JSON.stringify(q.options);
        sqlStatements.push(`INSERT INTO public.questions (category, difficulty, question_text, options, correct_option, explanation) VALUES ('${category}', 'Beginner', '${esc(q.text)}', '${esc(opts)}', ${q.correct}, '${esc(q.exp)}');`);
    });
}

generateSQL('Verbal Reasoning', verbalQuestions);
generateSQL('Numerical Reasoning', numQuestions);
generateSQL('Figural Reasoning', figuralQuestions);

fs.writeFileSync('seed_bank_soal.sql', sqlStatements.join('\n'));
console.log('SQL generated successfully.');
