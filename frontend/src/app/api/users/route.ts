import { NextResponse } from 'next/server'
import { UserService } from '@/lib/userService'

export async function POST(request: Request) {
  try {
    const userData = await request.json()

    const result = await UserService.createUser(userData)

    return NextResponse.json({
      message: `User ${result.email} created successfully`,
    })
  } catch (error) {
    console.error('Error creating user:', error)

    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 },
    )
  }
}
