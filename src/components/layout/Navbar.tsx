"use client"

import { useSession } from "next-auth/react"
import { Menu, User } from "lucide-react"

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { data: session } = useSession()

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
      <button onClick={onMenuClick} className="lg:hidden">
        <Menu className="h-6 w-6 text-gray-600" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
          <p className="text-xs text-gray-500 capitalize">{session?.user?.role?.toLowerCase()}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-600">
          <User className="h-5 w-5" />
        </div>
      </div>
    </header>
  )
}
