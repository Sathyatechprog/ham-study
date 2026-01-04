import { QuestionIcon } from "@phosphor-icons/react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type {
  BoomShape,
  DrivenElementType,
  MountMethod,
  SpacingType,
} from "~/lib/yagi-calc";

interface ProModePanelProps {
  proBoomShape: BoomShape;
  setProBoomShape: (v: BoomShape) => void;
  proElDia: number;
  setProElDia: (v: number) => void;
  proBoomDia: number;
  setProBoomDia: (v: number) => void;
  proMountMethod: MountMethod;
  setProMountMethod: (v: MountMethod) => void;
  proManualBCFactor: number | undefined;
  setProManualBCFactor: (v: number | undefined) => void;
  proDeType: DrivenElementType;
  setProDeType: (v: DrivenElementType) => void;
  proFeedGap: number;
  setProFeedGap: (v: number) => void;
  proSpacingType: SpacingType;
  setProSpacingType: (v: SpacingType) => void;
  proManualSpacing: number;
  setProManualSpacing: (v: number) => void;
}

export function ProModePanel({
  proBoomShape,
  setProBoomShape,
  proElDia,
  setProElDia,
  proBoomDia,
  setProBoomDia,
  proMountMethod,
  setProMountMethod,
  proManualBCFactor,
  setProManualBCFactor,
  proDeType,
  setProDeType,
  proFeedGap,
  setProFeedGap,
  proSpacingType,
  setProSpacingType,
  proManualSpacing,
  setProManualSpacing,
}: ProModePanelProps) {
  return (
    <Card className="border-l-4 border-l-sky-600 shadow-sm animate-in fade-in slide-in-from-top-2">
      <CardHeader className="bg-slate-50 border-b px-5">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-800">工程参数设置</h3>
          <Badge variant="secondary" className="bg-sky-100 text-sky-700">
            Pro Mode
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 1. Boom Correction */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase border-b pb-1">
            1. 动臂修正 (Boom Correction)
          </h4>

          {/* Boom Shape Toggle */}
          <div className="flex justify-between items-center bg-slate-50 p-2 rounded border">
            <Label className="text-xs uppercase text-slate-500">动臂截面</Label>
            <div className="flex gap-1">
              <Button
                type="button"
                variant={proBoomShape === "round" ? "default" : "outline"}
                size="sm"
                className={`h-6 text-xs px-2 ${proBoomShape === "round" ? "bg-sky-600 hover:bg-sky-500" : ""}`}
                onClick={() => setProBoomShape("round")}
              >
                圆管 (Round)
              </Button>
              <Button
                type="button"
                variant={proBoomShape === "square" ? "default" : "outline"}
                size="sm"
                className={`h-6 text-xs px-2 ${proBoomShape === "square" ? "bg-sky-600 hover:bg-sky-500" : ""}`}
                onClick={() => setProBoomShape("square")}
              >
                方管 (Square)
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Label className="text-xs uppercase text-slate-500">
                  振子直径 (d)
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <QuestionIcon className="h-4 w-4 text-slate-400 hover:text-sky-600 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[220px]">
                    <p className="font-bold text-background mb-1">
                      直径效应 (K Factor)
                    </p>
                    <p className="text-xs text-background/80">
                      振子越粗，等效电气长度越长。物理切割时需缩短以补偿。
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-1">
                <InputGroup className="h-8">
                  <InputGroupInput
                    type="number"
                    value={proElDia}
                    onChange={(e) =>
                      setProElDia(parseFloat(e.target.value) || 0)
                    }
                    className="text-sm font-mono"
                  />
                  <InputGroupAddon align="inline-end">mm</InputGroupAddon>
                </InputGroup>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Label className="text-xs uppercase text-slate-500">
                  动臂直径 (B)
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <QuestionIcon className="h-4 w-4 text-slate-400 hover:text-sky-600 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[220px]">
                    <p className="font-bold text-background mb-1">
                      动臂短路效应
                    </p>
                    <p className="text-xs text-background/80">
                      金属动臂相当于寄生电感，会“缩短”穿过它的振子的电气长度。
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-1">
                <InputGroup className="h-8">
                  <InputGroupInput
                    type="number"
                    value={proBoomDia}
                    onChange={(e) =>
                      setProBoomDia(parseFloat(e.target.value) || 0)
                    }
                    className="text-sm font-mono"
                  />
                  <InputGroupAddon align="inline-end">mm</InputGroupAddon>
                </InputGroup>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Label className="text-xs uppercase text-slate-500">
                安装结构
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <QuestionIcon className="h-4 w-4 text-slate-400 hover:text-sky-600 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px]">
                  <p className="font-bold text-background mb-1">
                    修正系数参考 (k)
                  </p>
                  <ul className="list-disc pl-3 space-y-1 text-xs text-background/80">
                    <li>非金属: k ≈ 0</li>
                    <li>上方架设: k ≈ 0.05 (影响小)</li>
                    <li>穿孔接触: k = 动态计算 (0.6~0.8)</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={proMountMethod}
              onValueChange={(v) => setProMountMethod(v as MountMethod)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bonded">
                  Bonded (穿过金属管且接触)
                </SelectItem>
                <SelectItem value="insulated">
                  Insulated (穿过金属管但绝缘)
                </SelectItem>
                <SelectItem value="above">Above (架在金属管上方)</SelectItem>
                <SelectItem value="none">None (非金属动臂)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-slate-50 p-2 rounded border flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <Label className="text-xs uppercase text-sky-700 block w-fit">
                  计算修正系数 (BC Factor)
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <QuestionIcon className="h-4 w-4 text-sky-500 hover:text-sky-700 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[250px]">
                    <p className="font-bold text-background mb-1">修正系数 k</p>
                    <p className="text-xs text-background/80">
                      DL6WU 曲线依据{" "}
                      <code className="bg-background/20 px-1 rounded">B/d</code>{" "}
                      比值动态计算。
                      <br />
                      最终物理增加长度 = B × k
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                B/d = {(proBoomDia / proElDia || 0).toFixed(2)}
              </span>
            </div>
            <Input
              type="number"
              value={proManualBCFactor ?? 0}
              onChange={(e) =>
                setProManualBCFactor(parseFloat(e.target.value) || 0)
              }
              className="w-20 h-8 text-center font-mono font-bold text-sky-700 bg-white"
              step="0.001"
            />
          </div>
          <p className="text-xs text-slate-400 italic">
            * 系统根据 DL6WU 曲线自动计算 k 值，您也可手动修改右侧数值。
          </p>
        </div>

        {/* 2. Driven Element */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase border-b pb-1">
            2. 主振子 (Driven Element)
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Label className="text-xs uppercase text-slate-500">类型</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <QuestionIcon className="h-4 w-4 text-slate-400 hover:text-sky-600 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[220px]">
                    <p className="font-bold text-background mb-1">阻抗特性</p>
                    <ul className="list-disc pl-3 space-y-1 text-xs text-background/80">
                      <li>Folded: ~288Ω (需4:1巴伦)</li>
                      <li>Straight: ~72Ω (可直接馈电)</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                value={proDeType}
                onValueChange={(v) => setProDeType(v as DrivenElementType)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="folded">折合振子 (Folded)</SelectItem>
                  <SelectItem value="straight">直立振子 (Straight)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Label className="text-xs uppercase text-slate-500">
                  馈电间隙 (Gap)
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <QuestionIcon className="h-4 w-4 text-slate-400 hover:text-sky-600 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[220px]">
                    <p className="font-bold text-background mb-1">物理切割</p>
                    <p className="text-xs text-background/80">
                      直立偶极子的切割长度需减去此间隙。
                      <br />
                      CutLen = TotalLen - Gap
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-1">
                <InputGroup className="h-8">
                  <InputGroupInput
                    type="number"
                    value={proFeedGap}
                    onChange={(e) =>
                      setProFeedGap(parseFloat(e.target.value) || 0)
                    }
                    className="text-sm font-mono"
                  />
                  <InputGroupAddon align="inline-end">mm</InputGroupAddon>
                </InputGroup>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Spacing */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase border-b pb-1">
            3. 间距策略 (Spacing)
          </h4>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Label className="text-xs uppercase text-slate-500">
                算法选择
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <QuestionIcon className="h-4 w-4 text-slate-400 hover:text-sky-600 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px]">
                  <p className="font-bold text-background mb-1">
                    DL6WU Tapering
                  </p>
                  <p className="text-xs text-background/80">
                    引向器间距从 0.075λ 逐渐增大到
                    0.30λ，以在保证带宽的同时最大化前方增益。
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={proSpacingType}
              onValueChange={(v) => setProSpacingType(v as SpacingType)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dl6wu">DL6WU 标准渐变 (推荐)</SelectItem>
                <SelectItem value="uniform">Uniform 等间距 (自定义)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {proSpacingType === "uniform" && (
            <div className="bg-slate-50 p-2 rounded">
              <Label className="text-xs uppercase text-slate-500">
                固定间距值 (λ)
              </Label>
              <div className="flex items-center gap-1 mt-1">
                <InputGroup className="h-8">
                  <InputGroupInput
                    type="number"
                    value={proManualSpacing}
                    onChange={(e) =>
                      setProManualSpacing(parseFloat(e.target.value) || 0)
                    }
                    step="0.01"
                    className="text-sm font-mono"
                  />
                  <InputGroupAddon align="inline-end">λ</InputGroupAddon>
                </InputGroup>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
