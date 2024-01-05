const Divider = () => {
  return (
    <div className="my-8 w-full border-t border-gray-200 dark:border-gray-600" />
  )
}

const Year = ({ children }) => {
  return <h4>{children}</h4>
}

const Story = ({ title, children }) => {
  return (
    <>
      <div className="flex items-center text-green-700 dark:text-green-300">
        <span className="sr-only">Check</span>
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <path d="M22 4L12 14.01l-3-3" />
          </g>
        </svg>
        <p className="my-4 font-bold text-gray-900 dark:text-gray-100">
          {title}
        </p>
      </div>
      <div className="ml-6 text-gray-700 dark:text-gray-400">{children}</div>
    </>
  )
}

const sourceData = [
  {
    "year": 2024,
    "stories": [
      {
        "title": "转正",
        "content": "2024/01/04 6个月试用期好长好长，好痛好痛，好亏好亏"
      },
      
    ]
  },
  {
    "year": 2023,
    "stories": [
      {
        "title": "组件库",
        "content": "2023/11/10 磕磕绊绊写完了首个组件库"
      },
      {
        "title": "开猿节流",
        "content": "2023/02/28 武汉分公司倒闭了"
      }
    ]
  },
  {
    "year": 2022,
    "stories": [
      {
        "title": "张佑佑",
        "content": "2022/12/01 佑佑出生了，6斤八两"
      },
      {
        "title": "亲爱的小孩",
        "content": "2022/04/22 6周6天，欢迎你，我亲爱的小孩"
      },
      {
        "title": "重构网站",
        "content": "2022/03/20 Nextjs 重构网站，终于上线 🥳🥳🥳"
      },
      {
        "title": "虎年春节",
        "content": "2022/01/31 不用再抢票, 整个春节全家一起, 娘家外婆家来回串门"
      }
    ]
  },
  {
    "year": 2021,
    "stories": [
      {
        "title": "买车🚗",
        "content": "2021/05/04 提车啦"
      },
      {
        "title": "回家🏄",
        "content": "结束深漂, 返回武汉"
      }
    ]
  },
  {
    "year": 2020,
    "stories": [
      {
        "title": "Docker",
        "content": "Docker 部署真香, 再也不用担心把服务器环境弄的乱七八糟了"
      },
      {
        "title": "Nestjs",
        "content": "一款 Typescript Nodejs Framework, 使用它写了小程序流水线 API"
      },
      {
        "title": "CLI",
        "content": "开始着手开发脚手架, 写了一些非常有意思的小玩意, 主要服务于小程序原生开发的框架/自动化等"
      },
      {
        "title": "COVID-19",
        "content": "由于新冠, 近小半年的时间都是远程办公, 远程办公居然还更累, 几乎 24h on call, 身在武汉, 全家平安度过最疫情严重的时期, 回想一下真的非常幸运"
      }
    ]
  },
  {
    "year": 2019,
    "stories": [
      {
        "title": "灵智数科",
        "content": "入职灵智, 开始接触 React/Miniprogram"
      },
      {
        "title": "驾照🤣",
        "content": "历史 1 年, 终于拿到驾照"
      }
    ]
  },
  {
    "year": 2018,
    "stories": [
      {
        "title": "变强了一些",
        "content": "SPA 应用风起云涌，深度的使用 Gulp/Vuejs/Webpack 等前端新鲜技术"
      }
    ]
  },
  {
    "year": 2017,
    "stories": [
      {
        "title": "结婚🥳",
        "content": "4 年长跑终成正果"
      },
      {
        "title": "买房🏡",
        "content": "赶在房价风口, 提前上车"
      }
    ]
  },
  {
    "year": 2016,
    "stories": [
      {
        "title": "Linux",
        "content": "开始折腾服务器、域名, 零零散散的组装自己前后端技术栈"
      }
    ]
  },
  {
    "year": 2015,
    "stories": [
      {
        "title": "程序员🐒",
        "content": "正式成为一名程序员, 主要技术栈: PHP/Dojo/jQuery/Requirejs/Bootstrap"
      },
      {
        "title": "深圳",
        "content": "2015/01/21 开始深飘"
      }
    ]
  },
  {
    "year": 2014,
    "stories": [
      {
        "title": "接触编程👨🏻‍💻",
        "content": "Java: SpringMVC/SSH2"
      }
    ]
  },
  {
    "year": 2013,
    "stories": [
      {
        "title": "步入社会🏢",
        "content": "2009 - 2013 大学毕业咯"
      }
    ]
  },
  {
    "year": 1991,
    "stories": [
      {
        "title": "🏥",
        "content": "👶🍼  湖北武汉"
      }
    ]
  }
]

export default function Timeline({ sourceData }) {
  return (
    <>
      {sourceData.map(({ year, stories }, index) => {
        return (
          <div key={year}>
            <Year>{year}</Year>
            {stories.map(({ title, content }) => {
              return (
                <Story key={title} title={title}>
                  {content}
                </Story>
              )
            })}
            {index !== length - 1 && <Divider />}
          </div>
        )
      })}
    </>
  )
}
