import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import PaginationControls from '@/components/UserTable/paginationControls'
import type { UsersResponse } from '@/types/user'
import DeleteUserButton from './deleteButton'
import { redirect } from 'next/navigation'
import EditUserButton from './editUserButton'
import { UserService } from '@/lib/userService'

/**
 * Props for the UsersTable component.
 *
 */
interface UsersTableProps {
  page: number
}

/**
 * UsersTable component displays a table of users with pagination.
 *
 */
export default async function UsersTable({ page }: UsersTableProps) {
  const limit = 5
  const usersData: UsersResponse = await UserService.fetchUsers(page, limit)
  const totalPages = Math.ceil(usersData.count / limit)

  // Redirect to the previous page if the current page has no users and is greater than 1
  if (usersData.data.length === 0 && page > 1) {
    redirect(`/?page=${page - 1}`)
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Users Table</h1>
      <h2>Amount: {usersData.count}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersData.data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            usersData.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <EditUserButton user={user} />
                    <DeleteUserButton userId={user.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <PaginationControls totalPages={totalPages} />
    </div>
  )
}
