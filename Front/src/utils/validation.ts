const HTML_TAG_REGEX = /<[^>]*>/;
const DANGEROUS_REGEX = /(javascript:|vbscript:|data:text\/html|on\w+\s*=)/i;
// eslint-disable-next-line no-control-regex
const CONTROL_CHAR_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

export const sanitizeComment = (content: string): string =>
  content.replace(CONTROL_CHAR_REGEX, "").trim();

export const validateCommentContent = (content: string): string | null => {
  const length = [...content].length;
  if (length < 2) return "نظر بسیار کوتاه است";
  if (length > 2000) return "نظر بسیار طولانی است (حداکثر ۲۰۰۰ کاراکتر)";
  if (HTML_TAG_REGEX.test(content)) return "استفاده از تگ‌های HTML مجاز نیست";
  if (DANGEROUS_REGEX.test(content)) return "محتوای وارد شده مجاز نیست";
  return null;
};