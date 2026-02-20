import { Outlet, NavLink } from 'react-router-dom'

export default function AppShell() {
  return (
    <div className="flex h-screen w-screen bg-background text-foreground">
      
      {/* Sidebar */}
      <aside className="w-48 flex-shrink-0 border-r border-border flex flex-col p-4 gap-2">
        <h1 className="text-lg font-bold mb-4">Origin Forme Dex</h1>
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}
        >
          Home
        </NavLink>
        <NavLink 
          to="/dex"
          className={({ isActive }) => isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}
        >
          Dex
        </NavLink>
        <NavLink 
          to="/collection"
          className={({ isActive }) => isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}
        >
          Collection
        </NavLink>
        <NavLink 
          to="/settings"
          className={({ isActive }) => isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}
        >
          Settings
        </NavLink>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>

    </div>
  )
}