import { lazy, Suspense } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ClientOnly } from "~/components/client-only";
import { BlockMath, InlineMath } from "~/components/math";
import { ScientificCitation } from "~/components/scientific-citation";
import { getInstance } from "~/middleware/i18next";
import type { Route } from "./+types/hb9cv-antenna";

const HB9CVAntennaScene = lazy(
  () => import("~/components/hb9cv-antenna-scene"),
);

export const loader = ({ context }: Route.LoaderArgs) => {
  const { t } = getInstance(context);
  return {
    title: t("demos:hb9cvAntenna.metaTitle"),
    description: t("demos:hb9cvAntenna.metaDescription"),
    keywords: t("demos:hb9cvAntenna.metaKeywords"),
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

export default function HB9CVAntennaPage() {
  const { t } = useTranslation("demos");
  const hb9cv = "hb9cvAntenna";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">{t(`${hb9cv}.title`)}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="flex flex-col gap-6">
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
            <HB9CVAntennaScene />
          </Suspense>
        </ClientOnly>

        <div className="prose dark:prose-invert max-w-none">
          <h3>{t("aboutTitle")}</h3>
          <p>
            <Trans
              ns="demos"
              i18nKey={`${hb9cv}.about`}
              components={{ strong: <strong /> }}
            />
          </p>

          <h3>{t(`${hb9cv}.structureTitle`)}</h3>
          <p>
            <Trans
              ns="demos"
              i18nKey={`${hb9cv}.structureContent`}
              components={{ strong: <strong />, M: <InlineMath /> }}
            />
          </p>

          <h3>{t(`${hb9cv}.phaseTitle`)}</h3>
          <p>
            <Trans
              ns="demos"
              i18nKey={`${hb9cv}.phaseContent`}
              components={{ strong: <strong />, M: <InlineMath /> }}
            />
          </p>
          <ul>
            <li>
              <Trans
                ns="demos"
                i18nKey={`${hb9cv}.phaseFront`}
                components={{ strong: <strong /> }}
              />
            </li>
            <li>
              <Trans
                ns="demos"
                i18nKey={`${hb9cv}.phaseRear`}
                components={{ strong: <strong /> }}
              />
            </li>
          </ul>

          <div className="bg-zinc-50 dark:bg-zinc-900 border rounded-lg p-6 my-6">
            <h4 className="mt-0 mb-4">{t(`${hb9cv}.formulaTitle`)}</h4>
            <p>
              <Trans
                ns="demos"
                i18nKey={`${hb9cv}.formulaIntro`}
                components={{ M: <InlineMath /> }}
              />
            </p>
            <div className="my-4">
              <BlockMath
                math={
                  "E_{total}(\\theta) = E_{element}(\\theta) \\times AF(\\theta)"
                }
              />
            </div>
            <p>
              <Trans
                ns="demos"
                i18nKey={`${hb9cv}.afDef`}
                components={{ strong: <strong /> }}
              />
            </p>
            <div className="my-4">
              <BlockMath
                math={"AF(\\theta) = 1 + e^{j(kd \\cos \\theta + \\delta)}"}
              />
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <Trans
                  ns="demos"
                  i18nKey={`${hb9cv}.paramK`}
                  components={{ M: <InlineMath /> }}
                />
              </li>
              <li>
                <Trans
                  ns="demos"
                  i18nKey={`${hb9cv}.paramD`}
                  components={{ M: <InlineMath /> }}
                />
              </li>
              <li>
                <Trans
                  ns="demos"
                  i18nKey={`${hb9cv}.paramDelta`}
                  components={{ M: <InlineMath /> }}
                />
              </li>
            </ul>
          </div>

          <h3>{t(`${hb9cv}.patternTitle`)}</h3>
          <p>
            <Trans
              ns="demos"
              i18nKey={`${hb9cv}.patternContent`}
              components={{ strong: <strong /> }}
            />
          </p>
          <div className="my-4">
            <BlockMath
              math={
                "F(\\theta) \\approx \\cos\\left( \\frac{\\pi}{8} (1 - \\cos \\theta) \\right)"
              }
            />
          </div>

          <h3>{t(`${hb9cv}.comparisonTitle`)}</h3>
          <div className="overflow-x-auto my-4">
            <table className="w-full border-collapse border border-zinc-200 dark:border-zinc-700 text-sm">
              <thead>
                <tr className="bg-zinc-100 dark:bg-zinc-800">
                  {(["feature", "hb9cv", "yagi"] as const).map((key) => (
                    <th
                      key={key}
                      className="border border-zinc-200 dark:border-zinc-700 p-2 text-left font-semibold"
                    >
                      {t(`${hb9cv}.comparisonTable.headers.${key}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(["gain", "fbRatio", "bandwidth", "feed"] as const).map(
                  (rowKey) => (
                    <tr
                      key={rowKey}
                      className="even:bg-zinc-50 dark:even:bg-zinc-900/50"
                    >
                      <td className="border border-zinc-200 dark:border-zinc-700 p-2 font-semibold">
                        {t(`${hb9cv}.comparisonTable.rows.${rowKey}.feature`)}
                      </td>
                      <td className="border border-zinc-200 dark:border-zinc-700 p-2">
                        <Trans
                          ns="demos"
                          i18nKey={`${hb9cv}.comparisonTable.rows.${rowKey}.hb9cv`}
                          components={{ strong: <strong /> }}
                        />
                      </td>
                      <td className="border border-zinc-200 dark:border-zinc-700 p-2">
                        <Trans
                          ns="demos"
                          i18nKey={`${hb9cv}.comparisonTable.rows.${rowKey}.yagi`}
                          components={{ strong: <strong /> }}
                        />
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900 border rounded-lg p-4 md:p-6 mb-8 text-sm md:text-base leading-relaxed">
            <ScientificCitation
              title={t("physicsValidation")}
              content={
                <>
                  <p className="mb-2">
                    <Trans
                      ns="demos"
                      i18nKey={`${hb9cv}.physicsContent`}
                      components={{ strong: <strong /> }}
                    />
                  </p>
                  <p className="text-muted-foreground italic border-l-2 border-primary/20 pl-4 py-1">
                    {t(`${hb9cv}.physicsQuote`)}
                  </p>
                </>
              }
              citations={[
                {
                  id: "hb9cv-history",
                  text: "Rudolf Baumgartner (HB9CV). (1950s). Original Design of Phased Array.",
                },
                {
                  id: "arrl-handbook",
                  text: "The ARRL Antenna Book. Phased Arrays and HB9CV.",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
