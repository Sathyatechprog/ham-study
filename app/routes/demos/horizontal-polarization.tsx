import { ClientOnly } from "~/components/client-only";
import HorizontalPolarizationScene from "~/components/horizontal-polarization-scene";

export default function HorizontalPolarizationPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
         <h1 className="text-2xl font-bold">水平极化 (Horizontal Polarization)</h1>
         <p className="text-muted-foreground">天线理论可视化 (Antenna Theory Visualization)</p>
      </div>

      <div className="flex flex-col gap-6">
        <ClientOnly fallback={<div className="h-[450px] md:h-[600px] w-full flex items-center justify-center bg-slate-100 rounded-lg">加载 3D 场景中...</div>}>
          <HorizontalPolarizationScene />
        </ClientOnly>
        
        <div className="prose dark:prose-invert max-w-none">
          <h3>关于此演示</h3>
          <p>
            本可视化演示了来自水平极化偶极子天线 (Horizontal Dipole Antenna) 的电磁波传播。
            观察电场 (E-field) 矢量如何在波向外传播时左右（水平）振荡。
          </p>
          <ul>
             <li><strong>极化 (Polarization):</strong> 由电场 (E-field) 矢量的方向定义。</li>
             <li><strong>水平偶极子 (Horizontal Dipole):</strong> 产生水平极化的波。</li>
             <li><strong>传播 (Propagation):</strong> 虽然在垂直于导线的方向最强，但通常我们关注其相对于地面的水平特性。</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
