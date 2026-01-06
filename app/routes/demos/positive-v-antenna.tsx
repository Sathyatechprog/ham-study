import { lazy, Suspense } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ClientOnly } from "~/components/client-only";
import { getInstance } from "~/middleware/i18next";
import type { Route } from "./+types/positive-v-antenna";

const PositiveVAntennaScene = lazy(
  () => import("~/components/positive-v-scene"),
);

import { ScientificCitation } from "~/components/scientific-citation";

export const loader = ({ context }: Route.LoaderArgs) => {
  const { t } = getInstance(context);
  return {
    title: t("demos:positiveVAntenna.metaTitle"),
    description: t("demos:positiveVAntenna.metaDescription"),
    keywords: t("demos:positiveVAntenna.metaKeywords"),
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

export default function PositiveVAntennaPage() {
  const { t } = useTranslation("demos");
  const pv = "positiveVAntenna";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">{t(`${pv}.title`)}</h1>
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
            <PositiveVAntennaScene />
          </Suspense>
        </ClientOnly>

        <div className="prose dark:prose-invert max-w-none">
          <h3>{t("aboutTitle")}</h3>
          <p>{t(`${pv}.about`)}</p>
          <ul>
            <li>
              <Trans
                ns="demos"
                i18nKey={`${pv}.structure`}
                components={{ strong: <strong /> }}
              />
            </li>
            <li>
              <Trans
                ns="demos"
                i18nKey={`${pv}.rotatable`}
                components={{ strong: <strong /> }}
              />
            </li>
          </ul>

          <h3>{t(`${pv}.definitionTitle`)}</h3>
          <p>
            <Trans
              ns="demos"
              i18nKey={`${pv}.definitionContent`}
              components={{ strong: <strong /> }}
            />
          </p>

          <h3>{t(`${pv}.principleTitle`)}</h3>

          <h4>{t(`${pv}.impedanceTitle`)}</h4>
          <ul className="list-disc pl-6 space-y-2 my-4">
            <li>
              <Trans
                ns="demos"
                i18nKey={`${pv}.impedanceProblem`}
                components={{ strong: <strong /> }}
              />
            </li>
            <li>
              <Trans
                ns="demos"
                i18nKey={`${pv}.impedanceSolution`}
                components={{ strong: <strong /> }}
              />
            </li>
            <li>
              <Trans
                ns="demos"
                i18nKey={`${pv}.impedanceConclusion`}
                components={{ strong: <strong /> }}
              />
            </li>
          </ul>

          <h4>{t(`${pv}.directionalityTitle`)}</h4>
          <ul className="list-disc pl-6 space-y-2 my-4">
            <li>
              <Trans
                ns="demos"
                i18nKey={`${pv}.directionalityDipole`}
                components={{ strong: <strong /> }}
              />
            </li>
            <li>
              <Trans
                ns="demos"
                i18nKey={`${pv}.directionalityPositiveV`}
                components={{ strong: <strong /> }}
              />
            </li>
          </ul>

          <h4>{t(`${pv}.spaceTitle`)}</h4>
          <p>{t(`${pv}.spaceContent`)}</p>

          <h3>{t(`${pv}.comparisonTitle`)}</h3>
          <ul className="list-disc pl-6 space-y-2 my-4">
            <li>
              <Trans
                ns="demos"
                i18nKey={`${pv}.invertedV`}
                components={{ strong: <strong /> }}
              />
            </li>
            <li>
              <Trans
                ns="demos"
                i18nKey={`${pv}.positiveV`}
                components={{ strong: <strong /> }}
              />
            </li>
          </ul>

          <h3>{t(`${pv}.polarizationTitle`)}</h3>

          <div className="bg-zinc-50 dark:bg-zinc-900 border rounded-lg p-4 md:p-6 mb-8 text-sm md:text-base leading-relaxed">
            <ScientificCitation
              title={t("physicsValidation")}
              content={
                <>
                  <p className="mb-2">{t(`${pv}.physicsContent`)}</p>
                  <p className="text-muted-foreground italic border-l-2 border-primary/20 pl-4 py-1">
                    {t(`${pv}.physicsQuote`)}
                  </p>
                </>
              }
              citations={[
                {
                  id: "rotatable-dipole",
                  text: "Witt, F. J., AI1H. (2014). Broadband Rotatable Dipole. QST Magazine.",
                },
                {
                  id: "balanis-dipole",
                  text: "Balanis, C. A. Antenna Theory. Chapter 4: Linear Wire Antennas.",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
