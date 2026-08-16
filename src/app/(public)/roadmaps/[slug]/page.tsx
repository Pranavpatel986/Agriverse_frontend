import type { Metadata } from "next";
import { roadmapService } from "@/features/roadmaps/api/roadmap.service";
import { RoadmapDetailContent } from "@/features/roadmaps/components/roadmap-detail-content";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { env } from "@/config/env";

export const revalidate = 3600;

interface RoadmapDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getRoadmap(slug: string) {
  try {
    return await roadmapService.bySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: RoadmapDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = await getRoadmap(slug);
  if (!roadmap) return { title: "Roadmap" };
  return {
    title: roadmap.title,
    alternates: { canonical: `/roadmaps/${slug}` },
  };
}

export default async function RoadmapDetailPage({ params }: RoadmapDetailPageProps) {
  const { slug } = await params;
  const roadmap = await getRoadmap(slug);

  if (!roadmap) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <ErrorState
          title="Roadmap unavailable"
          description="We couldn't load this roadmap."
        />
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: roadmap.title,
    url: `${env.NEXT_PUBLIC_SITE_URL}/roadmaps/${slug}`,
    numberOfCredits: roadmap.steps.length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RoadmapDetailContent slug={slug} initialRoadmap={roadmap} />
    </>
  );
}
