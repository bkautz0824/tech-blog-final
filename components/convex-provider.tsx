"use client";

/**
 * Convex Provider Component
 *
 * Wraps the application with Convex client provider for real-time data access.
 * This component should be placed in the root layout to provide Convex
 * functionality throughout the app.
 */

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

interface ConvexClientProviderProps {
  children: ReactNode;
}

// Initialize Convex client with environment variable
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error(
    "NEXT_PUBLIC_CONVEX_URL environment variable is not set. " +
      "Please run 'npx convex dev' and add the URL to your .env.local file."
  );
}

const convex = new ConvexReactClient(convexUrl);

/**
 * ConvexClientProvider component
 *
 * Provides Convex client to all child components, enabling:
 * - Real-time queries with automatic updates
 * - Mutations for data modifications
 * - Optimistic updates for better UX
 * - Automatic reconnection handling
 *
 * @example
 * ```tsx
 * // In app/layout.tsx
 * import { ConvexClientProvider } from "@/components/convex-provider";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ConvexClientProvider>
 *           {children}
 *         </ConvexClientProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

export default ConvexClientProvider;
