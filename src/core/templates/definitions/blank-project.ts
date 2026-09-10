import type { CarouselTemplate } from "../template-definition";

export const blankTemplate: CarouselTemplate = {
  id: "blank",
  name: "تصميم فارغ",
  description: "ابدأ من الصفر بشريحة فارغة لتصميم حر بالكامل.",
  icon: "□",
  roles: [
    {
      id: "blank-slide",
      label: "شريحة 1",
      hint: "شريحة فارغة",
      layout: "cover",
    },
  ],
};
