// proxy
const proxyTable = {
  '/admin': {
    target: 'http://10.2.4.17:8040/',
    pathRewrite: {
      '^admin': '/admin'
    }
  },
  '/bill': {
    target: 'http://10.2.4.17:8040/',
    pathRewrite: {
      '^bill': '/bill'
    }
  },
  '/srm': {
    target: 'http://10.2.4.17:8040/',
    pathRewrite: {
      '^srm': '/srm'
    }
  },
  '/login': {
    target: 'http://10.2.4.17:8040/',
    pathRewrite: {
      '^login': '/login'
    }
  },
  '/auth': {
    target: 'http://10.2.4.17:8040/',
    pathRewrite: {
      '^auth': '/auth'
    }
  },
  '/static': {
    target: 'http://56hub-web-staging.missfresh.net/'
    // pathRewrite: {
    //   '^static': '/static'
    // }
  },
  '/apps.config.js': {
    target: 'http://56hub-web-staging.missfresh.net/'
  },
  '/brain': {
      target: 'http://56hub-web-staging.missfresh.net/',
    // target: 'http://localhost:8989',
  },
  '/sms': {
    // target: 'http://localhost:8989',
    // target: 'http://wuliu-ocean-gateway.b2.missfresh.net/',
    target: 'http://10.2.4.17:8040/'
  },
  '/dds/index': {
    target: 'http://56hub-web-staging.missfresh.net/',
    // target: 'http://localhost:8988',
    pathRewrite: {
      '^dds/index': '/dds/index'
    }
  },
  '/dds/routes': {
    target: 'http://56hub-web-staging.missfresh.net/',
    // target: 'http://localhost:8988',
    pathRewrite: {
      '^dds/routes': '/dds/routes'
    }
  },
  '/dds/js': {
    // target: 'http://localhost:8988',
    target: 'http://56hub-web-staging.missfresh.net/',
    pathRewrite: {
      '^dds/js': '/dds/js'
    }
  },
  '/dds': {
    // target: 'http://localhost:8989',
    // target: 'http://wuliu-ocean-gateway.b2.missfresh.net/',
    target: 'http://10.2.4.17:8040/'
  },
  '/uas': {
    target: 'http://56hub-web-staging.missfresh.net/'
  }, 
  '/cost-data/data/': {
    target: 'http://172.16.176.149:8080/'
  }
}
module.exports = proxyTable