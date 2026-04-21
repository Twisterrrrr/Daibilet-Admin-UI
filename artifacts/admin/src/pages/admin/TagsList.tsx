import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Tabs } from "@/components/shared/Tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Tag as TagIcon, Edit2, Trash2, Globe2, Eye, EyeOff, GitMerge, Sparkles, AlertTriangle } from "lucide-react";

type GroupKey = "audience" | "format" | "special" | "seasonal" | "mood" | "language";

interface TagGroup {
  key: GroupKey;
  label: string;
  description: string;
  color: string;
  isFilter: boolean;
  isMulti: boolean;
}

const groups: TagGroup[] = [
  { key: "audience", label: "Аудитория и возраст", description: "Возрастной рейтинг и целевая аудитория. Используется в фильтрах и в schema.org", color: "blue",   isFilter: true,  isMulti: false },
  { key: "format",   label: "Формат проведения",   description: "Online/offline, open-air, с переводом и пр. Видно в карточке и фильтрах",      color: "violet", isFilter: true,  isMulti: true  },
  { key: "special",  label: "Спецметки",            description: "Бесплатно, премьера, VIP, благотворительный, со скидкой. Подсветка в листинге", color: "amber",  isFilter: true,  isMulti: true  },
  { key: "seasonal", label: "Сезонные / тематические", description: "Новогоднее, летнее, ко Дню Победы — для подборок и SEO-лендингов",            color: "emerald",isFilter: false, isMulti: true  },
  { key: "mood",     label: "Настроение",           description: "Атмосферное, энергичное, душевное — для рекомендаций и промо",                   color: "pink",   isFilter: false, isMulti: true  },
  { key: "language", label: "Язык события",          description: "Казахский, русский, английский, на двух языках",                                 color: "sky",    isFilter: true,  isMulti: true  },
];

interface Tag {
  id: string;
  group: GroupKey;
  name: string;
  slug: string;
  emoji?: string;
  isVisible: boolean;
  isFilter: boolean;
  isSeoHub: boolean;
  eventsCount: number;
  venuesCount: number;
}

const mockTags: Tag[] = [
  // audience
  { id: "T-001", group: "audience", name: "0+",          slug: "0plus",      isVisible: true,  isFilter: true,  isSeoHub: false, eventsCount: 14,  venuesCount: 4 },
  { id: "T-002", group: "audience", name: "6+",          slug: "6plus",      isVisible: true,  isFilter: true,  isSeoHub: false, eventsCount: 22,  venuesCount: 0 },
  { id: "T-003", group: "audience", name: "12+",         slug: "12plus",     isVisible: true,  isFilter: true,  isSeoHub: false, eventsCount: 47,  venuesCount: 0 },
  { id: "T-004", group: "audience", name: "16+",         slug: "16plus",     isVisible: true,  isFilter: true,  isSeoHub: false, eventsCount: 84,  venuesCount: 0 },
  { id: "T-005", group: "audience", name: "18+",         slug: "18plus",     isVisible: true,  isFilter: true,  isSeoHub: false, eventsCount: 36,  venuesCount: 0 },
  { id: "T-006", group: "audience", name: "Семейный",    slug: "family",     emoji: "👨‍👩‍👧", isVisible: true, isFilter: true,  isSeoHub: true,  eventsCount: 38,  venuesCount: 5 },
  { id: "T-007", group: "audience", name: "Для детей",   slug: "for-kids",   emoji: "🧸",     isVisible: true,  isFilter: true,  isSeoHub: true,  eventsCount: 29,  venuesCount: 6 },

  // format
  { id: "T-010", group: "format",   name: "Open-air",     slug: "open-air",   emoji: "☀️",    isVisible: true,  isFilter: true,  isSeoHub: true,  eventsCount: 18,  venuesCount: 0 },
  { id: "T-011", group: "format",   name: "Online",        slug: "online",     emoji: "💻",    isVisible: true,  isFilter: true,  isSeoHub: false, eventsCount: 6,   venuesCount: 0 },
  { id: "T-012", group: "format",   name: "Stand-up",      slug: "standup",    emoji: "🎤",    isVisible: true,  isFilter: true,  isSeoHub: true,  eventsCount: 24,  venuesCount: 0 },
  { id: "T-013", group: "format",   name: "С переводом",   slug: "translated", isVisible: true,  isFilter: true,  isSeoHub: false, eventsCount: 4,   venuesCount: 0 },
  { id: "T-014", group: "format",   name: "Сидячие места", slug: "seated",     isVisible: true,  isFilter: true,  isSeoHub: false, eventsCount: 102, venuesCount: 0 },
  { id: "T-015", group: "format",   name: "Танцпол",        slug: "standing",   isVisible: true,  isFilter: true,  isSeoHub: false, eventsCount: 27,  venuesCount: 0 },

  // special
  { id: "T-020", group: "special",  name: "Бесплатно",     slug: "free",       emoji: "🆓",    isVisible: true,  isFilter: true,  isSeoHub: true,  eventsCount: 11,  venuesCount: 2 },
  { id: "T-021", group: "special",  name: "Премьера",      slug: "premiere",   emoji: "🎬",    isVisible: true,  isFilter: true,  isSeoHub: false, eventsCount: 7,   venuesCount: 0 },
  { id: "T-022", group: "special",  name: "VIP",            slug: "vip",        emoji: "⭐",    isVisible: true,  isFilter: false, isSeoHub: false, eventsCount: 12,  venuesCount: 1 },
  { id: "T-023", group: "special",  name: "Благотворительный", slug: "charity", emoji: "❤️",   isVisible: true,  isFilter: true,  isSeoHub: false, eventsCount: 5,   venuesCount: 0 },
  { id: "T-024", group: "special",  name: "Скидки до 50%", slug: "sale-50",    emoji: "💸",    isVisible: true,  isFilter: true,  isSeoHub: false, eventsCount: 3,   venuesCount: 0 },
  { id: "T-025", group: "special",  name: "Скидка для студентов", slug: "student-discount", isVisible: true, isFilter: true, isSeoHub: false, eventsCount: 8, venuesCount: 4 },

  // seasonal
  { id: "T-030", group: "seasonal", name: "Новогоднее",    slug: "new-year",   emoji: "🎄",    isVisible: true,  isFilter: false, isSeoHub: true,  eventsCount: 0,   venuesCount: 0 },
  { id: "T-031", group: "seasonal", name: "Наурыз",         slug: "nauryz",     emoji: "🌷",    isVisible: true,  isFilter: false, isSeoHub: true,  eventsCount: 9,   venuesCount: 0 },
  { id: "T-032", group: "seasonal", name: "Летнее",         slug: "summer",     emoji: "🌞",    isVisible: true,  isFilter: false, isSeoHub: true,  eventsCount: 21,  venuesCount: 0 },
  { id: "T-033", group: "seasonal", name: "День Победы",    slug: "victory-day",emoji: "🎖️",   isVisible: false, isFilter: false, isSeoHub: false, eventsCount: 0,   venuesCount: 0 },

  // mood
  { id: "T-040", group: "mood",     name: "Атмосферное",   slug: "atmospheric", isVisible: true, isFilter: false, isSeoHub: false, eventsCount: 18, venuesCount: 0 },
  { id: "T-041", group: "mood",     name: "Энергичное",     slug: "energetic",   isVisible: true, isFilter: false, isSeoHub: false, eventsCount: 24, venuesCount: 0 },
  { id: "T-042", group: "mood",     name: "Душевное",       slug: "soulful",     isVisible: true, isFilter: false, isSeoHub: false, eventsCount: 9,  venuesCount: 0 },
  { id: "T-043", group: "mood",     name: "Романтика",      slug: "romantic",    emoji: "💕",   isVisible: true, isFilter: false, isSeoHub: true,  eventsCount: 14, venuesCount: 0 },

  // language
  { id: "T-050", group: "language", name: "Қазақша",        slug: "kk",         isVisible: true,  isFilter: true,  isSeoHub: true,  eventsCount: 32,  venuesCount: 0 },
  { id: "T-051", group: "language", name: "Русский",        slug: "ru",         isVisible: true,  isFilter: true,  isSeoHub: false, eventsCount: 178, venuesCount: 0 },
  { id: "T-052", group: "language", name: "English",        slug: "en",         isVisible: true,  isFilter: true,  isSeoHub: false, eventsCount: 14,  venuesCount: 0 },
  { id: "T-053", group: "language", name: "На двух языках", slug: "bilingual",  isVisible: true,  isFilter: true,  isSeoHub: false, eventsCount: 8,   venuesCount: 0 },
];

const colorMap: Record<string, string> = {
  blue:    "bg-blue-100 text-blue-700 border-blue-200",
  violet:  "bg-violet-100 text-violet-700 border-violet-200",
  amber:   "bg-amber-100 text-amber-700 border-amber-200",
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  pink:    "bg-pink-100 text-pink-700 border-pink-200",
  sky:     "bg-sky-100 text-sky-700 border-sky-200",
};

export default function TagsList() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<GroupKey | "all">("all");
  const [visibility, setVisibility] = useState("all");

  const filtered = mockTags.filter((t) => {
    const m = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.slug.toLowerCase().includes(search.toLowerCase());
    return m && (tab === "all" || t.group === tab)
            && (visibility === "all" || (visibility === "visible" ? t.isVisible : !t.isVisible));
  });

  const stats = {
    total: mockTags.length,
    hidden: mockTags.filter(t => !t.isVisible).length,
    seoHubs: mockTags.filter(t => t.isSeoHub).length,
    unused: mockTags.filter(t => t.eventsCount === 0 && t.venuesCount === 0).length,
  };

  // group filtered tags by group key
  const grouped = (Object.keys({ all: 1 }) as ("all")[]).length, _ = grouped;
  const byGroup: Record<GroupKey, Tag[]> = groups.reduce((acc, g) => {
    acc[g.key] = filtered.filter(t => t.group === g.key);
    return acc;
  }, {} as Record<GroupKey, Tag[]>);

  return (
    <AdminLayout title="Теги" breadcrumbs={[{ label: "Администратор" }, { label: "Каталог" }, { label: "Теги" }]}>
      <PageHeader
        title="Теги"
        description={`${stats.total} тегов в ${groups.length} группах · ${stats.seoHubs} SEO-хабов · ${stats.hidden} скрыто · ${stats.unused} без использования`}
        actions={
          <>
            <Button variant="outline" size="sm" data-testid="button-merge-tags"><GitMerge className="w-4 h-4 mr-1.5" /> Объединить</Button>
            <Button size="sm" data-testid="button-create-tag"><Plus className="w-4 h-4 mr-1.5" /> Создать тег</Button>
          </>
        }
      />

      <div className="bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900 rounded-lg p-4 mb-4 text-sm text-violet-900 dark:text-violet-200">
        <p className="mb-2">
          <strong>Категории vs Теги.</strong> Категория описывает «что это» (Музыка → Рок), и у события <em>одна</em> категория.
          Теги — это <em>сквозные</em> признаки: возраст, формат, язык, спецметки, сезон. На событии может быть много тегов из разных групп.
        </p>
        <p>
          Теги влияют на: <strong>фильтры в каталоге</strong>, <strong>schema.org</strong> (audience/inLanguage), <strong>автоподборки</strong> и <strong>SEO-лендинги</strong> (например, <code className="bg-violet-100 dark:bg-violet-900/40 px-1 rounded">/almaty/open-air/</code>).
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <KCell label="Всего тегов" value={String(stats.total)} hint={`${groups.length} групп`} />
        <KCell label="SEO-хабы" value={String(stats.seoHubs)} hint="генерируют посадочные" accent="good" />
        <KCell label="Скрытых" value={String(stats.hidden)} hint="не видны посетителям" />
        <KCell label="Не используется" value={String(stats.unused)} hint="нет привязки" accent={stats.unused > 0 ? "warn" : undefined} />
      </div>

      <Tabs
        items={[
          { key: "all", label: "Все группы", count: stats.total },
          ...groups.map(g => ({ key: g.key, label: g.label, count: mockTags.filter(t => t.group === g.key).length })),
        ]}
        active={tab}
        onChange={(v) => setTab(v as GroupKey | "all")}
      />

      <FilterBar
        search={search} onSearchChange={setSearch}
        searchPlaceholder="Поиск по названию или slug..."
        filters={
          <Select value={visibility} onValueChange={setVisibility}>
            <SelectTrigger className="w-44" data-testid="select-tag-visibility"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все теги</SelectItem>
              <SelectItem value="visible">Видимые</SelectItem>
              <SelectItem value="hidden">Скрытые</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="flex flex-col gap-4">
        {groups.filter(g => tab === "all" || g.key === tab).map((group) => {
          const tags = byGroup[group.key];
          if (tags.length === 0 && tab === "all") return null;
          return (
            <div key={group.key} className="bg-card border border-card-border rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold">{group.label}</h3>
                    <span className="text-xs text-muted-foreground tabular-nums">{tags.length}</span>
                    {group.isFilter && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">видно в фильтрах</span>}
                    {group.isMulti
                      ? <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">multi</span>
                      : <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">single</span>}
                  </div>
                  <p className="text-xs text-muted-foreground max-w-2xl">{group.description}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs"><Plus className="w-3 h-3 mr-1" /> В группу</Button>
              </div>

              {tags.length === 0 ? (
                <p className="px-5 py-6 text-center text-xs text-muted-foreground">В этой группе нет тегов по фильтру</p>
              ) : (
                <div className="p-4 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <div
                      key={t.id}
                      className={`group inline-flex items-center gap-2 pl-2.5 pr-1.5 py-1 rounded-full border text-xs ${colorMap[group.color]} ${!t.isVisible ? "opacity-50" : ""}`}
                      data-testid={`tag-${t.id}`}
                    >
                      {t.emoji && <span>{t.emoji}</span>}
                      <span className="font-medium">{t.name}</span>
                      <span className="text-[10px] opacity-60 font-mono">/{t.slug}</span>
                      <span className="text-[10px] tabular-nums opacity-70">
                        · {t.eventsCount}{t.venuesCount > 0 ? `+${t.venuesCount}пл` : ""}
                      </span>
                      {t.isSeoHub && (
                        <span title="SEO-хаб: генерирует /city/slug/" className="inline-flex items-center text-[10px]">
                          <Globe2 className="w-3 h-3" />
                        </span>
                      )}
                      {!t.isVisible && (
                        <span title="Скрыт от посетителей" className="inline-flex items-center"><EyeOff className="w-3 h-3" /></span>
                      )}
                      {t.eventsCount === 0 && t.venuesCount === 0 && (
                        <span title="Не используется"><AlertTriangle className="w-3 h-3 text-amber-600" /></span>
                      )}
                      <span className="flex items-center gap-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 rounded hover:bg-white/40" title="Изменить" data-testid={`button-edit-tag-${t.id}`}>
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button className="p-1 rounded hover:bg-white/40" title={t.isVisible ? "Скрыть" : "Показать"}>
                          {t.isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                        <button className="p-1 rounded hover:bg-white/40 text-red-600" title="Удалить">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-card-border rounded-lg p-5 mt-4">
        <h3 className="text-sm font-semibold mb-2 inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-600" /> Авторазметка тегов
        </h3>
        <p className="text-xs text-muted-foreground mb-3 max-w-2xl">
          Система предлагает теги новому событию по названию и описанию. Просмотрите очередь предложений.
        </p>
        <div className="flex items-center justify-between text-sm">
          <span><strong>14</strong> событий ждут разметки · <strong>87%</strong> точность модели за 30 дней</span>
          <Button variant="outline" size="sm">Открыть очередь</Button>
        </div>
      </div>
    </AdminLayout>
  );
}

function KCell({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: "good" | "warn" }) {
  return (
    <div className="bg-card border border-card-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</span>
        <TagIcon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <p className={`text-xl font-semibold tabular-nums ${accent === "good" ? "text-emerald-600" : accent === "warn" ? "text-amber-600" : ""}`}>{value}</p>
      {hint && <p className="text-[10px] text-muted-foreground mt-0.5">{hint}</p>}
    </div>
  );
}
