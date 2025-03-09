import { NextResponse } from 'next/server'
import { UserService } from '@/lib/userService'

export async function POST(request: Request) {
  try {
    const userData = await request.json()
    const result = await UserService.createUser(userData)

    return NextResponse.json({
      message: `User ${result.email} created successfully`,
    })
  } catch (e) {
    const error = e as Error

    // Return the error message as JSON instead of throwing an error
    return NextResponse.json(
      { error: error.message ?? 'An error occurred while creating the user' },
      { status: 500 },
    )
  }
}
