import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const LEAD_URL = "https://functions.poehali.dev/121f6b7b-8bde-42ca-a589-80be857d4c3b";
const ADMIN_AUTH_URL = "https://functions.poehali.dev/840cc584-7275-4a89-9a12-0dfe017678fd";
const ADMIN_TOKEN_KEY = "geo_admin_token";

const IMG_HERO = "https://cdn.poehali.dev/projects/e2475c43-0a0b-4159-ace3-1d6cc51d0fa0/files/448f5522-3a1f-4543-ae8c-2be7f55aceca.jpg";
const IMG_BALCONY = "https://cdn.poehali.dev/projects/e2475c43-0a0b-4159-ace3-1d6cc51d0fa0/files/89badd2e-8acf-4e3c-98b3-f2d135dde0a0.jpg";
const IMG_IJZ = "https://cdn.poehali.dev/projects/e2475c43-0a0b-4159-ace3-1d6cc51d0fa0/files/d5c0cbe8-3e2a-4a31-90ba-6c7b06a7d0f1.jpg";

/* ─── Quiz Modal ─────────────────────────────────────── */
function QuizModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ city: "", income_goal: "", phone: "", telegram: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (open) { setStep(1); setForm({ city: "", income_goal: "", phone: "", telegram: "" }); setStatus("idle"); }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const submitLead = async () => {
    setStatus("loading");
    try {
      await fetch(LEAD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (!open) return null;

  const incomeOptions = [
    { value: "low", label: "до 200 000 ₽" },
    { value: "medium", label: "200 000 – 500 000 ₽" },
    { value: "high", label: "500 000+ ₽" },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-page-surface rounded-3xl shadow-2xl p-8 animate-scale-in">
        <button onClick={onClose} className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors">
          <Icon name="X" size={18} className="text-ink-muted" />
        </button>

        {status === "success" ? (
          <div className="text-center py-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={32} className="text-brand" />
            </div>
            <h3 className="font-montserrat font-black text-2xl text-ink mb-2">Заявка принята!</h3>
            <p className="text-ink-muted">Отвечаем в течение 15 минут. Никакого спама. Звонок — только по делу.</p>
            <button onClick={onClose} className="mt-6 btn-primary px-8 py-3 rounded-xl font-semibold font-montserrat">
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? "bg-brand" : "bg-gray-200"}`} />
                ))}
              </div>
              <p className="text-xs text-ink-muted font-semibold uppercase tracking-widest">Шаг {step} из 3</p>
            </div>

            {step === 1 && (
              <div className="animate-fade-in">
                <h3 className="font-montserrat font-black text-xl text-ink mb-1">Ваш город</h3>
                <p className="text-ink-muted text-sm mb-5">Укажите город или регион, где хотите открыть бизнес</p>
                <input
                  autoFocus
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Например: Хабаровск"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-ink bg-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all font-satoshi"
                />
                <button
                  onClick={() => setStep(2)}
                  disabled={!form.city.trim()}
                  className="mt-4 w-full btn-primary py-3.5 rounded-xl font-semibold font-montserrat disabled:opacity-40"
                >
                  Далее →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                <h3 className="font-montserrat font-black text-xl text-ink mb-1">Желаемая прибыль</h3>
                <p className="text-ink-muted text-sm mb-5">Сколько хотите зарабатывать в месяц?</p>
                <div className="grid gap-3">
                  {incomeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setForm({ ...form, income_goal: opt.value }); setStep(3); }}
                      className={`w-full text-left px-5 py-4 rounded-xl border-2 font-semibold font-montserrat transition-all duration-150 ${
                        form.income_goal === opt.value
                          ? "border-brand bg-brand/5 text-brand"
                          : "border-gray-200 bg-white text-ink hover:border-brand/40"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in">
                <h3 className="font-montserrat font-black text-xl text-ink mb-1">Ваши контакты</h3>
                <p className="text-ink-muted text-sm mb-5">Пришлём финансовый план для {form.city || "вашего города"}</p>
                <div className="space-y-3">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Телефон *"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-ink bg-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all font-satoshi"
                  />
                  <input
                    value={form.telegram}
                    onChange={(e) => setForm({ ...form, telegram: e.target.value })}
                    placeholder="Telegram (необязательно)"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-ink bg-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all font-satoshi"
                  />
                </div>
                {status === "error" && (
                  <p className="mt-2 text-red-500 text-sm">Ошибка отправки. Попробуйте ещё раз.</p>
                )}
                <button
                  onClick={submitLead}
                  disabled={!form.phone.trim() || status === "loading"}
                  className="mt-4 w-full btn-primary py-3.5 rounded-xl font-semibold font-montserrat disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {status === "loading" ? <><Icon name="Loader2" size={18} className="animate-spin" /> Отправляем...</> : "Получить финансовый план →"}
                </button>
                <p className="mt-3 text-center text-xs text-ink-muted">Никакого спама. Звонок — только по делу.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Header / Nav ────────────────────────────────────── */
function Header({ onQuiz, onAdmin }: { onQuiz: () => void; onAdmin: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "О нас", href: "#about" },
    { label: "Направления", href: "#directions" },
    { label: "Партнёры", href: "#cases" },
    { label: "Контакты", href: "#cta" },
  ];

  const handleLogoClick = () => {
    const next = logoClicks + 1;
    if (next >= 5) { setLogoClicks(0); onAdmin(); }
    else { setLogoClicks(next); setTimeout(() => setLogoClicks(0), 3000); }
  };

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass shadow-sm border-b border-gray-100" : "bg-transparent"}`}>
      <div className="container-lg flex items-center justify-between h-16">
        <button onClick={handleLogoClick} className="flex items-center gap-2.5 select-none">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <Icon name="Layers" size={16} className="text-white" />
          </div>
          <span className="font-montserrat font-black text-lg text-ink">Геометрия Уюта</span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="px-4 py-2 rounded-lg font-satoshi font-medium text-sm text-ink-muted hover:text-ink hover:bg-black/5 transition-all"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <button
          onClick={onQuiz}
          className="hidden md:flex btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold font-montserrat items-center gap-2"
        >
          Получить план
          <Icon name="ArrowRight" size={15} />
        </button>

        <button className="md:hidden p-2 rounded-lg hover:bg-black/5" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "X" : "Menu"} size={22} className="text-ink" />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-page-surface border-t border-gray-100 px-4 py-4 flex flex-col gap-1">
          {navLinks.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="text-left px-4 py-3 rounded-xl font-satoshi font-medium text-ink hover:bg-black/5 transition-colors"
            >
              {l.label}
            </button>
          ))}
          <button onClick={() => { setMenuOpen(false); onQuiz(); }} className="mt-2 btn-primary px-5 py-3 rounded-xl text-sm font-semibold font-montserrat">
            Получить план →
          </button>
        </div>
      )}
    </header>
  );
}

/* ─── Hero ────────────────────────────────────────────── */
function HeroBlock({ onQuiz }: { onQuiz: () => void }) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center bg-page-bg overflow-hidden">
      <div className="absolute inset-0 gradient-brand-light" />
      <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
        <img src={IMG_HERO} alt="Остеклённый балкон" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-page-bg via-page-bg/60 to-transparent" />
      </div>

      <div className="container-lg relative z-10 pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="max-w-xl">
          <div className="chip chip-brand mb-5">🏆 18 лет на рынке Дальнего Востока</div>
          <h1 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-ink mb-5">
            Бизнес на балконах и окнах на{" "}
            <span className="text-brand">Дальнем Востоке</span> и по всей России
          </h1>
          <p className="text-ink-muted text-lg md:text-xl mb-3 leading-relaxed">
            Чистая прибыль от 200 000 до 900 000 руб./мес. Без офиса. Без склада. Без опыта в ремонте.
          </p>
          <p className="text-ink text-base mb-8 leading-relaxed">
            Мы 18 лет остекляем, утепляем и превращаем балконы и квартиры в уютные пространства. Теперь передаём вам всё: технологии, клиентов, систему продаж.
          </p>

          <button onClick={onQuiz} className="btn-primary px-8 py-4 rounded-xl font-montserrat font-bold text-base flex items-center gap-2 w-fit">
            Получить финансовый план для моего города
            <Icon name="ArrowRight" size={18} />
          </button>

          <div className="mt-8 flex flex-wrap gap-5">
            {[
              { icon: "ShieldCheck", text: "18 лет опыта" },
              { icon: "MapPin", text: "7 городов-партнёров" },
              { icon: "Clock", text: "Окупаемость 3–5 мес." },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-2 text-sm font-medium text-ink">
                <Icon name={b.icon as "ShieldCheck"} size={16} className="text-brand" />
                {b.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:hidden w-full h-56 mt-0 relative overflow-hidden">
        <img src={IMG_HERO} alt="Балкон" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-page-bg/80 to-transparent" />
        <div className="absolute bottom-4 right-4 chip chip-amber">Средний чек: 170–500 тыс. ₽</div>
      </div>
    </section>
  );
}

/* ─── Pain Points ─────────────────────────────────────── */
function PainBlock() {
  const cards = [
    {
      emoji: "😤",
      title: "Работаете «на дядю» в строительстве",
      text: "Умеете делать руками, знаете как замерить и поставить. Но всё — чужая прибыль. Хотите своё, но боитесь потеряться с нуля.",
    },
    {
      emoji: "📈",
      title: "Уже есть свой ремонтный бизнес",
      text: "Клиенты есть, но нет системы. Реклама «на авось», цены занижены. Хочется выйти на другой уровень.",
    },
    {
      emoji: "💼",
      title: "Ищете надёжный бизнес с понятной моделью",
      text: "Инвестиции есть, но не хочется рисковать. Нужна проверенная схема с поддержкой на каждом шаге.",
    },
  ];
  return (
    <section className="section bg-page-bg">
      <div className="container-lg">
        <h2 className="font-montserrat font-black text-3xl md:text-4xl text-ink text-center mb-3">Узнаёте себя?</h2>
        <p className="text-ink-muted text-center mb-12 max-w-xl mx-auto">Для всех трёх случаев у нас есть готовое решение — проверенное на Дальнем Востоке.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div key={c.title} className="bg-white rounded-2xl p-6 border border-gray-100 card-hover">
              <div className="text-4xl mb-4">{c.emoji}</div>
              <h3 className="font-montserrat font-bold text-lg text-ink mb-2">{c.title}</h3>
              <p className="text-ink-muted text-sm leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Founder / Team ──────────────────────────────────── */
function FounderBlock({ onQuiz }: { onQuiz: () => void }) {
  return (
    <section id="about" className="section bg-page-surface">
      <div className="container-lg">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="chip chip-brand mb-4">Основатель</div>
            <h2 className="font-montserrat font-black text-3xl md:text-4xl text-ink mb-5">
              Меня зовут Владимир. Я 18 лет строил этот бизнес с нуля.
            </h2>
            <p className="text-ink-muted leading-relaxed mb-4">
              Начинали как небольшая бригада по замене окон во Владивостоке. За 18 лет — сотни остеклённых балконов, тысячи установленных окон, выстроенная система продаж.
            </p>
            <p className="text-ink-muted leading-relaxed mb-6">
              Мы совершили все ошибки сами: работали без системы, теряли клиентов, тестировали рекламу за свой счёт. Всё это стоило нам миллионы рублей. Теперь вам не нужно платить эту цену.
            </p>
            <button onClick={onQuiz} className="btn-primary px-6 py-3.5 rounded-xl font-montserrat font-semibold flex items-center gap-2 w-fit">
              Получить финансовый план <Icon name="ArrowRight" size={16} />
            </button>
          </div>
          <div className="relative rounded-3xl overflow-hidden">
            <img src={IMG_BALCONY} alt="Пример работы" className="w-full h-80 lg:h-96 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent flex items-end p-6">
              <div className="flex gap-6">
                {[{ v: "18 лет", l: "на рынке" }, { v: "500+", l: "объектов" }, { v: "7", l: "городов" }].map((s) => (
                  <div key={s.l} className="text-white">
                    <div className="font-montserrat font-black text-2xl">{s.v}</div>
                    <div className="text-white/70 text-sm">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <h3 className="font-montserrat font-black text-2xl text-ink text-center mb-8">Нас двое. И мы оба отвечаем за ваш результат.</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              initials: "НМУ",
              role: "Наставник по объектам и производству",
              quote: "Я отвечаю за то, чтобы каждый объект был сдан качественно и в срок. Технологии замера, монтажа, работа с бригадой — моя зона.",
            },
            {
              initials: "НОП",
              role: "Наставник по маркетингу и управлению",
              quote: "Я отвечаю за то, чтобы у вас всегда были заявки. Настраиваем рекламу, разбираем воронку, учим продавать — без этого никакой монтаж не поможет.",
            },
          ].map((m) => (
            <div key={m.role} className="bg-white rounded-2xl p-6 border border-gray-100 flex gap-5">
              <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center shrink-0">
                <span className="font-montserrat font-black text-sm text-brand">{m.initials}</span>
              </div>
              <div>
                <p className="font-semibold text-brand text-sm mb-1">{m.role}</p>
                <p className="text-ink-muted text-sm leading-relaxed italic">«{m.quote}»</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-ink-muted text-sm mt-6">Вы не остаётесь один на один с бизнесом. За каждым направлением стоит человек с многолетним опытом.</p>
      </div>
    </section>
  );
}

/* ─── Directions ──────────────────────────────────────── */
function DirectionsBlock({ onQuiz }: { onQuiz: () => void }) {
  const directions = [
    {
      icon: "🏠",
      title: "Балконы и лоджии под ключ",
      desc: "Остекление, утепление, дизайнерская отделка, встроенная мебель, объединение с комнатой или кухней. От первого замера до финальной уборки.",
      features: ["Остекление и утепление", "Дизайнерская отделка", "Встроенная мебель", "Объединение с комнатой", "Гарантия 3 года"],
      check: "170 000 – 500 000 ₽",
      margin: "Маржа 60–65%",
      img: IMG_BALCONY,
      wide: true,
    },
    {
      icon: "🪟",
      title: "Замена и установка окон",
      desc: "ПВХ-конструкции для квартир, домов, офисов. Работаем с частными клиентами и застройщиками при сдаче МКД.",
      features: ["ПВХ и алюминий", "Демонтаж и монтаж", "Работа с застройщиками", "Гарантия 5 лет"],
      check: "35 000 – 500 000+ ₽",
      margin: "15–30 заявок/мес.",
      img: IMG_HERO,
      wide: false,
    },
    {
      icon: "🏡",
      title: "Остекление ИЖС",
      desc: "Алюминиевые и панорамные конструкции для частных домов. Клубные посёлки — один договор на весь посёлок.",
      features: ["Алюминиевые конструкции", "Панорамное остекление", "Клубные посёлки", "Крупный чек"],
      check: "от 1 500 000 ₽",
      margin: "1 объект = 2–3 мес. выручки",
      img: IMG_IJZ,
      wide: false,
    },
  ];

  return (
    <section id="directions" className="section bg-page-bg">
      <div className="container-lg">
        <div className="chip chip-brand mb-4 mx-auto w-fit">3 направления</div>
        <h2 className="font-montserrat font-black text-3xl md:text-4xl text-ink text-center mb-3">
          Три направления. Один бизнес. Заказы круглый год.
        </h2>
        <p className="text-ink-muted text-center mb-12 max-w-2xl mx-auto">
          💡 Три направления = три источника дохода. Даже если частные клиенты в один месяц просели — контракт с застройщиком или ИЖС держит кассу.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {directions.map((d, i) => (
            <div key={d.title} className={`bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover ${i === 0 ? "md:col-span-2" : ""}`}>
              {i === 0 ? (
                <div className="grid lg:grid-cols-2">
                  <img src={d.img} alt={d.title} className="w-full h-56 lg:h-full object-cover" />
                  <div className="p-7">
                    <div className="text-3xl mb-3">{d.icon}</div>
                    <h3 className="font-montserrat font-bold text-xl text-ink mb-2">{d.title}</h3>
                    <p className="text-ink-muted text-sm mb-4 leading-relaxed">{d.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {d.features.map((f) => (
                        <span key={f} className="chip chip-brand text-xs">{f}</span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <div className="bg-brand/5 rounded-xl p-3">
                        <div className="font-montserrat font-black text-brand text-base">{d.check}</div>
                        <div className="text-ink-muted text-xs mt-0.5">средний чек</div>
                      </div>
                      <div className="bg-brand/5 rounded-xl p-3">
                        <div className="font-montserrat font-black text-brand text-base">{d.margin}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <img src={d.img} alt={d.title} className="w-full h-44 object-cover" />
                  <div className="p-6">
                    <div className="text-2xl mb-2">{d.icon}</div>
                    <h3 className="font-montserrat font-bold text-lg text-ink mb-2">{d.title}</h3>
                    <p className="text-ink-muted text-sm mb-4 leading-relaxed">{d.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {d.features.map((f) => (
                        <span key={f} className="chip chip-brand text-xs">{f}</span>
                      ))}
                    </div>
                    <div className="bg-brand/5 rounded-xl p-3">
                      <div className="font-montserrat font-black text-brand">{d.check}</div>
                      <div className="text-ink-muted text-xs mt-0.5">{d.margin}</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Financial Model ─────────────────────────────────── */
function FinanceBlock({ onQuiz }: { onQuiz: () => void }) {
  const metrics = [
    { value: "от 290 000 ₽", label: "Паушальный взнос", note: "единоразово" },
    { value: "15 000 ₽/мес.", label: "Роялти", note: "со 2-го месяца" },
    { value: "3–5 мес.", label: "Окупаемость", note: "среднее по сети" },
    { value: "от 500 000 ₽", label: "Стартовый бюджет", note: "включая рекламу" },
  ];

  const rows = [
    { label: "Заказов в месяц", start: "3–5", growth: "6–10", stable: "10–15+", hl: false },
    { label: "Выручка", start: "300 – 600 тыс. ₽", growth: "700 – 1 300 тыс. ₽", stable: "1,5 – 2,5 млн ₽", hl: false },
    { label: "Чистая прибыль", start: "120 – 250 тыс. ₽", growth: "280 – 520 тыс. ₽", stable: "500 – 900 тыс. ₽", hl: true },
  ];

  return (
    <section id="finance" className="section gradient-dark text-white">
      <div className="container-lg">
        <div className="chip chip-dark mb-4 mx-auto w-fit">Финансовая модель</div>
        <h2 className="font-montserrat font-black text-3xl md:text-4xl text-white text-center mb-3">
          Сколько вы заработаете? Посчитаем честно.
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 mt-10">
          {metrics.map((m) => (
            <div key={m.label} className="bg-white/10 rounded-2xl p-5 border border-white/10">
              <div className="font-montserrat font-black text-xl text-white mb-1">{m.value}</div>
              <div className="text-white/80 font-semibold text-sm">{m.label}</div>
              <div className="text-white/50 text-xs mt-1">{m.note}</div>
            </div>
          ))}
        </div>

        <div className="bg-white/10 rounded-2xl border border-white/10 overflow-hidden mb-8">
          <div className="grid grid-cols-4 bg-white/10 text-white/70 text-xs font-semibold uppercase tracking-widest">
            <div className="p-4">Показатель</div>
            <div className="p-4">Старт (2–3 мес.)</div>
            <div className="p-4">Рост (4–6 мес.)</div>
            <div className="p-4">Устойчивый режим</div>
          </div>
          {rows.map((r) => (
            <div key={r.label} className={`grid grid-cols-4 border-t border-white/10 ${r.hl ? "bg-brand/20" : ""}`}>
              <div className={`p-4 font-semibold text-sm ${r.hl ? "text-white" : "text-white/80"}`}>{r.label}</div>
              <div className={`p-4 text-sm ${r.hl ? "text-brand-light font-bold" : "text-white/70"}`}>{r.start}</div>
              <div className={`p-4 text-sm ${r.hl ? "text-brand-light font-bold" : "text-white/70"}`}>{r.growth}</div>
              <div className={`p-4 text-sm ${r.hl ? "text-brand-light font-bold" : "text-white/70"}`}>{r.stable}</div>
            </div>
          ))}
        </div>

        <p className="text-white/50 text-sm text-center mb-8">
          ⚠️ Цифры взяты из реальных результатов партнёров. Не обещаем «гарантированный доход» — показываем, что есть у нас сейчас.
        </p>

        <div className="text-center">
          <button onClick={onQuiz} className="bg-white text-brand px-8 py-4 rounded-xl font-montserrat font-bold text-base hover:bg-brand-light transition-colors">
            Рассчитать финмодель для вашего города →
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Package ─────────────────────────────────────────── */
function PackageBlock() {
  const cols = [
    {
      icon: "📦",
      title: "Запуск под ключ",
      items: [
        "Обучение замерам, монтажу, продажам (выезд на реальные объекты)",
        "Готовый сайт вашего города",
        "Настроенная рекламная кампания Яндекс.Директ",
        "Скрипты продаж и работы с возражениями",
        "База поставщиков с ценами ниже рынка на 15–20%",
      ],
    },
    {
      icon: "🚀",
      title: "Поддержка на каждом этапе",
      items: [
        "Опытные наставники (НМУ и НОП) всегда на связи в рабочее время",
        "Закрытый чат партнёров с разбором реальных кейсов",
        "Готовое портфолио: 300+ фото объектов «до/после»",
        "Ежемесячный маркетинговый аудит вашей рекламы",
      ],
    },
  ];

  return (
    <section id="package" className="section bg-page-bg">
      <div className="container-lg">
        <div className="chip chip-brand mb-4 mx-auto w-fit">Что входит</div>
        <h2 className="font-montserrat font-black text-3xl md:text-4xl text-ink text-center mb-12">
          Вы покупаете не право на название. Вы покупаете готовую систему.
        </h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {cols.map((c) => (
            <div key={c.title} className="bg-white rounded-2xl p-7 border border-gray-100">
              <div className="text-3xl mb-3">{c.icon}</div>
              <h3 className="font-montserrat font-bold text-lg text-ink mb-4">{c.title}</h3>
              <ul className="space-y-3">
                {c.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-ink-muted">
                    <Icon name="Check" size={16} className="text-brand shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bg-brand/5 border border-brand/20 rounded-2xl p-6 flex gap-4">
          <div className="text-3xl shrink-0">🔑</div>
          <p className="text-ink leading-relaxed">
            <strong>Опыт «Геометрии Уюта» — более 18 лет работы в ремонтно-строительной нише — зашит в каждый регламент.</strong> Вы получаете то, на что мы потратили годы.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Cases / Social Proof ────────────────────────────── */
function CasesBlock({ onQuiz }: { onQuiz: () => void }) {
  const cases = [
    {
      city: "Хабаровск",
      name: "Роман",
      age: 38,
      quote: "До этого работал прорабом. Думал, что знаю о ремонте всё. Оказалось — совсем не умел продавать. С франшизой вышел на 340 000 руб. чистой прибыли на 4-й месяц. Сейчас — 2 бригады, 12 заказов в месяц.",
      metrics: [
        { label: "Месяц 1", value: "2 заказа" },
        { label: "Месяц 6", value: "12 заказов" },
        { label: "Прибыль сейчас", value: "540 000 ₽/мес.", hl: true },
      ],
    },
    {
      city: "Южно-Сахалинск",
      name: "Дарья",
      age: 34,
      quote: "Никакого строительного опыта. Пришла из найма. Через 2 месяца после запуска окупила паушальный взнос. Всё уже было готово.",
      metrics: [
        { label: "Окупаемость", value: "3,5 месяца" },
        { label: "Средний чек", value: "215 000 ₽" },
        { label: "Прибыль сейчас", value: "290 000 ₽/мес.", hl: true },
      ],
    },
    {
      city: "Уссурийск",
      name: "Алексей",
      age: 42,
      quote: "У меня уже был бизнес по установке окон. Взял франшизу, чтобы добавить балконное направление и систему. Оборот вырос в 2,3 раза за полгода.",
      metrics: [
        { label: "Рост выручки", value: "×2,3" },
        { label: "Новое направление", value: "балконы" },
        { label: "Доп. прибыль", value: "+420 000 ₽/мес.", hl: true },
      ],
    },
  ];

  return (
    <section id="cases" className="section bg-page-surface">
      <div className="container-lg">
        <div className="chip chip-brand mb-4 mx-auto w-fit">Истории партнёров</div>
        <h2 className="font-montserrat font-black text-3xl md:text-4xl text-ink text-center mb-12">
          Вот что говорят люди, которые уже работают с нами
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((c) => (
            <div key={c.name} className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center font-montserrat font-black text-brand text-lg">
                  {c.name[0]}
                </div>
                <div>
                  <div className="font-montserrat font-bold text-ink">{c.name}, {c.age}</div>
                  <div className="chip chip-brand text-xs">{c.city}</div>
                </div>
              </div>
              <blockquote className="text-ink-muted text-sm leading-relaxed italic mb-5 flex-1">
                «{c.quote}»
              </blockquote>
              <div className="grid grid-cols-3 gap-2">
                {c.metrics.map((m) => (
                  <div key={m.label} className={`rounded-xl p-2.5 text-center ${m.hl ? "bg-brand text-white" : "bg-gray-50"}`}>
                    <div className={`font-montserrat font-black text-sm ${m.hl ? "text-white" : "text-ink"}`}>{m.value}</div>
                    <div className={`text-xs mt-0.5 ${m.hl ? "text-white/70" : "text-ink-muted"}`}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Cities Map (text-based) ─────────────────────────── */
function CitiesBlock({ onQuiz }: { onQuiz: () => void }) {
  const cities = [
    { name: "Владивосток", status: "hq", note: "Главный офис" },
    { name: "Хабаровск", status: "active", partner: "Роман" },
    { name: "Южно-Сахалинск", status: "active", partner: "Дарья" },
    { name: "Уссурийск", status: "active", partner: "Алексей" },
    { name: "Находка", status: "active" },
    { name: "Комсомольск-на-Амуре", status: "active" },
    { name: "Якутск", status: "active" },
    { name: "Благовещенск", status: "available" },
    { name: "Чита", status: "available" },
    { name: "Иркутск", status: "available" },
    { name: "Магадан", status: "available" },
  ];

  return (
    <section id="map" className="section bg-page-bg">
      <div className="container-lg">
        <div className="chip chip-brand mb-4 mx-auto w-fit">География</div>
        <h2 className="font-montserrat font-black text-3xl md:text-4xl text-ink text-center mb-3">
          Партнёры уже работают в 7 городах
        </h2>
        <p className="text-ink-muted text-center mb-12 max-w-xl mx-auto">
          На каждый город — один партнёр. Когда территория занята — следующий не получит эксклюзив.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {cities.map((c) => (
            <div key={c.name} className={`flex items-center gap-3 p-4 rounded-xl border ${
              c.status === "hq" ? "bg-brand text-white border-brand" :
              c.status === "active" ? "bg-white border-gray-100" :
              "bg-gray-50 border-dashed border-gray-200"
            }`}>
              <div className={`w-3 h-3 rounded-full shrink-0 ${
                c.status === "hq" ? "bg-white" :
                c.status === "active" ? "bg-green-500" :
                "bg-gray-300"
              }`} />
              <div className="flex-1 min-w-0">
                <div className={`font-semibold text-sm ${c.status === "hq" ? "text-white" : "text-ink"}`}>{c.name}</div>
                {(c.note || c.partner) && (
                  <div className={`text-xs ${c.status === "hq" ? "text-white/70" : "text-ink-muted"}`}>
                    {c.note || `Партнёр: ${c.partner}`}
                  </div>
                )}
                {c.status === "available" && <div className="text-xs text-brand font-medium">Территория свободна</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button onClick={onQuiz} className="btn-primary px-8 py-4 rounded-xl font-montserrat font-bold text-base">
            Проверить, свободен ли мой город →
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─────────────────────────────────────────────── */
function FaqBlock() {
  const [open, setOpen] = useState<number | null>(0);
  const items = [
    {
      q: "Нужен ли опыт в строительстве или ремонте?",
      a: "Нет. Большинство наших партнёров пришли без строительного опыта. Вы управляете бизнесом — клиентами, замерщиком, бригадой. Технологиям обучаем сами, с выездом на объекты.",
    },
    {
      q: "Откуда брать клиентов?",
      a: "С первой недели — настраиваем Яндекс.Директ на ваш город. Параллельно помогаем с Авито, ВКонтакте и сарафанным радио. У наших партнёров в среднем 8–15 заявок в первый месяц.",
    },
    {
      q: "Есть ли конкуренция?",
      a: "Есть. Но 80% локальных компаний — это «ИП Василий» без системы, сайта и гарантий. Наше УТП — дизайнерский подход, гарантия 3 года, профессиональные фото «до/после» и 18 лет репутации на ДВ.",
    },
    {
      q: "Что будет, если не пойдёт?",
      a: "За всё время работы сети закрылось минимальное количество партнёров. В 9 из 10 случаев причина — недостаточный рекламный бюджет в первые 2 месяца. Поэтому честно говорим на старте: минимальный бюджет на рекламу — 50 000 руб./мес.",
    },
    {
      q: "Почему Дальний Восток — выгодное место для этого бизнеса?",
      a: "Льготы СПВ: страховые взносы 7,6% вместо 30%, льготные налоги на 5 лет. Близость Китая — материалы дешевле. Дефицит сильных игроков в нише отделки балконов и ИЖС.",
    },
  ];

  return (
    <section id="faq" className="section bg-page-surface">
      <div className="container-md">
        <h2 className="font-montserrat font-black text-3xl md:text-4xl text-ink text-center mb-12">
          Честные ответы на главные вопросы
        </h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-montserrat font-bold text-ink pr-4">{item.q}</span>
                <Icon name={open === i ? "ChevronUp" : "ChevronDown"} size={20} className="text-brand shrink-0" />
              </button>
              {open === i && (
                <div className="px-6 pb-6 text-ink-muted leading-relaxed text-sm animate-fade-in">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA / Quiz Block ────────────────────────────────── */
function CtaBlock({ onQuiz }: { onQuiz: () => void }) {
  const badges = [
    { icon: "ShieldCheck", text: "18 лет опыта в нише" },
    { icon: "TrendingUp", text: "Окупаемость 3–5 месяцев" },
    { icon: "MapPin", text: "Эксклюзивная территория" },
    { icon: "Award", text: "Знаем рынок ДВ изнутри" },
  ];
  return (
    <section id="cta" className="section gradient-dark text-white">
      <div className="container-md text-center">
        <div className="chip chip-dark mb-5 mx-auto w-fit">Готовы начать?</div>
        <h2 className="font-montserrat font-black text-3xl md:text-5xl text-white mb-4 leading-tight">
          Получите финансовый план за 5 минут.
        </h2>
        <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
          Укажите ваш город и желаемый доход — пришлём расчёт, сколько нужно вложить и когда окупится.
        </p>
        <button onClick={onQuiz} className="bg-white text-brand px-10 py-4 rounded-xl font-montserrat font-bold text-lg hover:bg-brand-light transition-colors mb-10">
          Получить финансовый план →
        </button>
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          {badges.map((b) => (
            <div key={b.text} className="flex items-center gap-2 text-white/80 text-sm">
              <Icon name={b.icon as "ShieldCheck"} size={16} className="text-brand-light" />
              {b.text}
            </div>
          ))}
        </div>
        <p className="text-white/40 text-sm">Никакого спама. Звонок — только по делу.</p>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-ink text-white/60 py-12">
      <div className="container-lg">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
                <Icon name="Layers" size={16} className="text-white" />
              </div>
              <span className="font-montserrat font-black text-lg text-white">Геометрия Уюта</span>
            </div>
            <p className="text-sm">Франшиза на остекление балконов и окон</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="/privacy" className="hover:text-white transition-colors">Политика конфиденциальности</a>
            <a href="/offer" className="hover:text-white transition-colors">Публичная оферта</a>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between gap-2 text-xs">
          <p>© 2026 Геометрия Уюта. Все права защищены.</p>
          <p>ИНН: PLACEHOLDER · ОГРН: PLACEHOLDER</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Admin Page ──────────────────────────────────────── */
type Lead = { id: string; city: string; income_goal: string; phone: string; telegram: string; created_at: string | null };

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ login: "", password: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(ADMIN_AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const raw = await res.json();
      const data = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!res.ok || !data.ok) { setStatus("error"); return; }
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      onSuccess();
    } catch { setStatus("error"); }
  };

  return (
    <div className="min-h-screen bg-page-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center mx-auto mb-4">
            <Icon name="Lock" size={28} className="text-white" />
          </div>
          <h1 className="font-montserrat font-black text-2xl text-ink">Вход в панель</h1>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-2">Логин</label>
              <input
                required
                autoComplete="username"
                placeholder="Введите логин"
                value={form.login}
                onChange={(e) => { setForm({ ...form, login: e.target.value }); setStatus("idle"); }}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all text-ink text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-2">Пароль</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all">
                <input
                  required
                  autoComplete="current-password"
                  type={showPass ? "text" : "password"}
                  placeholder="Введите пароль"
                  value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); setStatus("idle"); }}
                  className="bg-transparent outline-none text-ink placeholder-gray-400 w-full text-sm"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}>
                  <Icon name={showPass ? "EyeOff" : "Eye"} size={16} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            </div>
            {status === "error" && (
              <div className="text-red-500 text-sm">Неверный логин или пароль</div>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full btn-primary py-3.5 rounded-xl font-montserrat font-bold disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {status === "loading" ? <><Icon name="Loader2" size={18} className="animate-spin" /> Проверяем...</> : "Войти"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function AdminPage({ onBack }: { onBack: () => void }) {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem(ADMIN_TOKEN_KEY));
  const [items, setItems] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(LEAD_URL);
      const raw = await res.json();
      const data = typeof raw === "string" ? JSON.parse(raw) : raw;
      setItems(data.items || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { if (authed) load(); }, [authed]);

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  const incomeLabel = (v: string) =>
    v === "low" ? "до 200 тыс." : v === "medium" ? "200–500 тыс." : v === "high" ? "500 тыс.+" : v;

  const fmt = (iso: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("ru-RU", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-page-bg pb-12">
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container-lg py-5 flex items-center justify-between">
          <div>
            <button onClick={onBack} className="text-ink-muted text-sm flex items-center gap-1 mb-1 hover:text-ink">
              <Icon name="ArrowLeft" size={14} /> На сайт
            </button>
            <h1 className="font-montserrat font-black text-2xl text-ink">Заявки на франшизу</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-brand/10 rounded-xl px-4 py-2 text-center">
              <div className="font-montserrat font-black text-xl text-brand">{items.length}</div>
              <div className="text-ink-muted text-xs">всего</div>
            </div>
            <button onClick={load} className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Icon name="RefreshCw" size={16} className="text-ink-muted" />
            </button>
            <button
              onClick={() => { localStorage.removeItem(ADMIN_TOKEN_KEY); setAuthed(false); }}
              className="w-10 h-10 rounded-xl border border-red-100 bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
            >
              <Icon name="LogOut" size={16} className="text-red-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="container-lg mt-8">
        {loading ? (
          <div className="text-center py-20 text-ink-muted">
            <Icon name="Loader2" size={28} className="animate-spin mx-auto mb-2" />
            Загрузка...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-ink-muted">
            <Icon name="Inbox" size={36} className="mx-auto mb-3 opacity-40" />
            <p>Заявок пока нет</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <div className="text-xs text-ink-muted mb-0.5">Город</div>
                    <div className="font-semibold text-ink">{item.city || "—"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-ink-muted mb-0.5">Телефон</div>
                    <a href={`tel:${item.phone}`} className="font-semibold text-brand hover:underline">{item.phone}</a>
                  </div>
                  <div>
                    <div className="text-xs text-ink-muted mb-0.5">Telegram</div>
                    <div className="font-semibold text-ink">{item.telegram || "—"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-ink-muted mb-0.5">Желаемая прибыль</div>
                    <div className="chip chip-brand">{incomeLabel(item.income_goal)}</div>
                  </div>
                </div>
                <div className="text-xs text-ink-muted whitespace-nowrap">{fmt(item.created_at)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── App ─────────────────────────────────────────────── */
export default function App() {
  const [quizOpen, setQuizOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin) return <AdminPage onBack={() => setShowAdmin(false)} />;

  return (
    <>
      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} />
      <Header onQuiz={() => setQuizOpen(true)} onAdmin={() => setShowAdmin(true)} />
      <main>
        <HeroBlock onQuiz={() => setQuizOpen(true)} />
        <PainBlock />
        <FounderBlock onQuiz={() => setQuizOpen(true)} />
        <DirectionsBlock onQuiz={() => setQuizOpen(true)} />
        <FinanceBlock onQuiz={() => setQuizOpen(true)} />
        <PackageBlock />
        <CasesBlock onQuiz={() => setQuizOpen(true)} />
        <CitiesBlock onQuiz={() => setQuizOpen(true)} />
        <FaqBlock />
        <CtaBlock onQuiz={() => setQuizOpen(true)} />
      </main>
      <Footer />
    </>
  );
}
