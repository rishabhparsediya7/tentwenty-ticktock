// Root route: send authenticated users to the dashboard, everyone else to login.
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  redirect(session?.user ? "/dashboard" : "/login");
}
