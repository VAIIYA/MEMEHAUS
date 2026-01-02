'use client';

import React, { memo } from 'react';

interface LoadingSkeletonProps {
  count?: number;
}

export const LoadingSkeleton = memo<LoadingSkeletonProps>(({ count = 8 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-black/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-0 overflow-hidden animate-pulse"
        >
          {/* Image Placeholder */}
          <div className="w-full aspect-square bg-gray-800/50"></div>

          {/* Info Placeholder */}
          <div className="p-5">
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="h-12 bg-gray-800/50 rounded-lg"></div>
              <div className="h-12 bg-gray-800/50 rounded-lg"></div>
            </div>

            <div className="border-t border-gray-700/50 pt-3">
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';
