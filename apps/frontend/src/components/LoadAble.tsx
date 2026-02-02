import { Suspense } from "react";
import type { ComponentType } from "react";

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-white">
    <div className="animate-pulse font-mono text-xl">
      Initializing System...
    </div>
  </div>
);

const Loadable = <P extends object>(Component: ComponentType<P>) => {
  return (props: P) => (
    <Suspense fallback={<PageLoader />}>
      <Component {...props} />
    </Suspense>
  );
};

export default Loadable;
