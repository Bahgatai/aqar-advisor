// Sample listings for the Aqar Advisor demo.
// IMPORTANT: This is a small illustrative dataset for the hackathon demo.
// Prices are rough market-style examples in EGP (late 2026), NOT real offers.
export const LISTINGS = [
  {
    id: "NC-101", title: "شقة في ماونتن فيو آي سيتي", city: "القاهرة الجديدة", district: "التجمع الخامس",
    type: "شقة", price: 4250000, rooms: 2, baths: 2, size: 115, finishing: "تشطيب كامل",
    payment: "تقسيط", downPayment: 425000, years: 8,
    features: ["كمبوند", "جيم", "أمن 24 ساعة", "قريبة من الجامعة الأمريكية"]
  },
  {
    id: "NC-102", title: "شقة في هايد بارك", city: "القاهرة الجديدة", district: "التجمع الخامس",
    type: "شقة", price: 6800000, rooms: 3, baths: 3, size: 165, finishing: "نصف تشطيب",
    payment: "تقسيط", downPayment: 680000, years: 9,
    features: ["كمبوند", "بحيرات صناعية", "مول تجاري قريب"]
  },
  {
    id: "NC-103", title: "ستوديو في eastown", city: "القاهرة الجديدة", district: "التجمع الخامس",
    type: "ستوديو", price: 2900000, rooms: 1, baths: 1, size: 62, finishing: "تشطيب كامل بالفرش",
    payment: "كاش أو تقسيط", downPayment: 290000, years: 6,
    features: ["مناسب للاستثمار والإيجار", "قريب من شارع التسعين"]
  },
  {
    id: "MC-201", title: "شقة في مدينتي", city: "مدينة المستقبل", district: "مدينتي",
    type: "شقة", price: 3100000, rooms: 3, baths: 2, size: 140, finishing: "تشطيب كامل",
    payment: "تقسيط", downPayment: 310000, years: 10,
    features: ["مواصلات داخلية", "مناطق تجارية", "مناسبة للسكن العائلي"]
  },
  {
    id: "MC-202", title: "شقة في البوسكو سيتي", city: "مدينة المستقبل", district: "المستقبل سيتي",
    type: "شقة", price: 3650000, rooms: 3, baths: 2, size: 135, finishing: "نصف تشطيب",
    payment: "تقسيط", downPayment: 365000, years: 8,
    features: ["كمبوند", "قريبة من العاصمة الإدارية"]
  },
  {
    id: "NCAP-301", title: "شقة في العاصمة الإدارية R7", city: "العاصمة الإدارية", district: "الحي السابع R7",
    type: "شقة", price: 3400000, rooms: 3, baths: 2, size: 150, finishing: "تشطيب كامل",
    payment: "تقسيط", downPayment: 340000, years: 10,
    features: ["قريبة من النهر الأخضر", "مدينة ذكية"]
  },
  {
    id: "OCT-401", title: "شقة في بادية بالم هيلز", city: "6 أكتوبر", district: "أكتوبر الجديدة",
    type: "شقة", price: 4550000, rooms: 3, baths: 2, size: 145, finishing: "نصف تشطيب",
    payment: "تقسيط", downPayment: 455000, years: 9,
    features: ["كمبوند", "مدارس دولية قريبة"]
  },
  {
    id: "OCT-402", title: "دوبلكس في جاردن هيلز", city: "6 أكتوبر", district: "الحي المتميز",
    type: "دوبلكس", price: 5200000, rooms: 4, baths: 3, size: 230, finishing: "تشطيب كامل",
    payment: "كاش", downPayment: null, years: null,
    features: ["حديقة خاصة", "حي هادئ", "مناسب لعائلة كبيرة"]
  },
  {
    id: "ZAY-501", title: "شقة في زيد ايست", city: "الشيخ زايد", district: "زايد الجديدة",
    type: "شقة", price: 7200000, rooms: 3, baths: 3, size: 155, finishing: "تشطيب كامل",
    payment: "تقسيط", downPayment: 720000, years: 8,
    features: ["كمبوند أورا", "قريبة من أركان بلازا"]
  },
  {
    id: "MAA-601", title: "شقة قديمة في المعادي", city: "المعادي", district: "دجلة المعادي",
    type: "شقة", price: 2400000, rooms: 2, baths: 1, size: 110, finishing: "تشطيب قديم يحتاج تحديث",
    payment: "كاش", downPayment: null, years: null,
    features: ["منطقة شجر وهادئة", "قريبة من الكورنيش", "سعر مناسب للمنطقة"]
  },
  {
    id: "NSR-701", title: "شقة في مصطفى النحاس", city: "مدينة نصر", district: "مصطفى النحاس",
    type: "شقة", price: 1850000, rooms: 2, baths: 1, size: 95, finishing: "تشطيب كامل",
    payment: "كاش", downPayment: null, years: null,
    features: ["قريبة من سيتي ستارز", "مواصلات كثيرة", "سعر اقتصادي"]
  },
  {
    id: "HEL-801", title: "شقة في شيراتون", city: "مصر الجديدة", district: "شيراتون المطار",
    type: "شقة", price: 2650000, rooms: 2, baths: 2, size: 105, finishing: "تشطيب كامل",
    payment: "كاش أو تقسيط", downPayment: 530000, years: 4,
    features: ["قريبة من المطار", "مناسبة للمغتربين"]
  }
];

export const AREAS_INDEX = {
  "التجمع": ["القاهرة الجديدة"], "التجمع الخامس": ["القاهرة الجديدة"], "القاهرة الجديدة": ["القاهرة الجديدة"],
  "مدينتي": ["مدينة المستقبل"], "المستقبل": ["مدينة المستقبل"], "مستقبل سيتي": ["مدينة المستقبل"],
  "العاصمة": ["العاصمة الإدارية"], "العاصمة الإدارية": ["العاصمة الإدارية"],
  "أكتوبر": ["6 أكتوبر"], "6 أكتوبر": ["6 أكتوبر"], "٦ أكتوبر": ["6 أكتوبر"],
  "زايد": ["الشيخ زايد"], "الشيخ زايد": ["الشيخ زايد"],
  "المعادي": ["المعادي"], "مدينة نصر": ["مدينة نصر"], "نصر": ["مدينة نصر"],
  "مصر الجديدة": ["مصر الجديدة"], "شيراتون": ["مصر الجديدة"], "المطار": ["مصر الجديدة"]
};
