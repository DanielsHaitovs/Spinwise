export type User = {
  id: number
  email: string
  firstName: string
  lastName: string
}

export interface CreateUserDto {
  firstName: string
  lastName: string
  email: string
}

export interface UsersResponse {
  count: number
  data: User[]
}
