import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/books',
      },
      {
        path: 'books',
        name: 'books',
        component: () => import('pages/BooksPage.vue'),
      },
      {
        path: 'authors',
        name: 'authors',
        component: () => import('pages/AuthorsPage.vue'),
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
