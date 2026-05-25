type YoutubeEmbedProps = {
  id: string;
  title: string;
};

export function YoutubeEmbed({ id, title }: YoutubeEmbedProps) {
  return (
    <div className="not-prose aspect-video w-full overflow-hidden rounded-lg border">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        className="h-full w-full"
      />
    </div>
  );
}
