import { Button } from '@renderer/components/ui/button'
import { Card, CardContent } from '@renderer/components/ui/card'
import { Input } from '@renderer/components/ui/input'
import { ArrowUp, Loader } from 'lucide-react'
import { FormEvent, JSX, useState } from 'react'
import { openInNewTab } from '@renderer/lib/utils'
import { useAuthHook } from '@renderer/hooks/useAuth'
import { URLs } from '@shared/config/url-config'

export const QuestionBox = (): JSX.Element => {
  const [question, setQuestion] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuthHook()

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    setIsSubmitting(true)
    e.preventDefault()
    if (question.trim() && !isSubmitting && user) {
      const url =
        URLs.llm.chat
          .replace('$token', user.token)
          .replace('$userId', user.id.toString())
          .replace('$secretId', user.secretId ?? '') +
        '&question=' +
        encodeURIComponent(question)
      await openInNewTab(url)
    }
    setQuestion('')
    setIsSubmitting(false)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl text-center mb-8">你好，我是你的工作助理</h2>
          <div className="relative">
            <Input
              className="pr-24 py-6 text-lg"
              placeholder="输入您的问题..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              disabled={!question.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                <ArrowUp className="size-4" />
              )}
              发送
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            示例：分析股票趋势、查看行业数据、获取市场资讯
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
