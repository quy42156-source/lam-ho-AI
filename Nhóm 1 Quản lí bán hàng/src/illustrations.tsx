import { useState } from "react";
import { Package } from "lucide-react";

/* ─── Hình minh họa SVG cho từng loại sản phẩm ─── */
export type ProductKind = "phone" | "laptop" | "tablet" | "earbuds" | "watch" | "headphones" | "camera";

const palettes: Record<ProductKind, [string, string]> = {
  phone: ["#fbbf24", "#f59e0b"],
  laptop: ["#1aadc4", "#0e8b9e"],
  tablet: ["#a78bfa", "#7c3aed"],
  earbuds: ["#f472b6", "#db2777"],
  watch: ["#34d399", "#059669"],
  headphones: ["#fb923c", "#ea580c"],
  camera: ["#a78bfa", "#7c3aed"],
};

export const productKind: Record<string, ProductKind> = {
  SP001: "phone",
  SP002: "laptop",
  SP003: "phone",
  SP004: "tablet",
  SP005: "earbuds",
  SP006: "watch",
  SP007: "headphones",
};

function Device({ kind }: { kind: ProductKind }) {
  switch (kind) {
    case "phone":
      return (
        <g>
          <rect x="70" y="30" width="60" height="120" rx="12" fill="#0b1f24" stroke="rgba(255,255,255,.35)" strokeWidth="2" />
          <rect x="75" y="38" width="50" height="104" rx="8" fill={`url(#screen-${kind})`} />
          <rect x="90" y="41" width="20" height="5" rx="2.5" fill="#0b1f24" />
          <circle cx="100" cy="90" r="16" fill="rgba(255,255,255,.25)" />
          <rect x="82" y="118" width="36" height="6" rx="3" fill="rgba(255,255,255,.35)" />
        </g>
      );
    case "laptop":
      return (
        <g>
          <rect x="45" y="45" width="110" height="72" rx="6" fill="#0b1f24" stroke="rgba(255,255,255,.35)" strokeWidth="2" />
          <rect x="51" y="51" width="98" height="60" rx="3" fill={`url(#screen-${kind})`} />
          <path d="M30 122 H170 L162 134 H38 Z" fill="#cbd5e1" />
          <rect x="88" y="124" width="24" height="3" rx="1.5" fill="#94a3b8" />
          <circle cx="100" cy="81" r="12" fill="rgba(255,255,255,.25)" />
        </g>
      );
    case "tablet":
      return (
        <g>
          <rect x="45" y="35" width="110" height="110" rx="12" fill="#0b1f24" stroke="rgba(255,255,255,.35)" strokeWidth="2" />
          <rect x="52" y="42" width="96" height="96" rx="7" fill={`url(#screen-${kind})`} />
          <rect x="62" y="60" width="50" height="8" rx="4" fill="rgba(255,255,255,.35)" />
          <rect x="62" y="76" width="76" height="6" rx="3" fill="rgba(255,255,255,.22)" />
          <rect x="62" y="88" width="66" height="6" rx="3" fill="rgba(255,255,255,.22)" />
          <circle cx="120" cy="118" r="10" fill="rgba(255,255,255,.25)" />
        </g>
      );
    case "earbuds":
      return (
        <g>
          <rect x="52" y="78" width="96" height="62" rx="22" fill="#f8fafc" />
          <path d="M52 100 H148" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="100" cy="108" r="4" fill="#94a3b8" />
          <g transform="rotate(-12 78 55)">
            <rect x="70" y="24" width="16" height="44" rx="8" fill="#f8fafc" />
            <circle cx="78" cy="30" r="12" fill="#fff" />
          </g>
          <g transform="rotate(12 122 55)">
            <rect x="114" y="24" width="16" height="44" rx="8" fill="#f8fafc" />
            <circle cx="122" cy="30" r="12" fill="#fff" />
          </g>
        </g>
      );
    case "watch":
      return (
        <g>
          <rect x="82" y="14" width="36" height="34" rx="8" fill="#334155" />
          <rect x="82" y="132" width="36" height="34" rx="8" fill="#334155" />
          <rect x="62" y="44" width="76" height="92" rx="22" fill="#0b1f24" stroke="rgba(255,255,255,.4)" strokeWidth="2.5" />
          <rect x="69" y="51" width="62" height="78" rx="16" fill={`url(#screen-${kind})`} />
          <circle cx="100" cy="90" r="20" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="3" />
          <path d="M100 90 V76 M100 90 L110 96" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <rect x="138" y="72" width="6" height="16" rx="3" fill="#f59e0b" />
        </g>
      );
    case "headphones":
      return (
        <g>
          <path d="M55 105 V90 a45 45 0 0 1 90 0 V105" fill="none" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
          <rect x="42" y="98" width="28" height="48" rx="12" fill="#1e293b" stroke="rgba(255,255,255,.35)" strokeWidth="2" />
          <rect x="130" y="98" width="28" height="48" rx="12" fill="#1e293b" stroke="rgba(255,255,255,.35)" strokeWidth="2" />
          <rect x="48" y="108" width="16" height="28" rx="8" fill={`url(#screen-${kind})`} />
          <rect x="136" y="108" width="16" height="28" rx="8" fill={`url(#screen-${kind})`} />
        </g>
      );
    case "camera":
      return (
        <g>
          <rect x="38" y="58" width="124" height="82" rx="14" fill="#111827" stroke="rgba(255,255,255,.35)" strokeWidth="2" />
          <path d="M65 58 l10-16 h50 l10 16" fill="#1f2937" />
          <circle cx="100" cy="99" r="29" fill="#0b1f24" stroke="#e5e7eb" strokeWidth="4" />
          <circle cx="100" cy="99" r="18" fill={`url(#screen-${kind})`} opacity=".9" />
          <circle cx="100" cy="99" r="7" fill="#fff" opacity=".45" />
          <rect x="137" y="68" width="12" height="8" rx="3" fill="#fbbf24" />
        </g>
      );
  }
}

export function ProductArt({ kind, className = "" }: { kind: ProductKind; className?: string }) {
  const [a, b] = palettes[kind];
  const id = `g-${kind}`;
  return (
    <svg viewBox="0 0 200 180" className={className} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={kind}>
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} stopOpacity=".28" />
          <stop offset="1" stopColor={b} stopOpacity=".08" />
        </linearGradient>
        <linearGradient id={`screen-${kind}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <rect width="200" height="180" fill={`url(#bg-${id})`} />
      <circle cx="30" cy="30" r="40" fill={a} opacity=".12" />
      <circle cx="175" cy="150" r="50" fill={b} opacity=".12" />
      <ellipse cx="100" cy="164" rx="52" ry="7" fill="#000" opacity=".25" />
      <Device kind={kind} />
    </svg>
  );
}

/* Ảnh sản phẩm: ưu tiên ảnh thật (src), nếu lỗi/không tải được thì dùng hình minh họa */
export function ProductImage({ id, src, category = "", className = "" }: { id: string; src?: string; category?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const kind = productKind[id];
  const fallback = kind ? (
    <ProductArt kind={kind} className={className} />
  ) : (
    <div className={`${className} bg-gradient-to-br from-[#0e8b9e]/30 via-[#064d58] to-[#02171a] flex flex-col items-center justify-center gap-2`}>
      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        <Package size={42} className="text-cyan-300" />
      </div>
      <span className="text-cyan-100/70 text-xs font-medium">Thiết bị điện tử</span>
    </div>
  );
  if (!src || failed) return fallback;
  return (
    <div className={`${className} relative overflow-hidden bg-white/5`}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-white/5" />}
      <img
        src={src}
        alt=""
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

/* ─── Banner trang chủ khách hàng ─── */
export function HeroArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 240" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="hg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="hg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1aadc4" />
          <stop offset="1" stopColor="#064d58" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="120" r="100" fill="#fbbf24" opacity=".12" />
      <circle cx="200" cy="120" r="70" fill="none" stroke="#fbbf24" strokeOpacity=".25" strokeDasharray="4 6" />
      {/* laptop */}
      <rect x="80" y="90" width="160" height="100" rx="8" fill="#03333a" stroke="rgba(255,255,255,.4)" strokeWidth="2" />
      <rect x="88" y="98" width="144" height="84" rx="4" fill="url(#hg2)" />
      <polyline points="98,165 125,140 150,152 180,120 218,108" fill="none" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M62 196 H258 L248 210 H72 Z" fill="#cbd5e1" />
      {/* phone */}
      <rect x="252" y="110" width="52" height="98" rx="10" fill="#03333a" stroke="rgba(255,255,255,.4)" strokeWidth="2" />
      <rect x="257" y="117" width="42" height="84" rx="6" fill="url(#hg1)" />
      <circle cx="278" cy="159" r="12" fill="rgba(255,255,255,.35)" />
      {/* shopping bag */}
      <path d="M20 130 h64 l-6 64 a6 6 0 0 1 -6 6 h-40 a6 6 0 0 1 -6 -6 z" fill="url(#hg1)" />
      <path d="M38 130 v-10 a14 14 0 0 1 28 0 v10" fill="none" stroke="#fde68a" strokeWidth="5" strokeLinecap="round" />
      {/* sparkles */}
      <g fill="#fde68a">
        <path d="M300 40 l4 12 l12 4 l-12 4 l-4 12 l-4 -12 l-12 -4 l12 -4 z" />
        <path d="M60 50 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 z" opacity=".7" />
        <path d="M170 24 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 z" opacity=".6" />
      </g>
    </svg>
  );
}

/* ─── Minh họa phần bên trái trang đăng nhập ─── */
export function LoginArt({ className = "" }: { className?: string }) {
  const bars = [40, 62, 50, 84, 96, 78, 112];
  return (
    <svg viewBox="0 0 400 220" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity=".5" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="380" height="200" rx="18" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.15)" />
      <circle cx="34" cy="30" r="4" fill="#f87171" />
      <circle cx="50" cy="30" r="4" fill="#fbbf24" />
      <circle cx="66" cy="30" r="4" fill="#34d399" />
      {bars.map((h, i) => (
        <rect key={i} x={36 + i * 30} y={190 - h} width="20" height={h} rx="5" fill="url(#lg1)" />
      ))}
      <polyline points="46,130 76,112 106,120 136,84 166,70 196,80 226,50" fill="none" stroke="#3bddf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="226" cy="50" r="5" fill="#3bddf6" />
      {/* AI card */}
      <rect x="266" y="52" width="108" height="72" rx="12" fill="#064d58" stroke="rgba(251,191,36,.4)" />
      <circle cx="288" cy="76" r="10" fill="#fbbf24" />
      <path d="M284 76 h8 M288 72 v8" stroke="#03333a" strokeWidth="2" strokeLinecap="round" />
      <rect x="304" y="70" width="58" height="5" rx="2.5" fill="rgba(255,255,255,.55)" />
      <rect x="304" y="80" width="40" height="5" rx="2.5" fill="rgba(255,255,255,.3)" />
      <rect x="278" y="98" width="84" height="5" rx="2.5" fill="rgba(255,255,255,.25)" />
      <rect x="278" y="108" width="62" height="5" rx="2.5" fill="rgba(255,255,255,.25)" />
    </svg>
  );
}

/* ─── Ảnh nền danh mục ─── */
export function CategoryArt({ name, color, className = "" }: { name: string; color: string; className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="80" height="80" rx="16" fill={color} opacity=".18" />
      {name === "Điện tử" && (
        <g fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="24" y="16" width="32" height="48" rx="6" />
          <line x1="35" y1="56" x2="45" y2="56" />
        </g>
      )}
      {name === "Thời trang" && (
        <path d="M28 18 L16 28 L24 36 L28 33 V62 H52 V33 L56 36 L64 28 L52 18 C50 24 30 24 28 18 Z" fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round" />
      )}
      {name === "Gia dụng" && (
        <g fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 42 L40 20 L66 42" />
          <path d="M22 38 V62 H58 V38" />
          <rect x="34" y="46" width="12" height="16" />
        </g>
      )}
      {name === "Thực phẩm" && (
        <g fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 36 H60 C60 52 52 62 40 62 C28 62 20 52 20 36 Z" />
          <path d="M32 26 C32 20 38 20 38 14 M44 26 C44 20 50 20 50 14" />
        </g>
      )}
      {!["Điện tử", "Thời trang", "Gia dụng", "Thực phẩm"].includes(name) && (
        <g fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M40 16 L62 28 V52 L40 64 L18 52 V28 Z" />
          <path d="M18 28 L40 40 L62 28 M40 40 V64" />
        </g>
      )}
    </svg>
  );
}
