"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * A borderless photograph that fades in over a shimmer.
 *
 * Emisho's media treatment: no plate, no hairline, no mount — the picture is
 * the whole object. The shimmer holds the slot while the file loads (800ms
 * ease-out fade, matching the reference), and the blanket reduced-motion rule
 * collapses both to presence without movement.
 */
export function Photo({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  caption,
  circle = false,
  roundedClassName = "rounded-[var(--radius-tile)]",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
  caption?: string;
  /** Crop to a circle. For a face, and only a face. */
  circle?: boolean;
  /** Corner treatment for the rectangular case. */
  roundedClassName?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <figure className="m-0">
      <div
        className={`frame-zoom relative overflow-hidden ${
          circle ? "rounded-full" : roundedClassName
        }`}
      >
        {!loaded && <span aria-hidden className="media-shimmer absolute inset-0" />}
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          onLoad={() => setLoaded(true)}
          className={`h-auto w-full transition-opacity duration-[800ms] ease-out ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 font-mono text-2xs uppercase tracking-wider text-ink-3">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
