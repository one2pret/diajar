import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Layers, BarChart3 } from "lucide-react";
import { getDummyCourseBySlug, getDummyTeacherById } from "@/lib/dummy-data";
import { formatLevel } from "@/lib/utils";
import { VideoPlayer } from "@/components/learn/video-player";
import { ChannelAttribution } from "@/components/learn/channel-attribution";
import { ModuleSidebar } from "@/components/learn/module-sidebar";
import { AiChatPanel } from "@/components/learn/ai-chat-panel";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getDummyCourseBySlug(slug);
  return {
    title: course ? `${course.title} — Diajar` : "Course tidak ditemukan — Diajar",
    description: course?.description,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getDummyCourseBySlug(slug);
  if (!course) {
    notFound();
  }

  const sortedModules = [...course.modules].sort((a, b) => a.orderIndex - b.orderIndex);
  const firstModule = sortedModules[0];
  const teacher = firstModule ? getDummyTeacherById(firstModule.teacherId) : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground">
          <BarChart3 size={13} strokeWidth={1.75} />
          {formatLevel(course.level)}
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
          {course.title}
        </h1>
        <p className="mt-3 text-base leading-normal text-muted-foreground">
          {course.description}
        </p>
        <p className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
          <Layers size={14} strokeWidth={1.75} />
          {course.modules.length} module
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-6">
          {firstModule ? (
            <div>
              <VideoPlayer
                youtubeVideoId={firstModule.youtubeVideoId}
                title={firstModule.title}
              />
              {teacher && <ChannelAttribution teacher={teacher} />}

              <div className="mt-4">
                <h2 className="text-lg font-semibold text-foreground">{firstModule.title}</h2>
                <p className="mt-2 text-sm leading-normal text-muted-foreground">
                  {firstModule.curatorNote}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada module di course ini.</p>
          )}

          <div className="lg:hidden">
            <ModuleSidebar modules={course.modules} activeModuleId={firstModule?.id ?? ""} />
          </div>

          <div className="h-[420px] lg:hidden">
            {firstModule && <AiChatPanel moduleTitle={firstModule.title} />}
          </div>
        </div>

        <aside className="hidden flex-col gap-6 lg:flex">
          <ModuleSidebar modules={course.modules} activeModuleId={firstModule?.id ?? ""} />
          <div className="h-[480px]">
            {firstModule && <AiChatPanel moduleTitle={firstModule.title} />}
          </div>
        </aside>
      </div>
    </div>
  );
}
