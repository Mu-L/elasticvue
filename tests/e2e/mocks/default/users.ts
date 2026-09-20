export const securityUsers = {
  url: 'http://localhost:9200/_security/user',
  json: {
    elastic: {
      username: 'elastic',
      roles: ['superuser'],
      full_name: 'Elastic Administrator',
      email: 'elastic@example.com',
      metadata: { _reserved: true },
      enabled: true
    },
    app_user: {
      username: 'app_user',
      roles: ['read_only', 'watcher_admin'],
      full_name: 'App User',
      email: 'app@example.com',
      metadata: {},
      enabled: true
    },
    disabled_user: {
      username: 'disabled_user',
      roles: ['viewer'],
      full_name: 'Disabled User',
      email: 'disabled@example.com',
      metadata: {},
      enabled: false
    }
  }
}

export const securityRoles = {
  url: 'http://localhost:9200/_security/role',
  json: {
    superuser: { cluster: ['all'] },
    read_only: { cluster: ['monitor'] },
    watcher_admin: { cluster: ['monitor'] },
    viewer: { indices: [] }
  }
}

export const opensearchInternalUsers = {
  url: 'http://localhost:9200/_plugins/_security/api/internalusers',
  json: {
    admin: {
      reserved: true,
      hidden: false,
      backend_roles: ['admin'],
      opendistro_security_roles: [],
      static: true
    },
    app_user: {
      reserved: false,
      hidden: false,
      backend_roles: ['read_only'],
      opendistro_security_roles: ['watcher_admin'],
      static: false
    }
  }
}
