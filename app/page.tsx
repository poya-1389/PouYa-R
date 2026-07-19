'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from 'framer-motion';
import { Inter, Space_Grotesk, Vazirmatn } from 'next/font/google';
import type { LucideIcon } from 'lucide-react';
import {
  Send,
  Github,
  Instagram,
  MessageCircle,
  Mail,
  Globe,
  ExternalLink,
  Eye,
  EyeOff,
  Languages,
  MapPin,
  ArrowUpRight,
  Sparkles,
  Menu,
  X,
  Boxes,
  Radio,
  Gem,
} from 'lucide-react';

/* ============================================================
   FONTS
   ============================================================ */
const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const vazir = Vazirmatn({ subsets: ['arabic'], variable: '--font-fa', display: 'swap' });

/* ============================================================
   PLACEHOLDER DATA — edit ONLY the values below.
   No personal copy is generated anywhere in this file.
   ============================================================ */

// درباره خودت اینجا بنویس (بعداً پر کن)
const about = 'There is nothing about me for now!';

const projects = [
  { title: 'NoVA SeLF', description: 'NovaSelf یک سلف‌بات اختصاصی است که با اتصال به حساب تلگرام شما، مجموعه‌ای از قابلیت‌های خودکار و شخصی‌سازی را در اختیارتان می‌گذارد؛ همه چیز از طریق همین پنل قابل مدیریت است.', url: 'https://t.me/NovaSelfManagerBot', image: '' },
  { title: 'NoVA PaNeL', description: 'NivaPaNel درحال حاضر در دسترس نیست اما به زودی در دسترس عموم قرار می گیرد', url: 'https://t.me/NovaConfigService', image: '' },
  { title: 'EnlargeBoobs', description: 'EnlargeBoobs درحال حاضر در دسترس است من درحال آپدیت این ربات سرگرمی هستم ', url: 'http://t.me/Enlargeboobsbot', image: '' },
];

const socials = {
  telegram: 'https://t.me/saypouya',
  github: 'https://Soon',
  instagram: 'https://Soon',
  discord: 'https://Soon',
  email: 'email@gmail.com',
  website: 'https://pouya-nu.vercel.app',
};

const LOCATION = 'Iran, Rasht'; // شناسه مکان — فقط همینجا نمایش داده می‌شود
const LOCATION_FA = 'ایران، رشت';

/* ------------------------------------------------------------
   🔁 ICON SLOTS — Base44 replacement guide
   Every icon below comes from Lucide as a placeholder.
   To swap to Base44 icons, replace ONLY the import + the value
   in these two maps. Nothing else in the file needs to change,
   every component consumes icons through these maps/props.
   ------------------------------------------------------------ */
const projectIconMap: LucideIcon[] = [
  Boxes,  // 🔁 Base44 icon → NoVA SeLF
  Radio,  // 🔁 Base44 icon → NoVA PaNeL
  Gem,    // 🔁 Base44 icon → EnlargeBoobs
];

const socialIconMap: Record<keyof typeof socials, LucideIcon> = {
  telegram: Send,        // 🔁 Base44 icon → Telegram
  github: Github,        // 🔁 Base44 icon → GitHub
  instagram: Instagram,  // 🔁 Base44 icon → Instagram
  discord: MessageCircle,// 🔁 Base44 icon → Discord
  email: Mail,           // 🔁 Base44 icon → Email
  website: Globe,        // 🔁 Base44 icon → Website
};

/* ============================================================
   I18N — interface chrome only (no personal content)
   ============================================================ */
type Lang = 'en' | 'fa';

const translations = {
  en: {
    nav: { home: 'Home', about: 'About', projects: 'Work', connect: 'Connect', contact: 'Contact' },
    hero: { tag: 'Available!' },
    about: { eyebrow: 'About', reveal: 'Reveal', hide: 'Hide', empty: 'Content pending — placeholder only' },
    projects: { eyebrow: 'Selected work', heading: 'Projects', empty: 'Details pending', view: 'View project', soon: 'Link pending' },
    connect: { eyebrow: 'Elsewhere', heading: 'Contact methods ', empty: 'Not linked yet' },
    contact: { eyebrow: 'Make a proposal', heading: 'Get in touch', cta: 'Send a message', empty: 'Address pending' },
    footer: { rights: 'All rights reserved.' },
  },
  fa: {
    nav: { home: 'خانه', about: 'درباره', projects: 'نمونه‌کار', connect: 'ارتباط', contact: 'تماس' },
    hero: { tag: 'در دسترس!' },
    about: { eyebrow: 'درباره', reveal: 'نمایش', hide: 'پنهان', empty: 'محتوا به‌زودی — فقط جایگزین' },
    projects: { eyebrow: 'نمونه‌کارهای منتخب', heading: 'پروژه‌ها', empty: 'توضیحات به‌زودی', view: 'مشاهده پروژه', soon: 'لینک به‌زودی' },
    connect: { eyebrow: 'شبکه‌ها', heading: 'راه های ارتباطی', empty: 'هنوز متصل نشده' },
    contact: { eyebrow: 'پیشنهاد بده', heading: 'در تماس باش', cta: 'ارسال پیام', empty: 'آدرس به‌زودی' },
    footer: { rights: 'تمامی حقوق محفوظ است.' },
  },
} as const;

type Dict = (typeof translations)[Lang];

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
  dir: 'ltr' | 'rtl';
}>({ lang: 'en', setLang: () => {}, t: translations.en, dir: 'ltr' });

function useLang() {
  return useContext(LangContext);
}

/* ============================================================
   PRIMITIVES
   ============================================================ */

// Scroll-triggered blur/fade reveal wrapper
function Reveal({
  children,
  delay = 0,
  y = 32,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Magnetic, ripple, glass button — the single interactive primitive reused everywhere
function GlassButton({
  children,
  icon: Icon,
  href,
  onClick,
  disabled = false,
  tone = 'default',
  className = '',
}: {
  children?: ReactNode;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  tone?: 'default' | 'gold';
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.15 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.15 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.22);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.22);
  }
  function handleLeave() {
    x.set(0);
    y.set(0);
  }
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (rect) {
      const id = Date.now() + Math.random();
      setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650);
    }
    onClick?.();
  }

  const toneClasses =
    tone === 'gold'
      ? 'border-[#D4AF37]/30 bg-gradient-to-b from-[#D4AF37]/15 to-[#8a6d1f]/10 hover:border-[#D4AF37]/60 hover:shadow-[0_0_36px_-6px_rgba(212,175,55,0.55)]'
      : 'border-white/10 bg-white/[0.045] hover:border-[#D4AF37]/35 hover:bg-white/[0.07] hover:shadow-[0_0_30px_-8px_rgba(212,175,55,0.35)]';

  const Tag = (href && !disabled ? motion.a : motion.div) as any;

  return (
    <motion.div ref={wrapRef} style={{ x: sx, y: sy }} className="inline-block">
      <Tag
        href={href && !disabled ? href : undefined}
        target={href && !disabled ? '_blank' : undefined}
        rel={href && !disabled ? 'noopener noreferrer' : undefined}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={handleClick}
        whileTap={disabled ? undefined : { scale: 0.94 }}
        aria-disabled={disabled}
        className={[
          'relative overflow-hidden select-none flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium backdrop-blur-xl transition-all duration-300',
          disabled ? 'cursor-not-allowed opacity-40 grayscale' : 'cursor-pointer',
          toneClasses,
          className,
        ].join(' ')}
      >
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/12 to-transparent opacity-60" />
        <span className="pointer-events-none absolute -inset-px rounded-[inherit] bg-[radial-gradient(120px_60px_at_50%_0%,rgba(255,255,255,0.18),transparent)]" />
        {Icon && (
          // 🔁 Base44 icon slot
          <Icon size={16} strokeWidth={1.75} className="relative shrink-0 text-current" />
        )}
        <span className="relative">{children}</span>
        {ripples.map((r) => (
          <span
            key={r.id}
            className="pointer-events-none absolute rounded-full bg-[#D4AF37]/35"
            style={{ left: r.x, top: r.y, width: 8, height: 8, marginLeft: -4, marginTop: -4, animation: 'nova-ripple 650ms ease-out forwards' }}
          />
        ))}
      </Tag>
    </motion.div>
  );
}

/* ============================================================
   AMBIENT LAYER — mouse glow, aurora, particles, noise
   ============================================================ */

function MouseGlow() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { damping: 34, stiffness: 180 });
  const sy = useSpring(y, { damping: 34, stiffness: 180 });
  const background = useMotionTemplate`radial-gradient(560px circle at ${sx}px ${sy}px, rgba(212,175,55,0.09), transparent 72%)`;

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  return <motion.div className="pointer-events-none fixed inset-0 z-30 hidden md:block" style={{ background }} />;
}

function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-[#08080a]">
      <div className="absolute left-[-10%] top-[-15%] h-[55vw] w-[55vw] rounded-full bg-[#D4AF37]/[0.14] blur-[120px] animate-[nova-aurora_22s_ease-in-out_infinite]" />
      <div className="absolute right-[-15%] top-[10%] h-[45vw] w-[45vw] rounded-full bg-[#8a6d1f]/[0.16] blur-[130px] animate-[nova-aurora_26s_ease-in-out_infinite_reverse]" />
      <div className="absolute bottom-[-20%] left-[20%] h-[50vw] w-[50vw] rounded-full bg-[#3a3a40]/[0.35] blur-[140px] animate-[nova-aurora_30s_ease-in-out_infinite]" />
      <div className="absolute inset-0 nova-noise" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,transparent_0%,#08080a_78%)]" />
    </div>
  );
}

function FloatingParticles() {
  const [particles, setParticles] = useState<
    { id: number; left: number; top: number; size: number; duration: number; delay: number }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 34 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2.4 + 0.8,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 8,
      }))
    );
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-[#D4AF37]/40"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animation: `nova-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            boxShadow: '0 0 6px 1px rgba(212,175,55,0.35)',
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   NAVBAR
   ============================================================ */

function LanguageSwitch() {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'fa' : 'en')}
      className="relative flex items-center gap-1.5 overflow-hidden rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-zinc-300 backdrop-blur-xl transition-colors hover:border-[#D4AF37]/40 hover:text-white"
      aria-label="Switch language"
    >
      <Languages size={14} strokeWidth={1.75} /> {/* 🔁 Base44 icon slot */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={lang}
          initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
          transition={{ duration: 0.25 }}
        >
          {lang === 'en' ? 'FA' : 'EN'}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function Navbar() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const items: { key: keyof Dict['nav']; href: string }[] = [
    { key: 'home', href: '#home' },
    { key: 'about', href: '#about' },
    { key: 'projects', href: '#projects' },
    { key: 'connect', href: '#connect' },
    { key: 'contact', href: '#contact' },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-4 z-40 flex justify-center px-4"
    >
      <nav className="flex w-full max-w-3xl items-center justify-between gap-4 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2.5 shadow-[0_8px_40px_-16px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        <a href="#home" className="font-display px-2 text-sm font-semibold tracking-wide text-white">
          P<span className="text-[#D4AF37]">•</span>Y
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {items.map((it) => (
            <li key={it.key}>
              <a
                href={it.href}
                className="rounded-full px-3.5 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                {t.nav[it.key]}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LanguageSwitch />
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 backdrop-blur-xl md:hidden"
            aria-label="Menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />} {/* 🔁 Base44 icon slot */}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
            transition={{ duration: 0.3 }}
            className="absolute left-4 right-4 top-16 flex flex-col gap-1 rounded-3xl border border-white/10 bg-black/70 p-3 backdrop-blur-2xl md:hidden"
          >
            {items.map((it) => (
              <a
                key={it.key}
                href={it.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm text-zinc-300 hover:bg-white/[0.06] hover:text-white"
              >
                {t.nav[it.key]}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ============================================================
   HERO
   ============================================================ */

function Hero() {
  const { lang, t } = useLang();
  return (
    <section id="home" className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[11px] font-medium tracking-wide text-zinc-400 backdrop-blur-xl"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4AF37] opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
        </span>
        {t.hero.tag}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, filter: 'blur(24px)', y: 24 }}
        animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1
          style={{ animation: 'nova-float 8s ease-in-out infinite' }}
          className="font-display select-none bg-gradient-to-r from-[#8a6d1f] via-[#F5E29B] to-[#8a6d1f] bg-clip-text text-[20vw] font-bold leading-none tracking-tight text-transparent [background-size:200%_100%] sm:text-[16vw] md:text-[9rem]"
        >
          PouYa
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="mt-8 flex items-center gap-2 text-xs font-medium tracking-wide text-zinc-500"
      >
        <MapPin size={13} strokeWidth={1.75} className="text-[#D4AF37]" /> {/* 🔁 Base44 icon slot */}
        {lang === 'en' ? LOCATION : LOCATION_FA}
      </motion.div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-zinc-500"
        style={{ animation: 'nova-float 3.4s ease-in-out infinite' }}
        aria-label="Scroll down"
      >
        <span className="h-9 w-5 rounded-full border border-white/15 p-1">
          <span className="block h-1.5 w-1.5 rounded-full bg-[#D4AF37]" style={{ animation: 'nova-scrolldot 1.8s ease-in-out infinite' }} />
        </span>
      </motion.a>
    </section>
  );
}

/* ============================================================
   ABOUT
   ============================================================ */

function AboutSection() {
  const { t } = useLang();
  const [revealed, setRevealed] = useState(false);

  return (
    <section id="about" className="relative mx-auto max-w-3xl px-6 py-32">
      <Reveal>
        <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
          {t.about.eyebrow}
        </span>
      </Reveal>

      <Reveal delay={0.05} className="mt-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#D4AF37]/10 blur-[80px]" />

          {/*
            // درباره خودت اینجا بنویس
            const about = "";
            — مقدار بالا را در کد جایگزین کن، این باکس همان محتوا را نمایش می‌دهد.
          */}
          <motion.div
            animate={{ filter: revealed ? 'blur(0px)' : 'blur(9px)', opacity: revealed ? 1 : 0.35 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-white/15 px-6 py-10 text-center"
          >
            <p className="font-body text-sm text-zinc-500">
              {about || t.about.empty}
            </p>
          </motion.div>

          <div className="mt-8 flex justify-center">
            <GlassButton
              icon={revealed ? EyeOff : Eye} /* 🔁 Base44 icon slot */
              onClick={() => setRevealed((r) => !r)}
            >
              {revealed ? t.about.hide : t.about.reveal}
            </GlassButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ============================================================
   PROJECTS
   ============================================================ */

function ProjectCard({
  title,
  description,
  url,
  Icon,
  index,
}: {
  title: string;
  description: string;
  url: string;
  Icon: LucideIcon;
  index: number;
}) {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 10);
    rx.set(-py * 10);
  }
  function handleLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <Reveal delay={index * 0.08}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-2xl transition-colors duration-300 hover:border-[#D4AF37]/30"
      >
        <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#D4AF37]/0 blur-[60px] transition-all duration-500 group-hover:bg-[#D4AF37]/15" />
        <span className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative">
          <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-[#D4AF37]">
            {/* 🔁 Base44 icon slot — one per project */}
            <Icon size={20} strokeWidth={1.6} />
          </div>
          <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm text-zinc-500">{description || t.projects.empty}</p>
        </div>

        <div className="relative mt-8">
          <GlassButton icon={url ? ArrowUpRight : ExternalLink} href={url || undefined} disabled={!url}>
            {url ? t.projects.view : t.projects.soon}
          </GlassButton>
        </div>
      </motion.div>
    </Reveal>
  );
}

function ProjectsSection() {
  const { t } = useLang();
  return (
    <section id="projects" className="relative mx-auto max-w-5xl px-6 py-32">
      <Reveal>
        <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
          {t.projects.eyebrow}
        </span>
        <h2 className="font-display mt-4 text-4xl font-bold text-white sm:text-5xl">{t.projects.heading}</h2>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <ProjectCard
            key={p.title}
            title={p.title}
            description={p.description}
            url={p.url}
            Icon={projectIconMap[i] ?? Sparkles}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   SOCIALS / CONNECT
   ============================================================ */

// Compact circular icon button, purpose-built for the socials grid
// (kept separate from GlassButton so it never needs size overrides)
function SocialIconButton({
  icon: Icon,
  href,
  label,
  disabled = false,
}: {
  icon: LucideIcon;
  href?: string;
  label: string;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 16, mass: 0.15 });
  const sy = useSpring(y, { stiffness: 200, damping: 16, mass: 0.15 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.18);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.18);
  }
  function handleLeave() {
    x.set(0);
    y.set(0);
  }
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return;
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const id = Date.now() + Math.random();
      setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650);
    }
  }

  const Tag = (href && !disabled ? motion.a : motion.div) as any;

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={handleMove} onMouseLeave={handleLeave} className="inline-flex">
      <Tag
        href={href && !disabled ? href : undefined}
        target={href && !disabled ? '_blank' : undefined}
        rel={href && !disabled ? 'noopener noreferrer' : undefined}
        onClick={handleClick}
        whileTap={disabled ? undefined : { scale: 0.92 }}
        aria-label={label}
        aria-disabled={disabled}
        className={[
          'relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 select-none',
          disabled
            ? 'cursor-not-allowed border-white/10 bg-white/[0.03] opacity-40 grayscale'
            : 'cursor-pointer border-[#D4AF37]/25 bg-gradient-to-b from-[#D4AF37]/15 to-[#8a6d1f]/10 hover:border-[#D4AF37]/55 hover:shadow-[0_0_32px_-8px_rgba(212,175,55,0.5)]',
        ].join(' ')}
      >
        {/* highlight always matches this button's own corner radius */}
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/10 to-transparent" />
        {/* 🔁 Base44 icon slot */}
        <Icon size={20} strokeWidth={1.6} className="relative z-10" />
        {ripples.map((r) => (
          <span
            key={r.id}
            className="pointer-events-none absolute rounded-full bg-[#D4AF37]/35"
            style={{ left: r.x, top: r.y, width: 8, height: 8, marginLeft: -4, marginTop: -4, animation: 'nova-ripple 650ms ease-out forwards' }}
          />
        ))}
      </Tag>
    </motion.div>
  );
}

function SocialsSection() {
  const { t } = useLang();
  const entries = Object.entries(socials) as [keyof typeof socials, string][];

  return (
    <section id="connect" className="relative mx-auto max-w-4xl px-6 py-32">
      <Reveal className="text-center">
        <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
          {t.connect.eyebrow}
        </span>
        <h2 className="font-display mt-4 text-4xl font-bold text-white sm:text-5xl">{t.connect.heading}</h2>
      </Reveal>

      <Reveal delay={0.1} className="mt-14">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {entries.map(([key, value], i) => {
            const Icon = socialIconMap[key]; // 🔁 Base44 icon slot
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="flex flex-col items-center gap-3"
              >
                <SocialIconButton icon={Icon} href={value || undefined} disabled={!value} label={key} />
                <span className="text-[11px] capitalize text-zinc-500">
                  {value ? key : t.connect.empty}
                </span>
              </motion.div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

/* ============================================================
   CONTACT
   ============================================================ */

function ContactSection() {
  const { t } = useLang();
  return (
    <section id="contact" className="relative mx-auto max-w-2xl px-6 py-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center backdrop-blur-2xl sm:p-14">
          <div className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 w-48 rounded-full bg-[#D4AF37]/15 blur-[90px]" />

          <div className="relative mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-[#D4AF37]">
            <Mail size={22} strokeWidth={1.6} /> {/* 🔁 Base44 icon slot */}
          </div>

          <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            {t.contact.eyebrow}
          </span>
          <h2 className="font-display mt-4 text-3xl font-bold text-white sm:text-4xl">{t.contact.heading}</h2>

          <div className="mt-8 flex justify-center">
            <GlassButton
              icon={ArrowUpRight}
              href={socials.email ? `mailto:${socials.email}` : undefined}
              disabled={!socials.email}
              tone="gold"
            >
              {socials.email ? t.contact.cta : t.contact.empty}
            </GlassButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */

function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-white/[0.06] px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-xs text-zinc-600 sm:flex-row">
        <span className="font-display text-sm text-zinc-400">
          P<span className="text-[#D4AF37]">•</span>Y
        </span>
        <span>© {year} PouYa — {t.footer.rights}</span>
      </div>
    </footer>
  );
}

/* ============================================================
   ROOT PAGE
   ============================================================ */

export default function Page() {
  const [lang, setLang] = useState<Lang>('en');
  const t = translations[lang];
  const dir: 'ltr' | 'rtl' = lang === 'fa' ? 'rtl' : 'ltr';

  const ctxValue = useMemo(() => ({ lang, setLang, t, dir }), [lang, t, dir]);

  return (
    <LangContext.Provider value={ctxValue}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        dir={dir}
        className={[
          inter.variable,
          display.variable,
          vazir.variable,
          lang === 'fa' ? 'font-fa' : 'font-body',
          'relative min-h-screen bg-[#08080a] text-zinc-100 antialiased',
        ].join(' ')}
      >
        <AuroraBackground />
        <FloatingParticles />
        <MouseGlow />
        <Navbar />
        <main>
          <Hero />
          <AboutSection />
          <ProjectsSection />
          <SocialsSection />
          <ContactSection />
        </main>
        <Footer />
      </motion.div>
    </LangContext.Provider>
  );
                  }
