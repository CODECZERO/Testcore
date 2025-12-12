import React from 'react';
import './SkeletonLoader.css';

interface SkeletonLoaderProps {
    variant?: 'text' | 'card' | 'circle' | 'table';
    width?: string;
    height?: string;
    count?: number;
}

/**
 * SkeletonLoader - Animated placeholder for loading states
 */
const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    variant = 'text',
    width,
    height,
    count = 1
}) => {
    const getClassName = () => {
        return `skeleton skeleton-${variant}`;
    };

    const getStyle = (): React.CSSProperties => {
        return {
            width: width || (variant === 'card' ? '100%' : variant === 'circle' ? '48px' : '100%'),
            height: height || (variant === 'card' ? '120px' : variant === 'circle' ? '48px' : '1rem'),
        };
    };

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className={getClassName()}
                    style={getStyle()}
                    aria-hidden="true"
                />
            ))}
        </>
    );
};

// Card skeleton with multiple elements
export const CardSkeleton: React.FC = () => (
    <div className="skeleton-card-container">
        <div className="skeleton-card-header">
            <SkeletonLoader variant="circle" width="40px" height="40px" />
            <div className="skeleton-card-title">
                <SkeletonLoader variant="text" width="60%" height="1rem" />
                <SkeletonLoader variant="text" width="40%" height="0.75rem" />
            </div>
        </div>
        <SkeletonLoader variant="text" width="100%" height="0.875rem" count={2} />
    </div>
);

// Table skeleton
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
    <div className="skeleton-table">
        <div className="skeleton-table-header">
            <SkeletonLoader variant="text" width="100%" height="2rem" />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="skeleton-table-row">
                <SkeletonLoader variant="text" width="100%" height="2.5rem" />
            </div>
        ))}
    </div>
);

export default SkeletonLoader;
