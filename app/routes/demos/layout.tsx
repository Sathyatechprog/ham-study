import { ArrowLeft, House } from "@phosphor-icons/react";
import { Link, Outlet, useLocation } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export default function DemosLayout() {
  const location = useLocation();

  // Simple mapping for demo names, in a real app this might be dynamic or route handle based
  const demoNameMap: Record<string, string> = {
    "vertical-polarization": "垂直极化 (Vertical Polarization)",
    "horizontal-polarization": "水平极化 (Horizontal Polarization)",
  };

  const currentPath = location.pathname.split("/").pop() || "";
  const currentName = demoNameMap[currentPath] || "演示";

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="h-8 w-8">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">返回</span>
            </Link>
          </Button>
          
          <Separator orientation="vertical" />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center gap-2">
                    <House className="h-4 w-4" />
                    首页
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      
      <main>
        <Outlet />
      </main>
    </div>
  );
}
