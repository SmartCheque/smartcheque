const isRole = (user: any, roleName: string) => {
  const result = user.roles.filter((role: string) => {
    if (role === roleName) {
      return true
    }
    return false
  })
  if (result.length > 0) {
    return true
  }
  return false
}

export const isAdmin = (user: any) => {
  return isRole(user, 'ROLE_ADMIN')
}

export const isModerator = (user: any) => {
  return isRole(user, 'ROLE_MODERATOR')
}
