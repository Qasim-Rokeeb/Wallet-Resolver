
"use client";

import { usePathname } from 'next/navigation';
import breadcrumbs from '@/lib/breadcrumbs.json';

type Breadcrumb = {
  title: string;
  href: string;
};

export function useBreadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbSegments: Breadcrumb[] = [{ title: 'Home', href: '/' }];

  pathSegments.reduce((prevPath, currentSegment) => {
    const newPath = `${prevPath}/${currentSegment}`;
    const breadcrumb = (breadcrumbs as Record<string, Breadcrumb>)[newPath];
    if (breadcrumb) {
      breadcrumbSegments.push(breadcrumb);
    }
    return newPath;
  }, '');

  return breadcrumbSegments;
}
