import { lazy, Suspense } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ClientOnly } from "~/components/client-only";
import { BlockMath, InlineMath } from "~/components/math";
import { ScientificCitation } from "~/components/scientific-citation";
import { getInstance } from "~/middleware/i18next";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";

const WindomAntennaScene = lazy(
  () => import("~/components/windom-antenna-scene"),
);

export const loader = ({ context }: LoaderFunctionArgs) => {
  const { t } = getInstance(context);
  return {
    title: t("demos:windomAntenna.metaTitle"),
    description: t("demos:windomAntenna.metaDescription"),
    keywords: t("demos:windomAntenna.metaKeywords"),
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { title, description, keywords } = data || {};
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

export default function WindomAntennaPage() {
  const { t } = useTranslation("demos");
  const dp = "windomAntenna";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">{t(`${dp}.title`)}</h1>
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
            <WindomAntennaScene />
          </Suspense>
        </ClientOnly>

        <div className="prose dark:prose-invert max-w-none">
          {/* Overview */}
          <h3>{t(`${dp}.overviewTitle`)}</h3>
          <p>
            <Trans
              ns="demos"
              i18nKey={`${dp}.overview`}
              components={{ strong: <strong />, M: <InlineMath /> }}
            />
          </p>
          <ul>
            <li>
              <Trans
                ns="demos"
                i18nKey={`${dp}.structure`}
                components={{ strong: <strong /> }}
              />
            </li>
          </ul>

          {/* Principle / Why 1/3? */}
          <h3>{t(`${dp}.principleTitle`)}</h3>
          <p>
            <Trans
              ns="demos"
              i18nKey={`${dp}.principleIntro`}
              components={{ strong: <strong /> }}
            />
          </p>
          <ul>
            <li>
              <Trans
                ns="demos"
                i18nKey={`${dp}.principlePoints.fundamental`}
                components={{ strong: <strong /> }}
              />
            </li>
            <li>
              <Trans
                ns="demos"
                i18nKey={`${dp}.principlePoints.harmonics2`}
                components={{ strong: <strong /> }}
              />
            </li>
            <li>
              <Trans
                ns="demos"
                i18nKey={`${dp}.principlePoints.harmonics4`}
                components={{ strong: <strong /> }}
              />
            </li>
          </ul>
          <p>
            <Trans
              ns="demos"
              i18nKey={`${dp}.principleConclusion`}
              components={{ strong: <strong /> }}
            />
          </p>

          {/* Matching System */}
          <h3>{t(`${dp}.matchingTitle`)}</h3>
          <p>
            <Trans
              ns="demos"
              i18nKey={`${dp}.matchingIntro`}
              components={{ strong: <strong />, M: <InlineMath /> }}
            />
          </p>
          <BlockMath math="\text{Balun Ratio} = \frac{Z_{antenna}}{Z_{cable}} = \frac{200\Omega}{50\Omega} = 4:1" />
          <p>
            <Trans
              ns="demos"
              i18nKey={`${dp}.matchingConclusion`}
              components={{ strong: <strong /> }}
            />
          </p>

          {/* Radiation Pattern */}
          <h3>{t(`${dp}.patternTitle`)}</h3>
          <p>
            <Trans
              ns="demos"
              i18nKey={`${dp}.patternIntro`}
              components={{ strong: <strong /> }}
            />
          </p>
          <ul>
            <li>
              <Trans
                ns="demos"
                i18nKey={`${dp}.patternPoints.fundamental`}
                components={{ strong: <strong /> }}
              />
            </li>
            <li>
              <Trans
                ns="demos"
                i18nKey={`${dp}.patternPoints.harmonic`}
                components={{ strong: <strong /> }}
              />
            </li>
          </ul>

          {/* Comparison Table */}
          <h3>{t(`${dp}.comparisonTitle`)}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr>
                  <th className="p-4 border-b dark:border-zinc-700 font-semibold">
                    {t(`${dp}.tableHead.feature`)}
                  </th>
                  <th className="p-4 border-b dark:border-zinc-700 font-semibold">
                    {t(`${dp}.tableHead.dipole`)}
                  </th>
                  <th className="p-4 border-b dark:border-zinc-700 font-semibold">
                    {t(`${dp}.tableHead.windom`)}
                  </th>
                  <th className="p-4 border-b dark:border-zinc-700 font-semibold">
                    {t(`${dp}.tableHead.efhw`)}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b dark:border-zinc-800">
                  <td className="p-4">{t(`${dp}.tableRow.feedPos`)}</td>
                  <td className="p-4">{t(`${dp}.tableCell.dipoleFeed`)}</td>
                  <td className="p-4 font-semibold text-primary">
                    {t(`${dp}.tableCell.windomFeed`)}
                  </td>
                  <td className="p-4">{t(`${dp}.tableCell.efhwFeed`)}</td>
                </tr>
                <tr className="border-b dark:border-zinc-800">
                  <td className="p-4">{t(`${dp}.tableRow.multiBand`)}</td>
                  <td className="p-4">{t(`${dp}.tableCell.dipoleBand`)}</td>
                  <td className="p-4 font-semibold text-primary">
                    {t(`${dp}.tableCell.windomBand`)}
                  </td>
                  <td className="p-4 font-semibold text-primary">
                    {t(`${dp}.tableCell.efhwBand`)}
                  </td>
                </tr>
                <tr className="border-b dark:border-zinc-800">
                  <td className="p-4">{t(`${dp}.tableRow.match`)}</td>
                  <td className="p-4">{t(`${dp}.tableCell.dipoleMatch`)}</td>
                  <td className="p-4 font-semibold text-primary">
                    {t(`${dp}.tableCell.windomMatch`)}
                  </td>
                  <td className="p-4 font-semibold text-primary">
                    {t(`${dp}.tableCell.efhwMatch`)}
                  </td>
                </tr>
                <tr className="border-b dark:border-zinc-800">
                  <td className="p-4">{t(`${dp}.tableRow.ground`)}</td>
                  <td className="p-4">{t(`${dp}.tableCell.dipoleGround`)}</td>
                  <td className="p-4">{t(`${dp}.tableCell.windomGround`)}</td>
                  <td className="p-4 font-semibold text-primary">
                    {t(`${dp}.tableCell.efhwGround`)}
                  </td>
                </tr>
                <tr>
                  <td className="p-4">{t(`${dp}.tableRow.cons`)}</td>
                  <td className="p-4">{t(`${dp}.tableCell.dipoleCons`)}</td>
                  <td className="p-4">{t(`${dp}.tableCell.windomCons`)}</td>
                  <td className="p-4">{t(`${dp}.tableCell.efhwCons`)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <Trans
              ns="demos"
              i18nKey={`${dp}.comparisonSummary`}
              components={{ strong: <strong /> }}
            />
          </p>

          {/* Misconception */}
          <h3>{t(`${dp}.misconceptionTitle`)}</h3>
          <p>
            <Trans
              ns="demos"
              i18nKey={`${dp}.misconceptionIntro`}
              components={{ strong: <strong /> }}
            />
          </p>
          <h4>{t(`${dp}.misconceptionPhysicsTitle`)}</h4>
          <p>
            <Trans
              ns="demos"
              i18nKey={`${dp}.misconceptionPhysics`}
              components={{ strong: <strong /> }}
            />
          </p>
          <h4>{t(`${dp}.misconceptionFeedTitle`)}</h4>
          <p>
            <Trans
              ns="demos"
              i18nKey={`${dp}.misconceptionFeed`}
              components={{ strong: <strong /> }}
            />
          </p>
          <ul>
            <li>{t(`${dp}.misconceptionFeedLow`)}</li>
            <li>{t(`${dp}.misconceptionFeedHigh`)}</li>
            <li>{t(`${dp}.misconceptionFeedMid`)}</li>
          </ul>
          <p>
            <strong className="text-primary">
              {t(`${dp}.misconceptionConclusion`)}
            </strong>
          </p>
          <h4>{t(`${dp}.misconceptionExTitle`)}</h4>
          <p>
            <Trans
              ns="demos"
              i18nKey={`${dp}.misconceptionEx`}
              components={{ strong: <strong /> }}
            />
          </p>

          {/* Polarization */}
          <h3>{t(`${dp}.polarizationTitle`)}</h3>
          <p>
            <Trans
              ns="demos"
              i18nKey={`${dp}.polarizationIntro`}
              components={{ strong: <strong /> }}
            />
          </p>

          <h4>{t(`${dp}.polarizationReason1Title`)}</h4>
          <p>{t(`${dp}.polarizationReason1`)}</p>

          <h4>{t(`${dp}.polarizationReason2Title`)}</h4>
          <ul>
            <li>
              <Trans
                ns="demos"
                i18nKey={`${dp}.polarizationReason2List.horizontal`}
                components={{ strong: <strong /> }}
              />
            </li>
            <li>
              <Trans
                ns="demos"
                i18nKey={`${dp}.polarizationReason2List.invertedV`}
                components={{ strong: <strong /> }}
              />
            </li>
            <li>
              <Trans
                ns="demos"
                i18nKey={`${dp}.polarizationReason2List.sloper`}
                components={{ strong: <strong /> }}
              />
            </li>
          </ul>

          <h4>{t(`${dp}.polarizationExceptionTitle`)}</h4>
          <p>
            <Trans
              ns="demos"
              i18nKey={`${dp}.polarizationException`}
              components={{ strong: <strong /> }}
            />
          </p>

          <div className="bg-zinc-50 dark:bg-zinc-900 border rounded-lg p-4 md:p-6 mb-8 text-sm md:text-base leading-relaxed">
            <ScientificCitation
              title={t("physicsValidation")}
              content={
                <>
                  <p className="mb-2">
                    <Trans
                      ns="demos"
                      i18nKey={`${dp}.physicsContent`}
                      components={{ strong: <strong /> }}
                    />
                  </p>
                </>
              }
              citations={[
                {
                  id: "arrl-antenna-book",
                  text: "The ARRL Antenna Book. Chapter 6: Multiband Antennas.",
                },
                {
                  id: "w8ji-windom",
                  text: "W8JI. Windom Antenna and Off-Center Fed Dipoles.",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
