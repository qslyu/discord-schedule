export default function DateTimeFormat (d, locale) {
  return new Intl.DateTimeFormat(
    locale, 
    { 
      year:     'numeric', 
      month:    '2-digit', 
      day:      '2-digit', 
      weekday:  'long', 
      hour:     '2-digit', 
      minute:   '2-digit'
    }
  ).format(new Date(d))
}