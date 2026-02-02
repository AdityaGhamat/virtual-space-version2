import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import Loadable from "../components/LoadAble";
import AuthProtectedRoutes from "../components/AuthProtection";
import RequireAuth from "../components/RequireAuth";
const Lobby = Loadable(lazy(() => import("../pages/lobby")));
const GameComponent = Loadable(
  lazy(() => import("../modules/game/components/GameComponent"))
);
const SignIn = Loadable(lazy(() => import("../modules/auth/pages/signin")));
const SignUp = Loadable(lazy(() => import("../modules/auth/pages/signup")));

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth>
        <Lobby />
      </RequireAuth>
    ),
  },
  {
    path: "/room/:roomId",
    element: (
      <RequireAuth>
        <GameComponent />
      </RequireAuth>
    ),
  },
  {
    path: "/login",
    element: (
      <AuthProtectedRoutes>
        <SignIn />
      </AuthProtectedRoutes>
    ),
  },
  {
    path: "/register",
    element: (
      <AuthProtectedRoutes>
        <SignUp />
      </AuthProtectedRoutes>
    ),
  },
]);
