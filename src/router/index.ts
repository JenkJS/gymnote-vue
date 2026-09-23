import { i18n } from '@/i18n'
import { watch } from 'vue'
import { createRouter, createWebHistory, type RouteMeta, type RouteRecordRaw } from 'vue-router'

export const ROUTE_NAMES = {
  workout: 'workout',
  history: 'history',
  programs: 'programs',
  notFound: 'not-found',
} as const

const routes = [
  {
    path: '/',
    name: ROUTE_NAMES.workout,
    component: () => import('@/views/WorkoutView.vue'),
    meta: {
      titleKey: 'pageTitle.workout',
    },
  },
  {
    path: '/history',
    name: ROUTE_NAMES.history,
    component: () => import('@/views/HistoryView.vue'),
    meta: {
      titleKey: 'pageTitle.history',
    },
  },
  {
    path: '/programs',
    name: ROUTE_NAMES.programs,
    component: () => import('@/views/ProgramsView.vue'),
    meta: {
      titleKey: 'pageTitle.programs',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: ROUTE_NAMES.notFound,
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      titleKey: 'pageTitle.notFound',
    },
  },
] satisfies RouteRecordRaw[]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
function updateDocumentTitle(titleKey: RouteMeta['titleKey']) {
  const pageTitle = i18n.global.t(titleKey)

  document.title = `${pageTitle} — GYMNOTE`
}

router.afterEach((to) => {
  updateDocumentTitle(to.meta.titleKey)
})

watch(i18n.global.locale, () => {
  updateDocumentTitle(router.currentRoute.value.meta.titleKey)
})
