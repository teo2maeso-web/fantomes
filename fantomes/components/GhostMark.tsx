export function GhostMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M32 5C18.7 5 8 16.5 8 30.6V54l6.5-6.5L21 54l6.5-6.5L34 54l6.5-6.5L47 54l6.5-6.5L56 54V30.6C56 16.5 45.3 5 32 5Z"
        fill="currentColor"
      />
      <circle cx="23.5" cy="27" r="3.2" fill="#16283D" />
      <circle cx="40.5" cy="27" r="3.2" fill="#16283D" />
    </svg>
  );
}
