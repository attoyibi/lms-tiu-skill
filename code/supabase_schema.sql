-- ==============================================================================
-- 1. PROFILES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);


-- ==============================================================================
-- 2. QUESTIONS TABLE (Bank Soal TIU)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL, -- e.g., 'Verbal Reasoning', 'Numerical Reasoning', 'Figural Reasoning'
  difficulty TEXT NOT NULL, -- 'Beginner', 'Intermediate', 'Advanced', 'Expert'
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- e.g., ["A. ...", "B. ...", "C. ...", "D. ...", "E. ..."]
  correct_option INTEGER NOT NULL, -- Index of correct option (0-4)
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Soal bisa dibaca oleh siapa saja yang sudah login
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view questions." ON public.questions FOR SELECT USING (auth.uid() IS NOT NULL);


-- ==============================================================================
-- 3. PRACTICE SESSIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.practice_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  difficulty TEXT,
  status TEXT DEFAULT 'ongoing',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0
);

ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own practice sessions." ON public.practice_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own practice sessions." ON public.practice_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own practice sessions." ON public.practice_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own practice sessions." ON public.practice_sessions FOR DELETE USING (auth.uid() = user_id);


-- ==============================================================================
-- 4. SESSION ANSWERS TABLE (Jawaban per sesi)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.session_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.practice_sessions(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  user_answer_index INTEGER, -- Null jika tidak dijawab
  is_correct BOOLEAN DEFAULT FALSE,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.session_answers ENABLE ROW LEVEL SECURITY;
-- RLS sedikit lebih kompleks karena join, tapi cara sederhana: buka untuk user_id pembuat session.
CREATE POLICY "Users can access answers for their sessions." 
ON public.session_answers 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.practice_sessions 
    WHERE id = session_answers.session_id AND user_id = auth.uid()
  )
);


-- ==============================================================================
-- 5. SEEDING BANK SOAL (DUMMY DATA)
-- ==============================================================================
-- Kita langsung isi beberapa soal agar fitur kuis nanti bisa langsung digunakan.
INSERT INTO public.questions (category, difficulty, question_text, options, correct_option, explanation)
VALUES 
  -- Verbal Reasoning
  ('Verbal Reasoning', 'Beginner', 'SINONIM: EVOKASI = ...', '["A. Penilaian", "B. Penggugah Rasa", "C. Pengungsian", "D. Izin Menetap", "E. Provokasi"]', 1, 'Evokasi memiliki arti daya penggugah rasa.'),
  ('Verbal Reasoning', 'Intermediate', 'ANTONIM: PROMINEN >< ...', '["A. Biasa", "B. Konsisten", "C. Perintis", "D. Pelopor", "E. Terkemuka"]', 0, 'Prominen berarti terkemuka (menonjol). Antonimnya adalah biasa.'),
  ('Verbal Reasoning', 'Advanced', 'ANALOGI: MATAHARI : BUMI = ...', '["A. Bumi : Bulan", "B. Planet : Tata Surya", "C. Bulan : Bintang", "D. Bumi : Matahari", "E. Komet : Meteor"]', 0, 'Bumi mengelilingi Matahari, seperti Bulan mengelilingi Bumi.'),
  
  -- Numerical Reasoning
  ('Numerical Reasoning', 'Beginner', 'Jika x = 15 dan y = 45, berapakah persentase x dari y?', '["A. 25%", "B. 30%", "C. 33.33%", "D. 45%", "E. 50%"]', 2, 'Persentase = (15 / 45) * 100% = 33.33%'),
  ('Numerical Reasoning', 'Intermediate', 'Sebuah kereta melaju dengan kecepatan 72 km/jam. Jarak yang ditempuh dalam 10 detik adalah...', '["A. 100 m", "B. 150 m", "C. 200 m", "D. 250 m", "E. 300 m"]', 2, '72 km/jam = 72000 m / 3600 detik = 20 m/detik. Jarak dalam 10 detik = 20 * 10 = 200 meter.'),
  ('Numerical Reasoning', 'Advanced', 'Deret angka: 2, 6, 12, 20, 30, ... Angka selanjutnya adalah?', '["A. 36", "B. 40", "C. 42", "D. 48", "E. 50"]', 2, 'Polanya adalah n*(n+1) atau selisih +4, +6, +8, +10, +12. Selanjutnya 30 + 12 = 42.'),

  -- Figural Reasoning
  ('Figural Reasoning', 'Beginner', 'Carilah gambar yang berbeda dari kelompoknya (Rotasi 90 derajat).', '["A. Gambar 1", "B. Gambar 2", "C. Gambar 3", "D. Gambar 4", "E. Gambar 5"]', 3, 'Gambar 4 adalah pencerminan, bukan rotasi dari gambar lainnya.'),
  ('Figural Reasoning', 'Intermediate', 'Jika bentuk segi empat diputar 180 derajat dan warnanya dibalik, hasilnya adalah...', '["A. Opsi A", "B. Opsi B", "C. Opsi C", "D. Opsi D", "E. Opsi E"]', 1, 'Pembalikan warna membuat area hitam menjadi putih, dan putaran 180 mempertahankan posisi asimetris.'),
  ('Figural Reasoning', 'Advanced', 'Lengkapi pola matriks 3x3 berikut: Baris pertama memiliki 1 titik, 2 titik, 3 titik...', '["A. 4 titik", "B. 5 titik", "C. 6 titik", "D. 7 titik", "E. 8 titik"]', 2, 'Polanya adalah penambahan progresif baik secara vertikal maupun horizontal.');


-- ==============================================================================
-- 6. SEEDING DUMMY SESSIONS (Opsional, untuk test UI Dashboard/Analysis)
-- PENTING: Jalankan blok DO $$ di bawah ini HANYA JIKA Anda sudah memiliki 
-- akun terdaftar. Ganti 'UUID-ANDA' dengan UUID dari akun Anda.
-- ==============================================================================

/*
DO $$
DECLARE
  my_user_id UUID := 'UUID-ANDA'; 
  session1_id UUID;
  session2_id UUID;
BEGIN
  -- 1. Insert sesi Verbal (Bagus)
  INSERT INTO public.practice_sessions (user_id, title, category, difficulty, status, total_questions, correct_answers, duration_seconds, started_at)
  VALUES (my_user_id, 'Verbal Reasoning - Beginner', 'Verbal Reasoning', 'Beginner', 'completed', 30, 25, 900, now() - interval '2 days')
  RETURNING id INTO session1_id;

  -- 2. Insert sesi Numerical (Kurang Bagus)
  INSERT INTO public.practice_sessions (user_id, title, category, difficulty, status, total_questions, correct_answers, duration_seconds, started_at)
  VALUES (my_user_id, 'Numerical Reasoning - Intermediate', 'Numerical Reasoning', 'Intermediate', 'completed', 45, 20, 1800, now() - interval '1 day')
  RETURNING id INTO session2_id;

  -- (Opsional) Jika ingin memasukkan jawaban riwayat per soal, bisa insert ke session_answers menggunakan session1_id / session2_id
END $$;
*/
