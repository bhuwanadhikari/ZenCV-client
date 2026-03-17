type CoverLetterTabBodyProps = {
  src: string;
  title: string;
};

export function CoverLetterTabBody({
  src,
  title,
}: CoverLetterTabBodyProps) {
  return (
    <div className="mt-6 grid min-h-[320px] flex-1 gap-3 overflow-hidden rounded-2xl bg-secondary/65 p-4">
      <div className="min-h-0 overflow-hidden rounded-xl border border-border bg-background/80">
        <iframe
          src={src}
          title={title}
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}
