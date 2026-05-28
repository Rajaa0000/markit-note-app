import Link from "next/link";
import { LogIn } from "lucide-react";

export default function SignButton() {
  return (
    <Link href="/login" className="app-button bg-[#5c7be8] text-white shadow-sm">
      <LogIn size={18} />
      Sign in
    </Link>
  );
}
