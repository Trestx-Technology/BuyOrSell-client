export interface Blog {
  id: string;
  slug: string;
  title: string;
  title_ar?: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  excerpt_ar?: string;
  content: string;
  content_ar?: string;
  isHtml?: boolean;
}
