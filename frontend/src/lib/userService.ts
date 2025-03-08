import type { CreateUserDto, User, UsersResponse } from '@/types/user'

/**
 * UserService class provides methods to interact with the user API.
 */
export class UserService {
  // private static INTERNAL_API_URL = process.env.INTERNAL_API_URL
  static API_BASE_URL = process.env.EXTERNAL_API_URL

  /**
   * Creates a new user.
   * @param {CreateUserDto} userData - The data for the new user.
   * @returns {Promise<User>} The created user.
   * @throws Will throw an error if the user creation fails.
   */
  static async createUser(userData: CreateUserDto): Promise<User> {
    const res = await fetch(`${this.API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })

    if (!res.ok) {
      throw new Error('Failed to create user')
    }

    return res.json()
  }

  /**
   * Updates an existing user.
   * @param {number} id - The ID of the user to update.
   * @param {Partial<CreateUserDto>} updateData - The data to update the user with.
   * @returns {Promise<User>} The updated user.
   * @throws Will throw an error if the user update fails.
   */
  static async updateUser(
    id: number,
    updateData: Partial<CreateUserDto>,
  ): Promise<User> {
    const res = await fetch(`${this.API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    })

    if (!res.ok) {
      throw new Error('Failed to update user')
    }

    return res.json()
  }

  /**
   * Fetches a list of users with pagination.
   * @param {number} page - The page number to fetch.
   * @param {number} limit - The number of users per page.
   * @returns {Promise<UsersResponse>} The response containing the users and the total count.
   * @throws Will throw an error if the user fetch fails.
   */
  static async fetchUsers(page: number, limit: number): Promise<UsersResponse> {
    const res = await fetch(
      `${this.API_BASE_URL}/users/by?page=${page}&limit=${limit}`,
      { cache: 'no-store' },
    )

    if (!res.ok) {
      throw new Error('Failed to fetch users from external API')
    }

    return res.json()
  }

  /**
   * Deletes a user by ID.
   * @param {number} id - The ID of the user to delete.
   * @returns {Promise<string>} The response message.
   * @throws Will throw an error if the user deletion fails.
   */
  static async deleteUser(id: number): Promise<string> {
    const res = await fetch(`${this.API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      throw new Error('Failed to delete user')
    }

    return res.text()
  }
}
