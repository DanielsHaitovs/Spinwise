'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import type { User, CreateUserDto } from '@/types/user'

/**
 * Props for the EditUserButton component.
 *
 */
interface EditUserButtonProps {
  user: User
}

/**
 * EditUserButton component allows editing user details.
 *
 */
export default function EditUserButton({ user }: EditUserButtonProps) {
  const [open, setOpen] = useState(false)
  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [email, setEmail] = useState(user.email)
  const router = useRouter()

  /**
   * Handles the form submission to edit the user.
   *
   */
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()

    const updateData: Partial<CreateUserDto> = {
      firstName,
      lastName,
      email,
    }

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      // Check if the response indicates an error
      if (!response.ok) {
        const { error } = await response.json()

        toast.error(error, { duration: 5000 })
        return // Stop further processing if there was an error
      }

      const { message } = await response.json()

      toast.success(message, {
        duration: 10000,
      })

      setOpen(false)
      router.refresh()
    } catch {
      toast.error('An unexpected error occurred when tried to update user', {
        duration: 5000,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update the fields you wish to change.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditUser} className="space-y-4">
          <div>
            <label
              htmlFor="edit-firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              id="edit-firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="edit-lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              id="edit-lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="edit-email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Update User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
