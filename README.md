# LexiIELTS — IELTS Vocabulary App

Ứng dụng học từ vựng IELTS với từ điển chi tiết, audio phát âm, câu ví dụ, từ đồng nghĩa, và mini quiz.

## Tính năng

- 🔍 **Từ điển thông minh** — Tra bất kỳ từ tiếng Anh nào, dữ liệu từ Free Dictionary API
- 🔊 **Audio phát âm** — Nghe phát âm chuẩn (US), nghe câu ví dụ từng định nghĩa
- 📖 **Nội dung phong phú** — Nghĩa, phiên âm IPA, từ đồng nghĩa, trái nghĩa, ví dụ thực tế
- 🔖 **Lưu từ yêu thích** — Bookmark từ, xem lại trong sidebar
- 🧠 **Mini Quiz** — Luyện tập định nghĩa sau khi tra từ
- 📚 **60 từ IELTS** — Danh sách từ theo 6 chủ đề phổ biến trong IELTS
- 💡 **Word of the Day** — Từ học hàng ngày

## Deploy lên Vercel (miễn phí)

### Bước 1 — Cài đặt
```bash
npm install
```

### Bước 2 — Chạy local để test
```bash
npm run dev
```
Mở http://localhost:5173

### Bước 3 — Deploy lên Vercel
```bash
# Cài Vercel CLI
npm i -g vercel

# Deploy
vercel

# Làm theo hướng dẫn, chọn:
# - Framework: Vite
# - Build command: npm run build
# - Output dir: dist
```

Hoặc kết nối GitHub repo trực tiếp tại vercel.com — push code → tự động deploy.

## Deploy lên Netlify (miễn phí)

```bash
npm run build
# Upload thư mục dist/ lên netlify.com/drop
```

## Tech stack

- **React 18** + Vite
- **Framer Motion** (animations)
- **Lucide React** (icons)
- **Free Dictionary API** (https://dictionaryapi.dev) — hoàn toàn miễn phí
- **Web Speech API** — fallback TTS khi không có audio file

## Mở rộng (Phase 2)

Thêm Supabase để sync cross-device:
```bash
npm install @supabase/supabase-js
```

Thêm AI Chat Partner (cần Anthropic API key):
```bash
npm install @anthropic-ai/sdk
```

## Cấu trúc thư mục

```
src/
  components/
    SearchBar.jsx    — Ô tìm kiếm + gợi ý autocomplete
    WordCard.jsx     — Card chi tiết từ (định nghĩa, audio, synonym...)
    Sidebar.jsx      — Topic browser + saved words
    QuizPanel.jsx    — Mini quiz luyện tập
    WordOfDay.jsx    — Từ của ngày
  hooks/
    useWordData.js   — Fetch & cache dữ liệu từ API
    useSavedWords.js — Lưu từ vào localStorage
  utils/
    audio.js         — Phát audio & Text-to-Speech
  data/
    wordList.js      — 60 từ IELTS + danh sách chủ đề
```
