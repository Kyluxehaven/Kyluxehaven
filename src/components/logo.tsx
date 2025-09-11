import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-primary", className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        aria-hidden="true"
      >
        <path
          d="M6 26L6 6L11.5 6L17 13.5L22.5 6L28 6L28 26L22.5 26L22.5 13L17 20.5L11.5 13L11.5 26L6 26Z"
          fill="currentColor"
        />
        <path d="M17 13.5L22.5 6H28V10L20 20.5L17 25L6 6H11.5L17 13.5Z" fill="url(#paint0_linear_1_2)" />
        <defs>
          <linearGradient id="paint0_linear_1_2" x1="17" y1="6" x2="17" y2="25" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0.3"/>
            <stop offset="1" stopColor="white" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
      <span className="text-2xl font-headline font-bold">KyluxeHaven</span>
    </div>
  );
}
