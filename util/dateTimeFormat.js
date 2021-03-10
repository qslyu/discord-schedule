export default function DateTimeFormat (d) {
  return new Intl.DateTimeFormat(
    'ja-JP', 
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