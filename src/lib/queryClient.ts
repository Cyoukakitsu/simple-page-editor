import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// API エラーの通知はここに集約する。呼び出し側が onError を書き忘れても必ずトーストが出る
// 利用者に HTTP メソッドやステータスコードは意味がないので、どの操作でも同じ文言を出す
const notifyError = () =>
  toast.error('処理に失敗しました。時間をおいて再度お試しください')

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: notifyError }),
  mutationCache: new MutationCache({ onError: notifyError }),
})
