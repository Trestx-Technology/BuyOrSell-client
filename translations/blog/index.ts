import { createTranslationNamespace } from "../../validations/utils";
import type { BlogTranslations } from "./types";

export const blogTranslations =
  createTranslationNamespace<BlogTranslations>({
    "en": {
      title: "Blog | BuyOrSell",
      ourBlog: "Our Blog",
      blogDescription: "Stay updated with the latest trends in the UAE market.",
      loadingBlogs: "Loading blogs...",
      readMore: "Read More",
      postedOn: "Posted on",
    },
    "nl-NL": {
      title: "Blog | BuyOrSell",
      ourBlog: "Onze Blog",
      blogDescription: "Blijf op de hoogte van de nieuwste trends in de VAE-markt.",
      loadingBlogs: "Blogs laden...",
      readMore: "Lees meer",
      postedOn: "Geplaatst op",
    },
    nl: {
      title: "Blog | BuyOrSell",
      ourBlog: "Onze Blog",
      blogDescription: "Blijf op de hoogte van de nieuwste trends in de VAE-markt.",
      loadingBlogs: "Blogs laden...",
      readMore: "Lees meer",
      postedOn: "Geplaatst op",
    },
    ar: {
      title: "المدونة | BuyOrSell",
      ourBlog: "مدونتنا",
      blogDescription: "ابق على اطلاع بآخر التوجهات في سوق الإمارات.",
      loadingBlogs: "جاري تحميل المقالات...",
      readMore: "اقرأ المزيد",
      postedOn: "نُشر في",
    },
  });
