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
import type { CreateUserDto } from '@/types/user'

/**
 * CreateUserPopup component allows creating a new user.
 *
 */
export default function CreateUserPopup() {
  const [open, setOpen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const router = useRouter()

  /**
   * Handles the form submission to create a new user.
   *
   */
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    const newUser: CreateUserDto = {
      firstName,
      lastName,
      email,
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })

      // Check if the response indicates an error
      if (!response.ok) {
        const { error } = await response.json()

        toast.error(error, { duration: 5000 })
        return // Stop further processing if there was an error
      }

      // If response is OK, get the success message
      const { message } = await response.json()

      toast.success(message, { duration: 5000 })
      setOpen(false)
      // Refresh the page to update the user list immediately
      router.refresh()
    } catch {
      toast.error('An unexpected error occurred when tried to create user', {
        duration: 5000,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new user.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Create User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
