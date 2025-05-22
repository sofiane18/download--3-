"use client"; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] p-4 text-center">
      <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
      <h2 className="text-2xl font-semibold text-destructive mb-2">Oops, something went wrong!</h2>
      <p className="text-muted-foreground mb-6">
        We encountered an unexpected error. Please try again.
      </p>
      <p className="text-xs text-muted-foreground mb-6">
        Error: {error.message}
        {error.digest && <span className="block">Digest: {error.digest}</span>}
      </p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
