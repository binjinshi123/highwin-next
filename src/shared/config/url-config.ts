const isDev = process.env.NODE_ENV === "development"

export const URLs = {
  upms: {
    apiBase: isDev ? 'http://10.1.139.196:5001' : 'https://upmsapi.csmar.com:8190'
  },
  highwin: {
    apiBase: isDev ? 'http://10.1.240.46:5003' : 'https://win.csmar.com:7104',
    webBase: isDev ? 'http://10.1.240.46:5000/web' : 'https://win.csmar.com:7103/web'
  },
  helper: {
    apiBase: isDev ? 'http://10.1.240.46:5007' : 'https://win.csmar.com:7102'
  },
  itp: {
    apiBase: isDev ? 'http://10.1.139.98:11010' : 'https://vetp.csmar.com',
    webSocket: isDev ? 'wss://vetp.csmar.com/QuotationHub' : 'wss://vetp.csmar.com/QuotationHub'
  },
  llm: {
    apiBase: isDev ? 'http://10.222.21.157:6301' : 'http://graphqa.csmar.com:6301',
    chat: isDev
      ? 'http://10.1.240.46:5000/web/pages/ChatForHY/indexHy?token=$token&UserID=$userId&SecretID=$secretId&type=highwin&systemType=2&theme=primary'
      : 'https://win.csmar.com:17103/web/pages/ChatForHY/indexHy?token=$token&UserID=$userId&SecretID=$secretId&type=highwin&systemType=2&theme=primary'
  }
}
