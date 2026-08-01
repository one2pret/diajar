export function VideoPlayer({
  youtubeVideoId,
  title,
}: {
  youtubeVideoId: string;
  title: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-black shadow-md">
      <div className="relative aspect-video w-full">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${youtubeVideoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
