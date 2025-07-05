// "use client";

// import { useEffect, useState } from "react";

// interface PerformanceMetrics {
//   loadTime: number;
//   domContentLoaded: number;
//   firstContentfulPaint: number;
//   largestContentfulPaint: number;
// }

// export const usePerformanceMetrics = () => {
//   const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const measurePerformance = () => {
//       const navigation = performance.getEntriesByType(
//         "navigation"
//       )[0] as PerformanceNavigationTiming;
//       const paintEntries = performance.getEntriesByType("paint");

//       const fcp = paintEntries.find(
//         (entry) => entry.name === "first-contentful-paint"
//       );

//       setMetrics({
//         loadTime: navigation.loadEventEnd - navigation.startTime,
//         domContentLoaded:
//           navigation.domContentLoadedEventEnd - navigation.startTime,
//         firstContentfulPaint: fcp?.startTime || 0,
//         largestContentfulPaint: 0, // Will be updated by LCP observer
//       });
//     };

//     // Observer for Largest Contentful Paint
//     const lcpObserver = new PerformanceObserver((list) => {
//       const entries = list.getEntries();
//       const lastEntry = entries[entries.length - 1];

//       setMetrics((prev) =>
//         prev
//           ? {
//               ...prev,
//               largestContentfulPaint: lastEntry.startTime,
//             }
//           : null
//       );
//     });

//     lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

//     // Wait for page load to complete
//     if (document.readyState === "complete") {
//       measurePerformance();
//     } else {
//       window.addEventListener("load", measurePerformance);
//     }

//     return () => {
//       lcpObserver.disconnect();
//       window.removeEventListener("load", measurePerformance);
//     };
//   }, []);

//   return metrics;
// };

// interface PerformanceMonitorProps {
//   showMetrics?: boolean;
// }

// export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
//   showMetrics = process.env.NODE_ENV === "development",
// }) => {
//   const metrics = usePerformanceMetrics();

//   if (!showMetrics || !metrics) return null;

//   return (
//     <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-sm font-mono z-50">
//       <div className="font-bold mb-2">⚡ Performance Metrics</div>
//       <div>Load Time: {Math.round(metrics.loadTime)}ms</div>
//       <div>DOM Content Loaded: {Math.round(metrics.domContentLoaded)}ms</div>
//       <div>
//         First Contentful Paint: {Math.round(metrics.firstContentfulPaint)}ms
//       </div>
//       <div>
//         Largest Contentful Paint: {Math.round(metrics.largestContentfulPaint)}ms
//       </div>
//     </div>
//   );
// };
