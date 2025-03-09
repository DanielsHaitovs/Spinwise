import CreateUserPopup from '@/components/UserTable/createUser'
import UsersTable from '@/components/UserTable/usersTable'

interface HomeProps {
  searchParams: Promise<{ page?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const sp = await searchParams
  const page = Number(sp.page) || 1

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Users</h1>
        <CreateUserPopup />
      </div>
      <UsersTable page={page} />
    </div>
  )
}
