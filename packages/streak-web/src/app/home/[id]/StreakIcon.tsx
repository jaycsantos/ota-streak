export default function StreakIcon({ completed }: { completed: boolean }) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {completed ? (
        <>
          <rect
            x="0.285713"
            y="0.5"
            width="24"
            height="24"
            rx="12"
            fill="currentColor"
          />
          <path
            d="M16.7857 9.5L10.4107 16L7.28571 12.8182"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <circle cx="12.7142" cy="12.5" r="8" fill="currentColor" />
      )}
    </svg>
  );
}
