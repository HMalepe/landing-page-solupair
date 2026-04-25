import { useState } from "react";
import { Calculator, ArrowRight } from "lucide-react";
import { CountUp } from "@/components/brand/CountUp";

export function WasteCalculator() {
  const [stock, setStock] = useState(50000);
  const [waste, setWaste] = useState(8);
  const [locations, setLocations] = useState(3);
  const [calculated, setCalculated] = useState<number | null>(null);

  const monthly = (stock * (waste / 100) * locations * 4.33);

  return (
    <div className="my-12 rounded-md border border-border bg-surface p-6 md:p-8">
      <div className="flex items-center gap-2">
        <Calculator className="h-4 w-4 text-teal" />
        <h3 className="font-mono text-[11px] uppercase tracking-wider text-teal">
          Calculate Your Waste Impact
        </h3>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field
          label="Weekly stock value"
          prefix="$"
          value={stock}
          onChange={setStock}
          step={1000}
        />
        <Field label="Estimated waste %" suffix="%" value={waste} onChange={setWaste} step={1} />
        <Field label="Locations" value={locations} onChange={setLocations} step={1} />
      </div>

      <button
        onClick={() => setCalculated(monthly)}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-background transition-all hover:shadow-teal-glow"
      >
        Run the numbers <ArrowRight className="h-3.5 w-3.5" />
      </button>

      {calculated !== null && (
        <div className="mt-8 rounded-md border-t-2 border-teal bg-background/40 p-6">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            You're losing approximately
          </p>
          <p
            key={calculated}
            className="mt-2 font-serif text-4xl text-teal md:text-5xl"
            style={{ textShadow: "0 0 24px oklch(0.72 0.13 195 / 0.35)" }}
          >
            <CountUp to={calculated} prefix="$" decimals={0} />
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            per month in expired stock
          </p>
          <a
            href="https://expirydesk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-teal hover:underline"
          >
            ExpiryDesk can fix this <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  step = 1,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
        {label}
      </span>
      <div className="mt-1.5 flex items-center rounded-md border border-border bg-background focus-within:border-teal">
        {prefix && <span className="pl-3 text-muted-foreground">{prefix}</span>}
        <input
          type="number"
          value={value}
          step={step}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full bg-transparent px-3 py-2.5 text-foreground focus:outline-none"
        />
        {suffix && <span className="pr-3 text-muted-foreground">{suffix}</span>}
      </div>
    </label>
  );
}
