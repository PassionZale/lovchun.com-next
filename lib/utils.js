const options = {
  weekday: 'short',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

export const getDateString = (date) => {
  const d = new Date(date)
  if (`${d}` === 'Invalid Date') return ''
  return new Date(date)
    .toLocaleString('zh-cn', options)
    .replace('日', '日, &nbsp;')
}
