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
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Amateur Radio Visualizations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vertical Polarization</CardTitle>
            <CardDescription>
              Visualize the electric field propagation of a vertically polarized antenna.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-100 dark:bg-slate-800 h-32 rounded-md flex items-center justify-center text-muted-foreground text-sm">
              3D Preview
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/demos/vertical-polarization">View Demo</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
