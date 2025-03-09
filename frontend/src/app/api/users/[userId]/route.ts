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
  } catch (e) {
    const error = e as Error

    // Return the error message as JSON instead of throwing an error
    return NextResponse.json(
      { error: error.message ?? 'An error occurred while deleting user' },
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
  } catch (e) {
    const error = e as Error

    // Return the error message as JSON instead of throwing an error
    return NextResponse.json(
      { error: error.message ?? 'An error occurred while updating user' },
      { status: 500 },
    )
  }
}
