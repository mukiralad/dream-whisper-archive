import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ProfileButton() {
  const { user, signOut } = useAuth()

  if (!user) return null

  const initials = user.email 
    ? user.email.substring(0, 2).toUpperCase()
    : "??"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem className="flex flex-col items-start">
          <div className="text-sm font-medium">{user.email}</div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={signOut} className="text-red-600 cursor-pointer">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 