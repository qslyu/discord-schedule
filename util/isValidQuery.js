export default function isValidQuery(query) {
  if(!query) return false

  if(query[0] == '[' && query.substr(-1) == ']') return false

  return true
}