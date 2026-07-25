import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useDeviceProfile } from "@/hooks/use-device-profile";
import { useSectionInView } from "@/hooks/use-section-in-view";
import { navigateToSection } from "@/lib/section-nav";
import {
  ADD_ONS,
  computeQuoteRange,
  DEFAULT_QUOTE_SELECTION,
  EXTRA_PAGES_MAX,
  EXTRA_PAGES_MIN,
  formatZAR,
  PROJECT_TYPES,
  URGENCY_LEVELS,
  type AddOnId,
  type ProjectTypeId,
  type QuoteSelection,
  type UrgencyId,
} from "@/lib/quote-config";
import type { LeadFormQuotePrefill } from "@/components/lead-form";

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

type QuoteBuilderSectionProps = {
  onLockQuote: (quote: LeadFormQuotePrefill) => void;
};

function AnimatedZAR({ value }: { value: number }) {
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, { stiffness: 140, damping: 24, mass: 0.6 });
  const [display, setDisplay] = useState(() => formatZAR(value));

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(formatZAR(value));
      motionValue.set(value);
      return;
    }
    motionValue.set(value);
  }, [value, reduceMotion, motionValue]);

  useEffect(() => {
    if (reduceMotion) return;
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(formatZAR(Math.round(latest)));
    });
    return unsubscribe;
  }, [spring, reduceMotion]);

  return <span className="quote-builder-range__value tabular-nums">{display}</span>;
}

export function QuoteBuilderSection({ onLockQuote }: QuoteBuilderSectionProps) {
  const { sectionRef, sectionInView } = useSectionInView();
  const { prefersReducedMotion } = useDeviceProfile();
  const [selection, setSelection] = useState<QuoteSelection>(DEFAULT_QUOTE_SELECTION);

  const range = useMemo(() => computeQuoteRange(selection), [selection]);

  const setProjectType = (id: ProjectTypeId) =>
    setSelection((prev) => ({ ...prev, projectType: id }));
  const setExtraPages = (pages: number) => setSelection((prev) => ({ ...prev, extraPages: pages }));
  const setUrgency = (id: UrgencyId) => setSelection((prev) => ({ ...prev, urgency: id }));
  const toggleAddOns = (ids: string[]) =>
    setSelection((prev) => ({ ...prev, addOns: ids as AddOnId[] }));

  const handleLockQuote = () => {
    onLockQuote({ selection, range });
    navigateToSection("contact", prefersReducedMotion);
  };

  return (
    <section
      ref={sectionRef}
      id="quote"
      data-scroll-snap="quote"
      aria-labelledby="quote-heading"
      className={`quote-builder-section safe-area-x section-surface snap-section-flow relative isolate overflow-x-clip px-4 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14${sectionInView ? " quote-builder-in-view" : ""}`}
    >
      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <motion.header
          className="mb-8 text-center sm:mb-10"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={
            prefersReducedMotion || sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
          }
          transition={{ duration: 0.45, ease: REVEAL_EASE }}
        >
          <p className="quote-builder-eyebrow">What would this cost?</p>
          <h2
            id="quote-heading"
            className="quote-builder-heading font-display font-black uppercase tracking-tighter text-foreground"
          >
            Build your estimate
          </h2>
          <p className="quote-builder-subhead">
            Pick what you're building — see a live ZAR range as you go. Nothing here locks you in.
          </p>
        </motion.header>

        <div className="quote-builder-panel">
          <div className="quote-builder-field">
            <Label className="quote-builder-field-label">Project type</Label>
            <RadioGroup
              value={selection.projectType}
              onValueChange={(value) => setProjectType(value as ProjectTypeId)}
              className="grid grid-cols-1 gap-2 sm:grid-cols-2"
            >
              {PROJECT_TYPES.map((type) => (
                <label
                  key={type.id}
                  htmlFor={`quote-type-${type.id}`}
                  className={`quote-builder-option${
                    selection.projectType === type.id ? " quote-builder-option--active" : ""
                  }`}
                >
                  <RadioGroupItem value={type.id} id={`quote-type-${type.id}`} />
                  <span>
                    <span className="quote-builder-option__title">{type.label}</span>
                    <span className="quote-builder-option__desc">{type.description}</span>
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="quote-builder-field">
            <Label htmlFor="quote-extra-pages" className="quote-builder-field-label">
              Extra pages / sections — {selection.extraPages}
            </Label>
            <Slider
              id="quote-extra-pages"
              min={EXTRA_PAGES_MIN}
              max={EXTRA_PAGES_MAX}
              step={1}
              value={[selection.extraPages]}
              onValueChange={([value]) => setExtraPages(value)}
              aria-label="Extra pages or sections"
            />
          </div>

          <div className="quote-builder-field">
            <p className="quote-builder-field-label" id="quote-addons-label">
              Add-ons
            </p>
            <ToggleGroup
              type="multiple"
              value={selection.addOns}
              onValueChange={toggleAddOns}
              className="!justify-start flex-wrap gap-2"
              aria-labelledby="quote-addons-label"
            >
              {ADD_ONS.map((addOn) => (
                <ToggleGroupItem
                  key={addOn.id}
                  value={addOn.id}
                  variant="outline"
                  className="rounded-full border-input px-4 text-xs data-[state=on]:border-accent data-[state=on]:bg-accent/15 data-[state=on]:text-accent-foreground sm:text-sm"
                >
                  {addOn.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="quote-builder-field">
            <p className="quote-builder-field-label" id="quote-urgency-label">
              Timeline
            </p>
            <ToggleGroup
              type="single"
              value={selection.urgency}
              onValueChange={(value) => {
                if (value) setUrgency(value as UrgencyId);
              }}
              className="!justify-start flex-wrap gap-2"
              aria-labelledby="quote-urgency-label"
            >
              {URGENCY_LEVELS.map((level) => (
                <ToggleGroupItem
                  key={level.id}
                  value={level.id}
                  variant="outline"
                  className="rounded-full border-input px-4 data-[state=on]:border-accent data-[state=on]:bg-accent/15 data-[state=on]:text-accent-foreground"
                >
                  {level.label}
                  <span className="ml-1.5 opacity-60">· {level.description}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="quote-builder-range">
            <p className="quote-builder-range__label">Your estimate</p>
            <p className="quote-builder-range__amount">
              <AnimatedZAR value={range.min} /> – <AnimatedZAR value={range.max} />
            </p>
            <p className="quote-builder-range__note">Estimate, confirmed on the call.</p>
          </div>

          <button
            type="button"
            onClick={handleLockQuote}
            className="quote-builder-cta hero-btn hero-btn--primary touch-target"
          >
            <span>Lock this quote &amp; book a call</span>
          </button>
        </div>
      </div>
    </section>
  );
}
