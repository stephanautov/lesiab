// path: app/page.tsx
import { redirect } from "next/navigation";

export default function Index() {
  redirect("/home");
}
