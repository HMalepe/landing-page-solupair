import { XMark } from "./XMark";

export function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-16 text-teal/20">
      <span className="h-px w-16 bg-border" />
      <XMark size={16} />
      <span className="h-px w-16 bg-border" />
    </div>
  );
}
