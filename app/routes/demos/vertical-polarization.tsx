import { ClientOnly } from "~/components/client-only";
import VerticalPolarizationScene from "~/components/vertical-polarization-scene";

export default function VerticalPolarizationPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
         <h1 className="text-2xl font-bold">垂直极化 (Vertical Polarization)</h1>
         <p className="text-muted-foreground">天线理论可视化 (Antenna Theory Visualization)</p>
      </div>

      <div className="flex flex-col gap-6">
        <ClientOnly fallback={<div className="h-[450px] md:h-[600px] w-full flex items-center justify-center bg-slate-100 rounded-lg">加载 3D 场景中...</div>}>
          <VerticalPolarizationScene />
        </ClientOnly>
        
        <div className="prose dark:prose-invert max-w-none">
          <h3>关于此演示</h3>
          <p>
            本可视化演示了来自垂直极化偶极子天线 (Dipole Antenna) 的电磁波传播。
            观察电场 (E-field) 矢量如何在波向外传播时上下（垂直）振荡。
          </p>
          <ul>
             <li><strong>极化 (Polarization):</strong> 由电场 (E-field) 矢量的方向定义。</li>
             <li><strong>垂直偶极子 (Vertical Dipole):</strong> 产生垂直极化的波。</li>
             <li><strong>传播 (Propagation):</strong> 在水平面 (Azimuth) 上是全向的 (Omnidirectional)。</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
