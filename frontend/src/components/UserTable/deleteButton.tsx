'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface DeleteButtonProps {
  userId: number
}

export default function DeleteUserButton({ userId }: DeleteButtonProps) {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      const data = await response.json()
      toast.success(data.message, { duration: 5000 })
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
