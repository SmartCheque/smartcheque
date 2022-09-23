interface User {
  id: number
  email: string
  role: Array<number>
}

interface Role {
  id: number
  name: string
}

interface UserList {
  list: Array<User>
  roleList: Array<Role>
}

export type { User, Role, UserList }
