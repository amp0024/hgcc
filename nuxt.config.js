const StoryblokClient = require('storyblok-js-client')

// !!! Change to your Storyblok preview token
const StoryblokToken = 'W1nIh8vrxUTcmXVkVEHLbAtt'

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Healthgrades - Command Center',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Readme examining the features of Command Center.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  router: {
    middleware: [ 'navigation-loader', 'cache-version-loader' ],
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        let position = {}
        if (to.matched.length < 2) {
          position = { x: 0, y: 0, offset: { x: 0, y: 80 } }
        } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
          position = { x: 0, y: 0 }
        }
        if (to.hash) {
          position = { selector: to.hash, offset: { x: 0, y: 80 } }
        }
        return position
      }
    }
  },
  css: [
    '@/assets/_variables.scss'
  ],
  plugins: [
    '@/plugins/components'
  ],
  modules: [
    ['storyblok-nuxt', {accessToken: 'W1nIh8vrxUTcmXVkVEHLbAtt', cacheProvider: 'memory'}]
  ],
  generate: {
    routes() {
      const client = new StoryblokClient({
        accessToken: StoryblokToken
      })

      let page = 1
      let routes = [
        '/',
        '/v1/menu',
        '/v1/',
        '/v1/hg-command-center-features/introduction',
        '/v1/hg-command-center-features/exporting'
      ]
      let results = []
      let count = 0
      let version = 'published'

      const getItems = (page = 1) => {
        return client.get('cdn/links', {
            version,
            page
          }).then(res => {
            let links = Object.values(res.data.links)
            results.push(...links)
            count += links.length

            if (count !== res.total && page <= Math.ceil(res.total / res.perPage)) {
              return getItems(page + 1)
            }
          })
      }

      return getItems()
        .then(() => {
          results.forEach((link) => {
            routes.push('/' + (link.slug == 'home' ? '' : link.slug))
          })
          return routes
        })
    }
  },
  build: {
    extend (config, { isDev, isClient }) {

    }
  }
}
