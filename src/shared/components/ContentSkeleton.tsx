/**
 * @file ContentSkeleton.tsx
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description 内容加载骨架屏组件
 */
import React from 'react';

const ContentSkeleton: React.FC = () => {
  return (
    <div className="h-full bg-app-card rounded-lg shadow-sm animate-pulse">
      <div className="p-6">
        {/* 标题骨架 */}
        <div className="h-8 bg-gray-200 rounded-md w-3/4 mb-6"></div>
        
        {/* 内容骨架 */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        
        {/* 代码块骨架 */}
        <div className="mt-8 p-4 bg-gray-100 rounded-md">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-4/5"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSkeleton; 