import { NextResponse } from 'next/server'
import { UserService } from '@/lib/userService'
import { CreateUserDto } from '@/types/user'

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      throw new Error('User ID is required')
    }

    // Call your service method to delete the user.
    const result = await UserService.deleteUser(Number(id))

    return NextResponse.json({ message: result })
  } catch (error) {
    console.error('Error deleting user:', error)

    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      throw new Error('User ID is required')
    }

    const userData: Partial<CreateUserDto> = await request.json()

    const result = await UserService.updateUser(Number(id), userData)

    return NextResponse.json({
      message: `User ${result.email} updated successfully`,
    })
  } catch (error) {
    console.error('Error updating user:', error)

    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 },
    )
  }
}
