import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Dumbbell, Utensils, Settings, ShieldCheck } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function Navigation() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <h1 className="text-lg sm:text-2xl font-bold text-primary truncate">
            Outdoor Team
          </h1>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex gap-3">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              size="lg"
              asChild
              className={location.pathname === "/" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}
            >
              <Link to="/">
                <Home className="h-5 w-5 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/training" ? "default" : "ghost"}
              size="lg"
              asChild
              className={location.pathname === "/training" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}
            >
              <Link to="/training">
                <Dumbbell className="h-5 w-5 mr-2" />
                Entrenamiento
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/nutrition" ? "default" : "ghost"}
              size="lg"
              asChild
              className={location.pathname === "/nutrition" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}
            >
              <Link to="/nutrition">
                <Utensils className="h-5 w-5 mr-2" />
                Nutrición
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/settings" ? "default" : "ghost"}
              size="lg"
              asChild
              className={location.pathname === "/settings" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}
            >
              <Link to="/settings">
                <Settings className="h-5 w-5 mr-2" />
                Configuración
              </Link>
            </Button>
            {user?.isAdmin && (
              <Button
                variant={location.pathname === "/admin" ? "default" : "ghost"}
                size="lg"
                asChild
                className={location.pathname === "/admin" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}
              >
                <Link to="/admin">
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  Admin
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="sm:hidden flex gap-1">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              size="sm"
              asChild
              className={`p-2 ${location.pathname === "/" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
            >
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/training" ? "default" : "ghost"}
              size="sm"
              asChild
              className={`p-2 ${location.pathname === "/training" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
            >
              <Link to="/training">
                <Dumbbell className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/nutrition" ? "default" : "ghost"}
              size="sm"
              asChild
              className={`p-2 ${location.pathname === "/nutrition" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
            >
              <Link to="/nutrition">
                <Utensils className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/settings" ? "default" : "ghost"}
              size="sm"
              asChild
              className={`p-2 ${location.pathname === "/settings" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
            >
              <Link to="/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
            {user?.isAdmin && (
              <Button
                variant={location.pathname === "/admin" ? "default" : "ghost"}
                size="sm"
                asChild
                className={`p-2 ${location.pathname === "/admin" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
              >
                <Link to="/admin">
                  <ShieldCheck className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
