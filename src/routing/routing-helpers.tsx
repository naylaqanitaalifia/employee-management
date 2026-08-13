import { type ComponentType, lazy, Suspense } from "react";
import { Outlet } from "react-router";
import { ScreenLoader } from "@/components/common/screen-loader";

export const lazyLayout = (
  importFn: () => Promise<{ Layout: ComponentType<any> }>,
) => {
  return lazy(() => importFn().then((m) => ({ default: m.Layout })));
};

export const lazyPage = (
  importFn: () => Promise<{ Page: ComponentType<any> }>,
) => {
  return lazy(() => importFn().then((m) => ({ default: m.Page })));
};

export const lazyNamed = <T extends Record<string, any>>(
  importFn: () => Promise<T>,
  exportName: keyof T,
) => {
  return lazy(() => importFn().then((m) => ({ default: m[exportName] })));
};

export function SuspenseOutlet() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <Outlet />
    </Suspense>
  );
}
