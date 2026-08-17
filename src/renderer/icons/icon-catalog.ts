import type { IconName } from "@/core/document";

// Curated Lucide icon paths. See third-party/icon-licenses/lucide.txt.

export interface IconNodeDefinition {
  tag: "path" | "circle" | "line" | "rect" | "ellipse" | "polyline" | "polygon";
  attrs: Readonly<Record<string, string>>;
}

export interface IconDefinition {
  name: IconName;
  label: string;
  category: string;
  keywords: string;
  nodes: readonly IconNodeDefinition[];
}

export const ICON_CATALOG: readonly IconDefinition[] = [
  {
    name: "sparkles",
    label: "لمعان",
    category: "عام",
    keywords: "sparkles magic ai لمعان سحر",
    nodes: [{"tag":"path","attrs":{"d":"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}},{"tag":"path","attrs":{"d":"M20 2v4"}},{"tag":"path","attrs":{"d":"M22 4h-4"}},{"tag":"circle","attrs":{"cx":"4","cy":"20","r":"2"}}],
  },
  {
    name: "star",
    label: "نجمة",
    category: "عام",
    keywords: "star favorite نجمة مفضل",
    nodes: [{"tag":"path","attrs":{"d":"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"}}],
  },
  {
    name: "heart",
    label: "قلب",
    category: "عام",
    keywords: "heart love قلب حب",
    nodes: [{"tag":"path","attrs":{"d":"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"}}],
  },
  {
    name: "circle-check",
    label: "نجاح",
    category: "عام",
    keywords: "check success done نجاح تم",
    nodes: [{"tag":"circle","attrs":{"cx":"12","cy":"12","r":"10"}},{"tag":"path","attrs":{"d":"m9 12 2 2 4-4"}}],
  },
  {
    name: "circle-x",
    label: "إلغاء",
    category: "عام",
    keywords: "x cancel error إلغاء خطأ",
    nodes: [{"tag":"circle","attrs":{"cx":"12","cy":"12","r":"10"}},{"tag":"path","attrs":{"d":"m15 9-6 6"}},{"tag":"path","attrs":{"d":"m9 9 6 6"}}],
  },
  {
    name: "circle-alert",
    label: "تنبيه",
    category: "عام",
    keywords: "alert warning تنبيه تحذير",
    nodes: [{"tag":"circle","attrs":{"cx":"12","cy":"12","r":"10"}},{"tag":"line","attrs":{"x1":"12","x2":"12","y1":"8","y2":"12"}},{"tag":"line","attrs":{"x1":"12","x2":"12.01","y1":"16","y2":"16"}}],
  },
  {
    name: "info",
    label: "معلومات",
    category: "عام",
    keywords: "info information معلومات",
    nodes: [{"tag":"circle","attrs":{"cx":"12","cy":"12","r":"10"}},{"tag":"path","attrs":{"d":"M12 16v-4"}},{"tag":"path","attrs":{"d":"M12 8h.01"}}],
  },
  {
    name: "lightbulb",
    label: "فكرة",
    category: "عام",
    keywords: "idea lightbulb فكرة",
    nodes: [{"tag":"path","attrs":{"d":"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"}},{"tag":"path","attrs":{"d":"M9 18h6"}},{"tag":"path","attrs":{"d":"M10 22h4"}}],
  },
  {
    name: "zap",
    label: "طاقة",
    category: "عام",
    keywords: "zap power fast طاقة سرعة",
    nodes: [{"tag":"path","attrs":{"d":"M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"}}],
  },
  {
    name: "rocket",
    label: "إطلاق",
    category: "عام",
    keywords: "rocket launch إطلاق",
    nodes: [{"tag":"path","attrs":{"d":"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"}},{"tag":"path","attrs":{"d":"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"}},{"tag":"path","attrs":{"d":"M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"}},{"tag":"path","attrs":{"d":"M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"}}],
  },
  {
    name: "code-xml",
    label: "كود",
    category: "تقنية",
    keywords: "code xml html كود برمجة",
    nodes: [{"tag":"path","attrs":{"d":"m18 16 4-4-4-4"}},{"tag":"path","attrs":{"d":"m6 8-4 4 4 4"}},{"tag":"path","attrs":{"d":"m14.5 4-5 16"}}],
  },
  {
    name: "terminal",
    label: "طرفية",
    category: "تقنية",
    keywords: "terminal shell cli طرفية",
    nodes: [{"tag":"path","attrs":{"d":"M12 19h8"}},{"tag":"path","attrs":{"d":"m4 17 6-6-6-6"}}],
  },
  {
    name: "database",
    label: "قاعدة بيانات",
    category: "تقنية",
    keywords: "database storage قاعدة بيانات",
    nodes: [{"tag":"ellipse","attrs":{"cx":"12","cy":"5","rx":"9","ry":"3"}},{"tag":"path","attrs":{"d":"M3 5V19A9 3 0 0 0 21 19V5"}},{"tag":"path","attrs":{"d":"M3 12A9 3 0 0 0 21 12"}}],
  },
  {
    name: "server",
    label: "خادم",
    category: "تقنية",
    keywords: "server backend خادم",
    nodes: [{"tag":"rect","attrs":{"width":"20","height":"8","x":"2","y":"2","rx":"2","ry":"2"}},{"tag":"rect","attrs":{"width":"20","height":"8","x":"2","y":"14","rx":"2","ry":"2"}},{"tag":"line","attrs":{"x1":"6","x2":"6.01","y1":"6","y2":"6"}},{"tag":"line","attrs":{"x1":"6","x2":"6.01","y1":"18","y2":"18"}}],
  },
  {
    name: "shield-check",
    label: "حماية",
    category: "تقنية",
    keywords: "shield security حماية أمان",
    nodes: [{"tag":"path","attrs":{"d":"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"}},{"tag":"path","attrs":{"d":"m9 12 2 2 4-4"}}],
  },
  {
    name: "lock",
    label: "قفل",
    category: "تقنية",
    keywords: "lock privacy قفل خصوصية",
    nodes: [{"tag":"rect","attrs":{"width":"18","height":"11","x":"3","y":"11","rx":"2","ry":"2"}},{"tag":"path","attrs":{"d":"M7 11V7a5 5 0 0 1 10 0v4"}}],
  },
  {
    name: "user",
    label: "مستخدم",
    category: "تواصل",
    keywords: "user person مستخدم شخص",
    nodes: [{"tag":"path","attrs":{"d":"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"}},{"tag":"circle","attrs":{"cx":"12","cy":"7","r":"4"}}],
  },
  {
    name: "users",
    label: "مستخدمون",
    category: "تواصل",
    keywords: "users team مستخدمون فريق",
    nodes: [{"tag":"path","attrs":{"d":"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"}},{"tag":"path","attrs":{"d":"M16 3.128a4 4 0 0 1 0 7.744"}},{"tag":"path","attrs":{"d":"M22 21v-2a4 4 0 0 0-3-3.87"}},{"tag":"circle","attrs":{"cx":"9","cy":"7","r":"4"}}],
  },
  {
    name: "mail",
    label: "بريد",
    category: "تواصل",
    keywords: "mail email بريد",
    nodes: [{"tag":"path","attrs":{"d":"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"}},{"tag":"rect","attrs":{"x":"2","y":"4","width":"20","height":"16","rx":"2"}}],
  },
  {
    name: "phone",
    label: "هاتف",
    category: "تواصل",
    keywords: "phone call هاتف اتصال",
    nodes: [{"tag":"path","attrs":{"d":"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"}}],
  },
  {
    name: "globe",
    label: "ويب",
    category: "تواصل",
    keywords: "globe web world ويب عالم",
    nodes: [{"tag":"circle","attrs":{"cx":"12","cy":"12","r":"10"}},{"tag":"path","attrs":{"d":"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"}},{"tag":"path","attrs":{"d":"M2 12h20"}}],
  },
  {
    name: "link",
    label: "رابط",
    category: "تواصل",
    keywords: "link url رابط",
    nodes: [{"tag":"path","attrs":{"d":"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}},{"tag":"path","attrs":{"d":"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"}}],
  },
  {
    name: "camera",
    label: "كاميرا",
    category: "وسائط",
    keywords: "camera photo كاميرا صورة",
    nodes: [{"tag":"path","attrs":{"d":"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"}},{"tag":"circle","attrs":{"cx":"12","cy":"13","r":"3"}}],
  },
  {
    name: "image",
    label: "صورة",
    category: "وسائط",
    keywords: "image photo صورة",
    nodes: [{"tag":"rect","attrs":{"width":"18","height":"18","x":"3","y":"3","rx":"2","ry":"2"}},{"tag":"circle","attrs":{"cx":"9","cy":"9","r":"2"}},{"tag":"path","attrs":{"d":"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"}}],
  },
  {
    name: "play",
    label: "تشغيل",
    category: "وسائط",
    keywords: "play video تشغيل فيديو",
    nodes: [{"tag":"path","attrs":{"d":"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"}}],
  },
  {
    name: "download",
    label: "تنزيل",
    category: "إجراءات",
    keywords: "download تنزيل",
    nodes: [{"tag":"path","attrs":{"d":"M12 15V3"}},{"tag":"path","attrs":{"d":"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}},{"tag":"path","attrs":{"d":"m7 10 5 5 5-5"}}],
  },
  {
    name: "upload",
    label: "رفع",
    category: "إجراءات",
    keywords: "upload رفع",
    nodes: [{"tag":"path","attrs":{"d":"M12 3v12"}},{"tag":"path","attrs":{"d":"m17 8-5-5-5 5"}},{"tag":"path","attrs":{"d":"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}}],
  },
  {
    name: "settings",
    label: "إعدادات",
    category: "إجراءات",
    keywords: "settings gear إعدادات",
    nodes: [{"tag":"path","attrs":{"d":"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"}},{"tag":"circle","attrs":{"cx":"12","cy":"12","r":"3"}}],
  },
  {
    name: "search",
    label: "بحث",
    category: "إجراءات",
    keywords: "search find بحث",
    nodes: [{"tag":"path","attrs":{"d":"m21 21-4.34-4.34"}},{"tag":"circle","attrs":{"cx":"11","cy":"11","r":"8"}}],
  },
  {
    name: "house",
    label: "رئيسية",
    category: "إجراءات",
    keywords: "home house رئيسية منزل",
    nodes: [{"tag":"path","attrs":{"d":"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"}},{"tag":"path","attrs":{"d":"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}}],
  },
  {
    name: "calendar",
    label: "تقويم",
    category: "إجراءات",
    keywords: "calendar date تقويم تاريخ",
    nodes: [{"tag":"path","attrs":{"d":"M8 2v3"}},{"tag":"path","attrs":{"d":"M16 2v3"}},{"tag":"rect","attrs":{"x":"3","y":"3","width":"18","height":"18","rx":"2"}},{"tag":"path","attrs":{"d":"M3 9h18"}}],
  },
  {
    name: "clock",
    label: "وقت",
    category: "إجراءات",
    keywords: "clock time وقت",
    nodes: [{"tag":"circle","attrs":{"cx":"12","cy":"12","r":"10"}},{"tag":"path","attrs":{"d":"M12 6v6l4 2"}}],
  },
  {
    name: "arrow-right",
    label: "سهم يمين",
    category: "أسهم",
    keywords: "arrow right سهم يمين",
    nodes: [{"tag":"path","attrs":{"d":"M5 12h14"}},{"tag":"path","attrs":{"d":"m12 5 7 7-7 7"}}],
  },
  {
    name: "arrow-left",
    label: "سهم يسار",
    category: "أسهم",
    keywords: "arrow left سهم يسار",
    nodes: [{"tag":"path","attrs":{"d":"m12 19-7-7 7-7"}},{"tag":"path","attrs":{"d":"M19 12H5"}}],
  },
  {
    name: "arrow-up",
    label: "سهم أعلى",
    category: "أسهم",
    keywords: "arrow up سهم أعلى",
    nodes: [{"tag":"path","attrs":{"d":"m5 12 7-7 7 7"}},{"tag":"path","attrs":{"d":"M12 19V5"}}],
  },
  {
    name: "arrow-down",
    label: "سهم أسفل",
    category: "أسهم",
    keywords: "arrow down سهم أسفل",
    nodes: [{"tag":"path","attrs":{"d":"M12 5v14"}},{"tag":"path","attrs":{"d":"m19 12-7 7-7-7"}}],
  },
];

const ICONS_BY_NAME = new Map(ICON_CATALOG.map((icon) => [icon.name, icon]));

export function getIconDefinition(name: IconName): IconDefinition {
  return ICONS_BY_NAME.get(name) ?? ICON_CATALOG[0]!;
}
