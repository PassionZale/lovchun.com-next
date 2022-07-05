import ms from 'ms'

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

export const msToString = ({ prefix, time, suffix }) => {
  if (!time) return ''

  const result = ms(time, { long: true })
  const str = result
    .replace('days', '天')
    .replace('day', '天')
    .replace('minutes', '分钟')
    .replace('minute', '分钟')
    .replace('hours', '小时')
    .replace('hour', '小时')
    .replace('seconds', '秒')

  return `${prefix || ''}${str}${suffix || ''}`
}

export const getDNSPrefetchValue = (domain) => {
  if (!domain) return null
  if (domain.startsWith('http')) return domain.replace(/https?:/, '')
  if (domain.startsWith('//')) return domain
  return `//${domain}`
}

export const generateUnid = (function (prefix = '') {
  let uniqueIdIndex = 0
  return function () {
    return `${prefix}${(Math.random().toString(13).split('.')[1] || '').slice(
      0,
      8
    )}${(uniqueIdIndex += 1)}`
  }
})()
