# Vercel + Supabase 배포 가이드

## 1. Supabase

1. 새 Supabase 프로젝트를 만듭니다.
2. SQL Editor에서 `supabase/migrations/0001_init.sql`을 실행합니다.
3. Project Settings > API에서 Project URL과 anon public key를 복사합니다.
4. Authentication > URL Configuration에서 Site URL을 운영 도메인으로 설정합니다.
5. Redirect URLs에 다음 값을 추가합니다.
   - `http://localhost:3000/auth/callback`
   - `https://배포도메인/auth/callback`

## 2. OAuth Provider

### Google

- Google Cloud Console에서 Web OAuth Client를 생성합니다.
- Authorized JavaScript origins에 로컬/운영 origin을 추가합니다.
- Authorized redirect URIs에 Supabase가 제공하는 callback URL을 추가합니다.
- Supabase Authentication > Providers > Google에 Client ID와 Secret을 저장합니다.

### Kakao

- Kakao Developers에서 애플리케이션을 생성하고 Kakao Login을 활성화합니다.
- Redirect URI에 Supabase가 제공하는 callback URL을 추가합니다.
- Supabase Authentication > Providers > Kakao에 REST API Key와 Client Secret을 저장합니다.

## 3. Vercel

1. GitHub 저장소를 Vercel 프로젝트로 가져옵니다.
2. Framework Preset은 Next.js로 자동 감지됩니다.
3. Environment Variables에 다음을 등록합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=https://배포도메인
```

4. 배포 후 Production 도메인을 Supabase Redirect URLs에 다시 반영합니다.
5. Vercel 배포 로그에서 `pnpm build`가 성공하는지 확인합니다.

## 4. 포함하지 않는 서비스

- 이메일 발송 서비스는 연결하지 않습니다.
- AI API 키는 사용하지 않습니다.
- 푸시 알림 서비스는 사용하지 않습니다.
