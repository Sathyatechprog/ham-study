import { lazy, Suspense } from "react";
import { useTranslation, Trans } from "react-i18next";
import { getInstance } from "~/middleware/i18next";
import type { Route } from "./+types/magnetic-loop-antenna";
import { ClientOnly } from "~/components/client-only";
import { InlineMath as M, BlockMath } from "~/components/math";
import { ScientificCitation } from "~/components/scientific-citation";

const MagneticLoopAntennaScene = lazy(
  () => import("~/components/magnetic-loop-antenna-scene"),
);

export const loader = ({ context }: Route.LoaderArgs) => {
  const { t } = getInstance(context);
  return {
    title: t("demos:magneticLoopAntenna.metaTitle"),
    description: t("demos:magneticLoopAntenna.metaDescription"),
    keywords: t("demos:magneticLoopAntenna.metaKeywords"),
  };
};

export const meta = ({ loaderData }: Route.MetaArgs) => {
  const { title, description, keywords } = loaderData;
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "keywords", content: keywords },
  ];
};

export default function MagneticLoopAntenna() {
  const { t } = useTranslation("demos");
  const key = "magneticLoopAntenna";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t(`${key}.title`)}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* 3D Scene */}
        <ClientOnly
          fallback={
            <div className="h-[450px] md:h-[600px] w-full flex items-center justify-center bg-slate-100 rounded-lg">
              {t("loading")}
            </div>
          }
        >
          <Suspense
            fallback={
              <div className="h-[450px] md:h-[600px] w-full flex items-center justify-center bg-slate-100 rounded-lg">
                {t("loading")}
              </div>
            }
          >
            <MagneticLoopAntennaScene />
          </Suspense>
        </ClientOnly>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none">
          {/* Overview */}
          <h3>{t(`${key}.overviewTitle`)}</h3>
          <p>
            <Trans
              i18nKey={`${key}.overview`}
              ns="demos"
              components={{ M: <M /> }}
            />
          </p>
          <p>
            <Trans i18nKey={`${key}.structure`} ns="demos" />
          </p>
          <p>
            <Trans i18nKey={`${key}.features`} ns="demos" />
          </p>

          {/* Physics Model */}
          <h3>{t(`${key}.physicsModelTitle`)}</h3>
          <p>
            <Trans
              i18nKey={`${key}.physicsModel`}
              ns="demos"
              components={{ M: <M /> }}
            />
          </p>

          {/* Math Formula */}
          <h3>{t(`${key}.fieldFormulaTitle`)}</h3>
          <p>
            <Trans
              i18nKey={`${key}.fieldFormulaDesc`}
              ns="demos"
              components={{ M: <M /> }}
            />
          </p>

          <BlockMath math="E_\phi = \frac{\eta k^2 I A}{4\pi r} e^{-jkr} \sin\theta" />

          <ul>
            <li>
              <Trans
                i18nKey={`${key}.paramEta`}
                ns="demos"
                components={{ M: <M /> }}
              />
            </li>
            <li>
              <Trans
                i18nKey={`${key}.paramK`}
                ns="demos"
                components={{ M: <M /> }}
              />
            </li>
            <li>
              <Trans
                i18nKey={`${key}.paramI`}
                ns="demos"
                components={{ M: <M /> }}
              />
            </li>
            <li>
              <Trans
                i18nKey={`${key}.paramA`}
                ns="demos"
                components={{ M: <M /> }}
              />
            </li>
            <li>
              <Trans
                i18nKey={`${key}.paramTheta`}
                ns="demos"
                components={{ M: <M /> }}
              />
            </li>
          </ul>

          {/* Pattern */}
          <h3>{t(`${key}.patternTitle`)}</h3>
          <p>
            <Trans
              i18nKey={`${key}.patternDesc`}
              ns="demos"
              components={{ M: <M /> }}
            />
          </p>
          <ul>
            <li>
              <strong className="text-red-500">NULL: </strong>
              <Trans
                i18nKey={`${key}.patternNull`}
                ns="demos"
                components={{ M: <M /> }}
              />
            </li>
            <li>
              <strong className="text-green-500">MAX: </strong>
              <Trans
                i18nKey={`${key}.patternMax`}
                ns="demos"
                components={{ M: <M /> }}
              />
            </li>
          </ul>

          {/* Anti-Noise / Advantages */}
          <h3>{t(`${key}.advantageTitle`)}</h3>
          <p>
            <Trans i18nKey={`${key}.advantageDesc`} ns="demos" />
          </p>

          {/* Scientific Citation */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border rounded-lg p-4 md:p-6 mb-8 text-sm md:text-base leading-relaxed mt-8">
            <ScientificCitation
              title={t("physicsValidation")}
              content={
                <>
                  <p className="mb-2">
                    <Trans
                      i18nKey={`${key}.physicsContent`}
                      ns="demos"
                      components={{ M: <M /> }}
                    />
                  </p>
                  <p className="text-muted-foreground italic border-l-2 border-primary/20 pl-4 py-1">
                    {t(`${key}.physicsQuote`)}
                  </p>
                </>
              }
              citations={[]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
