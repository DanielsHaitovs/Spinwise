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

      // Check if the response indicates an error
      if (!response.ok) {
        const { error } = await response.json()

        toast.error(error, { duration: 5000 })
        return // Stop further processing if there was an error
      }

      const { message } = await response.json()
      toast.success(message, { duration: 5000 })
      router.refresh()
    } catch (e) {
      toast.error('An unexpected error occurred when trying to delete user', {
        duration: 5000,
      })
    }
  }

  return (
    <Button variant="destructive" onClick={handleDelete}>
      Delete
    </Button>
  )
}
