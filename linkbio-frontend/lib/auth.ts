import { cookies } from "next/headers";

export async function getSession() {
  const accessToken = cookies().get("accessToken")?.value;
  if (!accessToken) return null;
  try {
    const backend = process.env.BACKEND_URL || "http://localhost:5000";
    const res = await fetch(`${backend}/api/auth/refresh`, {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${cookies().get("refreshToken")?.value}`,
      },
      credentials: "include",
    });
    if (!res.ok) return null;
    return { accessToken };
  } catch {
    return null;
  }
}
