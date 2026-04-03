import { cn } from '@renderer/lib/utils'
import { UserRoundCog } from 'lucide-react'
import { JSX } from 'react'

const Profile = ({ className }: { className?: string }): JSX.Element => {
  const showProfile = (): void => {
    window.app.showProfile()
  }
  return (
    <div
      onClick={showProfile}
      className={cn('h-full w-10 flex justify-center items-center hover:bg-input', className)}
    >
      <UserRoundCog size={18} strokeWidth={1.5} />
    </div>
  )
}

export default Profile
