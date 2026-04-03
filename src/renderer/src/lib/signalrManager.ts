import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
  RetryContext
} from '@microsoft/signalr'
import { URLs } from '@shared/config/url-config'
import log from 'electron-log/renderer'

type ConnectionStateCallback = (state: HubConnectionState) => void

class WebSocketManager {
  private static instance: WebSocketManager
  private connection: HubConnection
  private url: string
  private listeners: Set<ConnectionStateCallback> = new Set()

  private constructor() {
    this.url = URLs.itp.webSocket

    this.connection = new HubConnectionBuilder()
      .withUrl(this.url, {
        transport: HttpTransportType.WebSockets,
        skipNegotiation: true
      })
      .withKeepAliveInterval(30 * 1000) // 30 seconds
      .withServerTimeout(60 * 4 * 1000) // 4 minutes
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext: RetryContext) => {
          // retryContext.previousRetryCount: 已经尝试重连的次数
          // retryContext.elapsedMilliseconds: 已经过去的时间
          // retryContext.retryReason: 上次失败原因

          // 指数退避：1000ms -> 2000ms -> 4000ms -> 8000ms ...
          const delay = 1000 * Math.pow(2, retryContext.previousRetryCount);
          // 限制最大延迟为 5 分钟
          const nextRetryDelay = Math.min(delay, 5 * 60 * 1000);

          log.info(`重连第 ${retryContext.previousRetryCount + 1} 次...`)
          console.log(`重连第 ${retryContext.previousRetryCount + 1} 次...`)
          return nextRetryDelay
        }
      })
      .configureLogging(LogLevel.Information)
      .build()

    this.connection.onreconnecting(() => this.notifyListeners())
    this.connection.onreconnected(() => this.notifyListeners())
    this.connection.onclose(() => {
      console.info('SignalR connection closed')
      this.notifyListeners()
    })
  }

  public static getInstance(): WebSocketManager {
    if (!this.instance) {
      this.instance = new WebSocketManager()
    }
    return this.instance
  }

  public connect(callback: () => void): void {
    if (this.connection.state === HubConnectionState.Connected) {
      callback()
      return
    }

    try {
      this.connection.start().then(() => {
        console.info('SignalR connection started')
        this.notifyListeners()
        if (callback) callback()
      })
    } catch (err) {
      console.error('SignalR connection error:', err)
    }
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop()
      console.info('SignalR connection stopped')
    }
  }

  public async sendMessage(methodName: string, ...args: any[]): Promise<void> {
    if (this.connection && this.connection.state === HubConnectionState.Connected) {
      try {
        console.debug('send message: ', methodName, ...args)
        await this.connection.invoke(methodName, ...args)
      } catch (err) {
        console.error(`Error sending message: ${methodName}`, err)
      }
    }
  }

  public onEvent(eventName: string, callback: (data: any) => void): void {
    if (this.connection) {
      this.connection.on(eventName, callback)
    }
  }

  subscribe(callback: ConnectionStateCallback): void {
    this.listeners.add(callback)
    // 初始化时立即通知一次
    callback(this.connection.state)
  }

  unsubscribe(callback: ConnectionStateCallback): void {
    this.listeners.delete(callback)
  }

  private notifyListeners(): void {
    for (const callback of this.listeners) {
      callback(this.connection.state)
    }
  }
}

export const itpSocket = WebSocketManager.getInstance()
