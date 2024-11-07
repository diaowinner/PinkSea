import type { Router } from 'vue-router'
import { useBreadcrumbBarStore } from '@/api/breadcrumb/store'
import type Crumb from '@/api/breadcrumb/crumb'

window.addEventListener('popstate', () => {
  const bar = useBreadcrumbBarStore();
  bar.pop = true;
});

export const withBreadcrumb = (router: Router) : void => {
  router.beforeEach((to, from, next) => {
    const bar = useBreadcrumbBarStore();
    if (bar.pop) {
      bar.crumbs.pop();
      bar.pop = false;
      next();
      return;
    }

    const maybeIndexOfExisting = bar.crumbs.findIndex((c: Crumb) => c.path === to.path);
    if (maybeIndexOfExisting > -1) {
      bar.crumbs.splice(maybeIndexOfExisting + 1);
      next();
      return;
    }

    const crumb: Crumb = {
      path: to.path,
      // @ts-expect-error This is 100% fine and I know it.
      name: to.meta.resolveBreadcrumb(to.params) as string
    };

    bar.crumbs.push(crumb);
    next();
  });
};