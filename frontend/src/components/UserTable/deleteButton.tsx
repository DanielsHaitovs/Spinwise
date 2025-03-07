'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { UserService } from '@/lib/userService'
import { toast } from 'sonner'

/**
 * Props for the DeleteUserButton component.
 *
 */
interface DeleteButtonProps {
  userId: number
}

/**
 * DeleteUserButton component allows deleting a user.
 *
 */
export default function DeleteUserButton({ userId }: DeleteButtonProps) {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      const res = await UserService.deleteUser(userId)
      toast.success(res, { duration: 5000 })
      router.refresh()
    } catch (error) {
      console.error('Failed to delete user', error)
      toast.error('Failed to delete user', { duration: 5000 })
    }
  }

  return (
    <Button variant="destructive" onClick={handleDelete}>
      Delete
    </Button>
  )
}
