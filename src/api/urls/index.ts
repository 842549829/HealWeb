const PREFIX = 'api/net/basics'

const PermissionsUrl = {
  ModuleList: `${PREFIX}/permissions/module-list`,
  Routes: `${PREFIX}/permissions/routes`
}

const AccountsUrl = {
  Login: `${PREFIX}/accounts/login`
}

export const ApiUrls = {
  Permissions: PermissionsUrl,
  Accounts: AccountsUrl
}
