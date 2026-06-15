# 감정 노트

감정 일기, 감사노트, 동기부여 문장 카드를 기록하는 Next.js 웹앱입니다. Vercel 배포와 Supabase Auth/Postgres를 기준으로 구성되어 있습니다.

## 기술 스택

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth + Postgres + RLS
- PWA manifest + service worker

## 로컬 실행

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

npm을 사용하는 환경이라면 `npm install`, `npm run dev`로 실행할 수 있습니다.

## 환경변수

`.env.local`에 다음 값을 설정합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Supabase 설정

1. Supabase 프로젝트를 생성합니다.
2. `supabase/migrations/0001_init.sql`을 SQL Editor에서 실행하거나 Supabase CLI로 적용합니다.
3. Authentication > Providers에서 Google과 Kakao를 활성화합니다.
4. OAuth Redirect URL에 다음을 등록합니다.
   - 로컬: `http://localhost:3000/auth/callback`
   - 운영: `https://배포도메인/auth/callback`

## 주요 화면

- `/login`: Google/Kakao 소셜 로그인
- `/home`: 오늘 기록 요약
- `/journal`: 감정 일기 작성/수정/삭제
- `/gratitude`: 감사노트 작성/수정/삭제
- `/cards`: 동기부여 카드 작성/즐겨찾기/랜덤 보기
- `/settings`: 프로필과 로그아웃

## 검증

```bash
pnpm lint
pnpm build
```
