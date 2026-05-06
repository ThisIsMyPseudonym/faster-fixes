import { APP_URL } from "@/app/_constants/app";
import { SITE_NAME } from "@/app/_constants/seo";
import { BreadcrumbSchema } from "@/app/_features/seo/breadcrumb-schema";
import { SoftwareApplicationSchema } from "@/app/_features/seo/software-application-schema";
import { WebPageSchema } from "@/app/_features/seo/web-page-schema";
import type { Metadata } from "next";
import { LinearBreadcrumb } from "./_features/linear-breadcrumb";
import { LinearCapabilitiesSection } from "./_features/linear-capabilities-section";
import { LinearCtaSection } from "./_features/linear-cta-section";
import { LinearHero } from "./_features/linear-hero";
import { LinearHowItWorksSection } from "./_features/linear-how-it-works-section";

const pageUrl = `${APP_URL}/integrations/linear`;
const title = `Linear integration — Client feedback to Linear issues | ${SITE_NAME}`;
const description =
  "Client feedback from your staging widget lands in Linear automatically — with screenshot, CSS selector, React component path, and browser context.";
const ogImageAlt =
  "FasterFixes Linear integration — visual feedback creating a Linear issue with screenshot and dev context attached";
const datePublished = "2026-05-06T00:00:00.000Z";
const dateModified = "2026-05-06T00:00:00.000Z";

export const metadata: Metadata = {
  title: {
    absolute: title,
  },
  description,
  keywords: [
    "linear integration visual feedback",
    "client feedback linear issues",
    "staging feedback to linear",
    "bug reporting linear integration",
    "linear issue from feedback widget",
    "bidirectional linear sync",
    "feedback widget linear team",
    "linear issue tracker feedback tool",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title,
    description,
    url: pageUrl,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        alt: ogImageAlt,
      },
    ],
  },
  twitter: {
    title,
    description,
    images: [
      {
        url: "/opengraph-image",
        alt: ogImageAlt,
      },
    ],
  },
};

export default function Page() {
  return (
    <div>
      <LinearBreadcrumb />
      <LinearHero />
      <LinearCapabilitiesSection />
      <LinearHowItWorksSection />
      <LinearCtaSection />

      <SoftwareApplicationSchema />

      <WebPageSchema
        title={title}
        description={description}
        url={pageUrl}
        datePublished={datePublished}
        dateModified={dateModified}
        aboutId={`${APP_URL}#software`}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: APP_URL },
          { name: "Integrations", url: `${APP_URL}/integrations/linear` },
          { name: "Linear", url: pageUrl },
        ]}
      />
    </div>
  );
}
