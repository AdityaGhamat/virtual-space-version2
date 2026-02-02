import { api } from "../../../api/api";
import type { signInData, signUpData, AuthResponse } from "../type";
import type { IApiResponse } from "../../../types/api";

export async function signup(request: signUpData) {
  const res = await api.post<IApiResponse<AuthResponse>>(
    "/auth/register",
    request
  );
  return res.data;
}
export async function signin(request: signInData) {
  const res = await api.post<IApiResponse<AuthResponse>>(
    "/auth/login",
    request
  );
  return res.data;
}

export async function profile() {
  const res = await api.get<IApiResponse<AuthResponse>>("/auth/profile");
  return res.data;
}

export async function logout() {
  const res = await api.get<IApiResponse<any>>("/auth/logout");
  return res.data;
}

export async function createRoom(name: string) {
  const res = await api.post<IApiResponse<any>>("/room/create", {
    body: { name },
  });
  return res.data;
}
