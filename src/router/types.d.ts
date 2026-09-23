import 'vue-router'

export {}

declare module 'vue-router' {
  interface RouteMeta {
    titleKey:
      'pageTitle.workout' | 'pageTitle.programs' | 'pageTitle.history' | 'pageTitle.notFound'
  }
}
