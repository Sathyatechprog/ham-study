import { ArrowLeft } from "@phosphor-icons/react";
import { Link } from "react-router";
import { ClientOnly } from "../../components/client-only";
import { Button } from "../../components/ui/button";
import VerticalPolarizationScene from "../../components/vertical-polarization-scene";

export default function VerticalPolarizationPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
           <h1 className="text-2xl font-bold">Vertical Polarization</h1>
           <p className="text-muted-foreground">Antenna Theory Visualization</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <ClientOnly fallback={<div className="h-[600px] w-full flex items-center justify-center bg-slate-100 rounded-lg">Loading 3D Scene...</div>}>
          <VerticalPolarizationScene />
        </ClientOnly>
        
        <div className="prose dark:prose-invert max-w-none">
          <h3>About this Demo</h3>
          <p>
            This visualization demonstrates the electromagnetic wave propagation from a vertically polarized dipole antenna.
            Observe how the Electric Field (E-field) vector oscillates up and down (vertically) as the wave travels outwards.
          </p>
          <ul>
             <li><strong>Polarization:</strong> Defined by the orientation of the E-field vector.</li>
             <li><strong>Vertical Dipole:</strong> Produces vertically polarized waves.</li>
             <li><strong>Propagation:</strong> Omnidirectional in the horizontal plane (azimuth).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
