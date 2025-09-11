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
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4ZM0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
          fill="currentColor"
          fillOpacity="0.1"
        />
        <path
          d="M13.5 10H10V22H13.5V17.5H17.5L22 22V10L17.5 14.5H13.5V10Z"
          fill="currentColor"
        />
         <path d="M17.5 14.5L22 10H23V22L17.5 17.5H13.5V22H10V10H13.5V14.5H17.5Z" fill="url(#paint0_linear_logo_new)" />
        <defs>
          <linearGradient id="paint0_linear_logo_new" x1="16" y1="10" x2="16" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0.4"/>
            <stop offset="1" stopColor="white" stopOpacity="0.0"/>
          </linearGradient>
        </defs>
      </svg>
      <span className="text-2xl font-headline font-bold">KyluxeHaven</span>
    </div>
  );
}
