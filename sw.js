/* ─────────────────────────────────────────
   Cancer팀 업무 허브 — Service Worker
   캐시 버전: v1.0.0
───────────────────────────────────────── */

const CACHE_NAME = 'cancer-hub-v1';

// 오프라인에서도 작동할 파일 목록
const PRECACHE = [
  './index.html',
  './notice_editor.html',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap'
];

// ── 설치: 핵심 파일 사전 캐싱 ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE).catch(err => {
        console.warn('[SW] 일부 파일 캐시 실패:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ── 활성화: 오래된 캐시 정리 ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── 네트워크 요청 가로채기 ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // GitHub 원격 JSON(공지사항, 생산일정)은 항상 네트워크 우선
  if (url.hostname === 'gimcimmim-cpu.github.io') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Google Fonts는 네트워크 우선, 실패 시 캐시
  if (url.hostname.includes('fonts.')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 로컬 파일: 캐시 우선, 없으면 네트워크 후 캐시 저장
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return res;
      });
    })
  );
});
