
import { forwardRef } from "react";

interface LoadMoreIndicatorProps {
  isFetchingNextPage: boolean;
}

const LoadMoreIndicator = forwardRef<HTMLDivElement, LoadMoreIndicatorProps>(
  ({ isFetchingNextPage }, ref) => {
    return (
      <div ref={ref} className="py-8 flex justify-center">
        {isFetchingNextPage && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-movie-accent"></div>
            <p className="mt-2">Loading more movies...</p>
          </div>
        )}
      </div>
    );
  }
);

LoadMoreIndicator.displayName = "LoadMoreIndicator";

export default LoadMoreIndicator;
