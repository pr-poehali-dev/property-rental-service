import { useState } from "react";
import Icon from "@/components/ui/icon";

const IMG_HERO = "https://cdn.poehali.dev/projects/e2475c43-0a0b-4159-ace3-1d6cc51d0fa0/files/a2d8dcf6-bd21-4baa-bd91-54c7d06803bb.jpg";
const IMG_VILLA = "https://cdn.poehali.dev/projects/e2475c43-0a0b-4159-ace3-1d6cc51d0fa0/files/bc138614-6763-497a-8080-0ba1b621adff.jpg";
const IMG_STUDIO = "https://cdn.poehali.dev/projects/e2475c43-0a0b-4159-ace3-1d6cc51d0fa0/files/05525042-ec8a-4986-b7da-dc55ce5202cd.jpg";

type Page = "home" | "catalog" | "profile" | "contacts";

const listings = [
  { id: 1, title: "Апартаменты у моря", city: "Сочи", price: 4500, rooms: 2, type: "Квартира", img: IMG_HERO, rating: 4.9, reviews: 124, favorite: false, tag: "Хит" },
  { id: 2, title: "Вилла с бассейном", city: "Краснодар", price: 12000, rooms: 4, type: "Дом", img: IMG_VILLA, rating: 5.0, reviews: 87, favorite: true, tag: "Топ" },
  { id: 3, title: "Уютная студия", city: "Москва", price: 2800, rooms: 1, type: "Студия", img: IMG_STUDIO, rating: 4.7, reviews: 203, favorite: false, tag: "Новое" },
  { id: 4, title: "Пентхаус в центре", city: "Санкт-Петербург", price: 8500, rooms: 3, type: "Квартира", img: IMG_HERO, rating: 4.8, reviews: 56, favorite: false, tag: "" },
  { id: 5, title: "Загородный коттедж", city: "Казань", price: 6200, rooms: 5, type: "Дом", img: IMG_VILLA, rating: 4.6, reviews: 41, favorite: true, tag: "" },
  { id: 6, title: "Студия в стиле лофт", city: "Екатеринбург", price: 2200, rooms: 1, type: "Студия", img: IMG_STUDIO, rating: 4.5, reviews: 78, favorite: false, tag: "" },
];

function Nav({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links: { id: Page; label: string; icon: string }[] = [
    { id: "home", label: "Главная", icon: "Home" },
    { id: "catalog", label: "Каталог", icon: "Search" },
    { id: "profile", label: "Профиль", icon: "User" },
    { id: "contacts", label: "Контакты", icon: "Mail" },
  ];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <button onClick={() => setPage("home")} className="flex items-center gap-2 font-montserrat font-800 text-xl">
          <span className="gradient-text font-black text-2xl">НаймиДом</span>
        </button>
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => setPage(l.id)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 font-golos ${
                page === l.id
                  ? "btn-gradient shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button
          className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? "X" : "Menu"} size={22} />
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => { setPage(l.id); setMenuOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                page === l.id ? "btn-gradient" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon name={l.icon} size={18} />
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

function TagBadge({ tag }: { tag: string }) {
  if (!tag) return null;
  const colors: Record<string, string> = {
    "Хит": "from-pink-500 to-rose-500",
    "Топ": "from-amber-400 to-orange-500",
    "Новое": "from-violet-500 to-purple-600",
  };
  return (
    <span className={`absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${colors[tag] || "from-gray-500 to-gray-600"} shadow`}>
      {tag}
    </span>
  );
}

function ListingCard({
  listing,
  onFavorite,
}: {
  listing: typeof listings[0];
  onFavorite: (id: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm card-hover border border-gray-100">
      <div className="relative h-52 overflow-hidden">
        <img src={listing.img} alt={listing.title} className="w-full h-full object-cover" />
        <TagBadge tag={listing.tag} />
        <button
          onClick={() => onFavorite(listing.id)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center transition-transform hover:scale-110"
        >
          <Icon
            name="Heart"
            size={18}
            className={listing.favorite ? "text-red-500 fill-red-500" : "text-white"}
          />
        </button>
        <div className="absolute bottom-3 left-3 glass rounded-xl px-2.5 py-1 text-white text-xs font-medium">
          {listing.type}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-montserrat font-bold text-gray-900 text-base leading-tight">{listing.title}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <Icon name="Star" size={13} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-gray-800">{listing.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <Icon name="MapPin" size={13} />
          <span>{listing.city}</span>
          <span className="mx-1">·</span>
          <span>{listing.rooms} комн.</span>
          <span className="mx-1">·</span>
          <span>{listing.reviews} отзывов</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-montserrat font-black text-xl gradient-text">{listing.price.toLocaleString("ru")} ₽</span>
            <span className="text-gray-400 text-sm"> / сут.</span>
          </div>
          <button className="btn-gradient text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md">
            Забронировать
          </button>
        </div>
      </div>
    </div>
  );
}

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG_HERO} alt="Аренда жилья" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-purple-800/60 to-pink-700/50" />
        </div>
        <div className="absolute top-32 right-20 w-72 h-72 rounded-full bg-pink-500/20 blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-violet-500/20 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <div className="max-w-2xl animate-fade-in">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-white/90 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Более 12 000 объектов по всей России
            </div>
            <h1 className="font-montserrat font-black text-5xl sm:text-6xl text-white leading-tight mb-6">
              Найди идеальное
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-amber-300">
                место для жизни
              </span>
            </h1>
            <p className="text-white/80 text-lg mb-10 font-golos leading-relaxed">
              Тысячи проверенных объектов аренды — квартиры, дома, виллы. Бронируй напрямую у владельцев без комиссии.
            </p>

            <div className="glass rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-3 bg-white/90 rounded-xl px-4 py-3 flex-1">
                <Icon name="MapPin" size={18} className="text-violet-500 shrink-0" />
                <input
                  placeholder="Город или район"
                  className="bg-transparent outline-none text-gray-800 placeholder-gray-400 w-full font-golos text-sm"
                />
              </div>
              <div className="flex items-center gap-3 bg-white/90 rounded-xl px-4 py-3 flex-1 sm:max-w-[180px]">
                <Icon name="Calendar" size={18} className="text-pink-500 shrink-0" />
                <input
                  placeholder="Даты"
                  className="bg-transparent outline-none text-gray-800 placeholder-gray-400 w-full font-golos text-sm"
                />
              </div>
              <button
                onClick={() => setPage("catalog")}
                className="btn-gradient font-montserrat font-bold text-sm px-6 py-3 rounded-xl shadow-xl"
              >
                Найти
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex gap-6 overflow-x-auto pb-2">
              {[
                { val: "12 000+", label: "объектов" },
                { val: "98%", label: "довольных гостей" },
                { val: "0%", label: "комиссия" },
                { val: "24/7", label: "поддержка" },
              ].map((s) => (
                <div key={s.label} className="glass rounded-2xl px-5 py-3 text-white shrink-0">
                  <div className="font-montserrat font-black text-2xl">{s.val}</div>
                  <div className="text-white/70 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-violet-600 font-semibold text-sm uppercase tracking-widest mb-2">Категории</p>
            <h2 className="font-montserrat font-black text-3xl text-gray-900">Выбери тип жилья</h2>
          </div>
          <button onClick={() => setPage("catalog")} className="text-violet-600 font-semibold text-sm hover:underline flex items-center gap-1">
            Все объекты <Icon name="ArrowRight" size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: "Building2", label: "Квартиры", count: "5 200+", color: "from-violet-500 to-purple-600" },
            { icon: "Home", label: "Дома", count: "3 100+", color: "from-pink-500 to-rose-600" },
            { icon: "Hotel", label: "Виллы", count: "840+", color: "from-amber-400 to-orange-500" },
            { icon: "Tent", label: "Глэмпинг", count: "620+", color: "from-emerald-400 to-teal-600" },
          ].map((cat) => (
            <button
              key={cat.label}
              onClick={() => setPage("catalog")}
              className="group relative overflow-hidden rounded-2xl p-6 text-left card-hover bg-white border border-gray-100 shadow-sm"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon name={cat.icon} size={22} className="text-white" />
              </div>
              <div className="font-montserrat font-bold text-gray-900 text-base">{cat.label}</div>
              <div className="text-gray-500 text-sm mt-1">{cat.count}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-pink-500 font-semibold text-sm uppercase tracking-widest mb-2">Популярное</p>
            <h2 className="font-montserrat font-black text-3xl text-gray-900">Топ объекты</h2>
          </div>
          <button onClick={() => setPage("catalog")} className="text-violet-600 font-semibold text-sm hover:underline flex items-center gap-1">
            Смотреть все <Icon name="ArrowRight" size={16} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.slice(0, 3).map((l) => (
            <ListingCard key={l.id} listing={l} onFavorite={() => {}} />
          ))}
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl gradient-brand p-12 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <h2 className="font-montserrat font-black text-3xl sm:text-4xl text-white mb-4">
              Сдаёшь жильё?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
              Размести объявление бесплатно и начни зарабатывать уже сегодня
            </p>
            <button className="bg-white text-violet-700 font-montserrat font-black px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-transform text-base">
              Разместить объявление
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-950 text-white py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="font-montserrat font-black text-2xl gradient-text mb-2">НаймиДом</div>
              <p className="text-gray-400 text-sm">Платформа аренды жилья без комиссий</p>
            </div>
            <div className="flex gap-8 text-gray-400 text-sm">
              <span className="hover:text-white cursor-pointer transition-colors">О нас</span>
              <span className="hover:text-white cursor-pointer transition-colors">Помощь</span>
              <span className="hover:text-white cursor-pointer transition-colors">Блог</span>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-gray-600 text-xs">
            © 2026 НаймиДом. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}

function CatalogPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Все");
  const [priceMax, setPriceMax] = useState(15000);
  const [favs, setFavs] = useState<Set<number>>(new Set([2, 5]));
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popular");

  const types = ["Все", "Квартира", "Студия", "Дом"];

  const toggleFav = (id: number) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const filtered = listings
    .map((l) => ({ ...l, favorite: favs.has(l.id) }))
    .filter((l) => {
      const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) || l.city.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "Все" || l.type === typeFilter;
      const matchPrice = l.price <= priceMax;
      const matchFav = !showFavOnly || favs.has(l.id);
      return matchSearch && matchType && matchPrice && matchFav;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="relative overflow-hidden py-12 mb-8">
        <div className="absolute inset-0 gradient-brand opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <p className="text-violet-600 font-semibold text-sm uppercase tracking-widest mb-2">Каталог</p>
          <h1 className="font-montserrat font-black text-4xl text-gray-900 mb-6">Все объекты аренды</h1>
          <div className="flex items-center gap-3 bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3 max-w-lg">
            <Icon name="Search" size={18} className="text-violet-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию или городу..."
              className="bg-transparent outline-none text-gray-800 placeholder-gray-400 w-full font-golos text-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                <Icon name="X" size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-20">
              <h2 className="font-montserrat font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Icon name="SlidersHorizontal" size={18} className="text-violet-500" />
                Фильтры
              </h2>

              <div className="mb-6">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">Тип жилья</p>
                <div className="flex flex-wrap gap-2">
                  {types.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                        typeFilter === t
                          ? "btn-gradient shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Макс. цена</p>
                  <span className="gradient-text font-montserrat font-bold text-sm">{priceMax.toLocaleString("ru")} ₽</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={15000}
                  step={500}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-violet-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1 000 ₽</span>
                  <span>15 000 ₽</span>
                </div>
              </div>

              <div className="mb-6">
                <button
                  onClick={() => setShowFavOnly(!showFavOnly)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    showFavOnly ? "btn-gradient" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Icon name="Heart" size={16} className={showFavOnly ? "text-white fill-white" : "text-red-400"} />
                  Только избранные
                  {favs.size > 0 && (
                    <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${showFavOnly ? "bg-white/20 text-white" : "bg-red-100 text-red-500"}`}>
                      {favs.size}
                    </span>
                  )}
                </button>
              </div>

              <button
                onClick={() => { setTypeFilter("Все"); setPriceMax(15000); setShowFavOnly(false); setSearch(""); }}
                className="w-full text-center text-violet-600 text-sm font-medium hover:underline"
              >
                Сбросить фильтры
              </button>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <p className="text-gray-500 text-sm font-golos">
                Найдено: <span className="font-bold text-gray-900">{filtered.length}</span> объектов
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-violet-200 font-golos"
              >
                <option value="popular">По популярности</option>
                <option value="rating">По рейтингу</option>
                <option value="price_asc">Сначала дешевле</option>
                <option value="price_desc">Сначала дороже</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Icon name="SearchX" size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="font-montserrat font-bold text-lg text-gray-500">Ничего не найдено</p>
                <p className="text-sm mt-2">Попробуйте изменить фильтры</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((l) => (
                  <ListingCard key={l.id} listing={l} onFavorite={toggleFav} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"bookings" | "favorites" | "settings">("bookings");
  const favListings = listings.filter((l) => [2, 5].includes(l.id)).map((l) => ({ ...l, favorite: true }));

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="relative overflow-hidden py-12 mb-8">
        <div className="absolute inset-0 gradient-brand opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center shadow-xl text-white font-montserrat font-black text-2xl">
              АМ
            </div>
            <div>
              <h1 className="font-montserrat font-black text-3xl text-gray-900">Алексей Морозов</h1>
              <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
                <Icon name="Mail" size={14} />
                alexey@example.com
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Icon name="Star" size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-sm font-semibold text-gray-700">4.9</span>
                <span className="text-gray-400 text-sm">· Проверенный пользователь</span>
              </div>
            </div>
            <button className="ml-auto hidden sm:flex items-center gap-2 btn-gradient px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg">
              <Icon name="Edit3" size={16} />
              Редактировать
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex gap-2 bg-gray-100 rounded-2xl p-1.5 mb-8 max-w-md">
          {[
            { id: "bookings", label: "Бронирования", icon: "Calendar" },
            { id: "favorites", label: "Избранное", icon: "Heart" },
            { id: "settings", label: "Настройки", icon: "Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id ? "btn-gradient shadow-md" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon name={tab.icon} size={15} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === "bookings" && (
          <div className="space-y-4">
            {[
              { title: "Апартаменты у моря", city: "Сочи", dates: "12–18 июня 2026", price: 27000, status: "Активно", img: IMG_HERO },
              { title: "Уютная студия", city: "Москва", dates: "2–5 апреля 2026", price: 8400, status: "Завершено", img: IMG_STUDIO },
            ].map((b) => (
              <div key={b.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row">
                <img src={b.img} alt={b.title} className="w-full sm:w-40 h-36 sm:h-auto object-cover shrink-0" />
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-montserrat font-bold text-gray-900">{b.title}</h3>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${b.status === "Активно" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
                      <Icon name="MapPin" size={12} /> {b.city}
                    </p>
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                      <Icon name="Calendar" size={12} /> {b.dates}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-montserrat font-black text-lg gradient-text">{b.price.toLocaleString("ru")} ₽</span>
                    {b.status === "Завершено" && (
                      <button className="text-violet-600 text-sm font-semibold flex items-center gap-1 hover:underline">
                        <Icon name="Star" size={14} /> Оставить отзыв
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "favorites" && (
          <div>
            <div className="flex items-center gap-2 mb-6 text-gray-500 text-sm">
              <Icon name="Heart" size={16} className="text-red-400 fill-red-400" />
              {favListings.length} сохранённых объекта
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favListings.map((l) => (
                <ListingCard key={l.id} listing={l} onFavorite={() => {}} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-lg">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              {[
                { label: "Имя", value: "Алексей Морозов", icon: "User" },
                { label: "Email", value: "alexey@example.com", icon: "Mail" },
                { label: "Телефон", value: "+7 900 123-45-67", icon: "Phone" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">{f.label}</label>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <Icon name={f.icon} size={16} className="text-violet-400 shrink-0" />
                    <span className="text-gray-800 text-sm font-golos">{f.value}</span>
                    <Icon name="Edit2" size={14} className="ml-auto text-gray-400" />
                  </div>
                </div>
              ))}
              <button className="w-full btn-gradient py-3 rounded-xl font-montserrat font-bold text-base shadow-lg mt-4">
                Сохранить изменения
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ContactsPage() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="relative overflow-hidden py-12 mb-12">
        <div className="absolute inset-0 gradient-brand opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <p className="text-violet-600 font-semibold text-sm uppercase tracking-widest mb-2">Связь</p>
          <h1 className="font-montserrat font-black text-4xl text-gray-900">Мы всегда на связи</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-6">Написать нам</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Ваше имя</label>
                <input
                  placeholder="Алексей Морозов"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-200 font-golos text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Email</label>
                <input
                  placeholder="alex@example.com"
                  type="email"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-200 font-golos text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Сообщение</label>
                <textarea
                  rows={5}
                  placeholder="Опишите ваш вопрос или предложение..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-200 font-golos text-sm resize-none"
                />
              </div>
              <button className="w-full btn-gradient py-4 rounded-2xl font-montserrat font-bold text-base shadow-xl">
                Отправить сообщение
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-6">Контактная информация</h2>
              <div className="space-y-4">
                {[
                  { icon: "Phone", label: "Телефон", value: "+7 800 123-45-67", sub: "Бесплатно по России" },
                  { icon: "Mail", label: "Email", value: "hello@naimdom.ru", sub: "Ответим в течение часа" },
                  { icon: "MapPin", label: "Адрес", value: "Москва, Арбат, 10", sub: "Пн–Пт, 9:00–19:00" },
                  { icon: "MessageCircle", label: "Телеграм", value: "@naimdom_support", sub: "Поддержка 24/7" },
                ].map((c) => (
                  <div key={c.label} className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover cursor-pointer">
                    <div className="w-11 h-11 rounded-xl gradient-brand flex items-center justify-center shrink-0 shadow-lg">
                      <Icon name={c.icon} size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{c.label}</div>
                      <div className="font-montserrat font-bold text-gray-900 mt-0.5">{c.value}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{c.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl p-6">
              <h3 className="font-montserrat font-bold text-gray-900 mb-4">Мы в соцсетях</h3>
              <div className="flex gap-3">
                {[
                  { icon: "Instagram", label: "Instagram" },
                  { icon: "Youtube", label: "YouTube" },
                  { icon: "Twitter", label: "VK" },
                ].map((s) => (
                  <button
                    key={s.label}
                    className="w-11 h-11 rounded-xl btn-gradient flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                  >
                    <Icon name={s.icon} size={18} className="text-white" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="font-montserrat font-black text-3xl text-gray-900 mb-8 text-center">Частые вопросы</h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              { q: "Как забронировать объект?", a: "Найдите подходящий вариант, выберите даты и нажмите «Забронировать». Всё просто!" },
              { q: "Нужно ли платить комиссию?", a: "Нет! Мы работаем без скрытых комиссий — платите только владельцу." },
              { q: "Как отменить бронь?", a: "В личном кабинете в разделе «Бронирования» нажмите кнопку отмены." },
              { q: "Как разместить объявление?", a: "Нажмите «Сдать жильё» на главной странице и заполните форму — займёт 5 минут." },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="font-montserrat font-bold text-gray-900 mb-2 flex items-start gap-2">
                  <span className="gradient-text shrink-0">Q</span>
                  {faq.q}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed pl-5">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage setPage={setPage} />;
      case "catalog": return <CatalogPage />;
      case "profile": return <ProfilePage />;
      case "contacts": return <ContactsPage />;
    }
  };

  return (
    <div className="font-golos bg-background">
      <Nav page={page} setPage={setPage} />
      <main>{renderPage()}</main>
    </div>
  );
}