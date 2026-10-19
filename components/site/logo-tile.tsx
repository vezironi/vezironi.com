import Image from "next/image";
import clsx from "clsx";

/** Logos sit on a fixed dark tile in both themes: some are white-on-transparent. */
export function LogoTile({ src, alt, size = 24, className }: { src: string; alt: string; size?: number; className?: string }) {
  return (
    <span
      className={clsx("grid shrink-0 place-items-center overflow-hidden rounded-md bg-[#111113] ring-1 ring-line", className)}
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt} width={size * 2} height={size * 2} className="size-full object-contain" />
    </span>
  );
}
