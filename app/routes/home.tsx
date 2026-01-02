import { Link } from "react-router";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">业余无线电可视化</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>垂直极化 (Vertical Polarization)</CardTitle>
            <CardDescription>
              可视化垂直极化天线的电场传播 (Electric Field Propagation)。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-100 dark:bg-slate-800 h-32 rounded-md flex items-center justify-center text-muted-foreground text-sm">
              3D 预览
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/demos/vertical-polarization">查看演示</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>水平极化 (Horizontal Polarization)</CardTitle>
            <CardDescription>
               可视化水平极化天线的电场传播 (Electric Field Propagation)。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-100 dark:bg-slate-800 h-32 rounded-md flex items-center justify-center text-muted-foreground text-sm">
              3D 预览
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/demos/horizontal-polarization">查看演示</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>圆极化 (Circular Polarization)</CardTitle>
            <CardDescription>
               可视化电场矢量旋转的圆极化传播 (Circular Polarization)。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-100 dark:bg-slate-800 h-32 rounded-md flex items-center justify-center text-muted-foreground text-sm">
              3D 预览
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/demos/circular-polarization">查看演示</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>椭圆极化 (Elliptical Polarization)</CardTitle>
            <CardDescription>
               极化的一般形式，介于线极化和圆极化之间。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-100 dark:bg-slate-800 h-32 rounded-md flex items-center justify-center text-muted-foreground text-sm">
              3D 预览
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/demos/elliptical-polarization">查看演示</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
