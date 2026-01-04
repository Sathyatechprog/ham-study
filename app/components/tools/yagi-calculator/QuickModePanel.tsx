import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export type QuickPresetType = "metal_bonded" | "metal_insulated" | "pvc";

interface QuickModePanelProps {
  quickPreset: QuickPresetType;
  setQuickPreset: (v: QuickPresetType) => void;
}

export function QuickModePanel({
  quickPreset,
  setQuickPreset,
}: QuickModePanelProps) {
  return (
    <Card className="border-l-4 border-l-green-500 shadow-sm animate-in fade-in slide-in-from-top-2">
      <CardHeader className="">
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 hover:bg-green-100"
          >
            QUICK
          </Badge>
          <CardTitle className="text-sm">场景预设</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>动臂材质类型</Label>
          <Select
            value={quickPreset}
            onValueChange={(v) => setQuickPreset(v as QuickPresetType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metal_bonded">
                金属管 - 振子穿过并接触 (最常见)
              </SelectItem>
              <SelectItem value="metal_insulated">
                金属管 - 振子绝缘安装
              </SelectItem>
              <SelectItem value="pvc">PVC/PPR管 - 非金属</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            * 默认设置: 4mm 振子, 20mm 动臂, 折合振子, DL6WU 间距。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
