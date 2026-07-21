type NatureImageProps = {
  src: string;
  alt: string;
  className?: string;
  overlay?: "light" | "dark" | "none";
  priority?: boolean;
};

export function NatureImage({
  src,
  alt,
  className = "",
  overlay = "dark",
  priority = false,
}: NatureImageProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover"
      />
      {overlay !== "none" && (
        <div
          className={`absolute inset-0 ${
            overlay === "dark"
              ? "bg-gradient-to-t from-background/85 via-background/30 to-background/10"
              : "bg-background/20"
          }`}
        />
      )}
    </div>
  );
}
