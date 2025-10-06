/**
 * Batch 2H Upload Script - Articles 15-17 (Enhanced)
 *
 * Enhanced articles ready for Convex upload:
 * - Article 15: 3D Graphics & Animation Tools (3,200+ words)
 * - Article 16: Audio/Video AI Tools (3,100+ words)
 * - Article 17: Developer Utilities & Best Practices (3,300+ words)
 *
 * Run: export NEXT_PUBLIC_CONVEX_URL=https://different-vole-632.convex.cloud && npx tsx batch-2h-upload-script.ts
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Article 15: 3D Graphics & Animation Tools - Enhanced
const article15 = {
  id: "3d-graphics-animation-tools-comprehensive-guide",
  title: "3D Graphics & Animation Tools: Building Immersive Web Experiences",
  description: "Master modern 3D web development with Three.js R166+, React Three Fiber, Spline, and advanced WebGL techniques. Create interactive 3D experiences with optimized performance.",
  category: "3D Graphics & Animation",
  date: "2025-09-16",
  content: fs.readFileSync(path.join(__dirname, 'article-15-3d-enhanced.md'), 'utf-8'),
  urls: [
    { title: "Three.js Documentation", url: "https://threejs.org/docs" },
    { title: "React Three Fiber", url: "https://docs.pmnd.rs/react-three-fiber" },
    { title: "Spline Design", url: "https://spline.design" },
    { title: "Drei Components", url: "https://github.com/pmndrs/drei" }
  ],
  keyFeatures: [
    { title: "Three.js R166+ Advanced Features", description: "Modern WebGL rendering with latest performance optimizations" },
    { title: "React Three Fiber Patterns", description: "Declarative 3D development with React components" },
    { title: "Custom WebGL Shaders", description: "Build unique visual effects with GLSL" },
    { title: "Spline Integration", description: "No-code 3D design tools for rapid prototyping" },
    { title: "GPU Particle Systems", description: "High-performance particle effects at 60fps" },
    { title: "Framer Motion 3D", description: "Declarative animations for 3D scenes" },
    { title: "GSAP ScrollTrigger", description: "Scroll-based 3D animations" },
    { title: "LOD Optimization", description: "Level of detail systems for performance" },
    { title: "DRACO Compression", description: "Optimized model loading and compression" },
    { title: "Production Deployment", description: "Asset pipelines and performance monitoring" }
  ],
  tags: ["Three.js", "React Three Fiber", "WebGL", "3D Graphics", "Animation", "Spline", "Shaders", "Performance Optimization"],
  wordCount: 3247,
  qualityScore: 90,
  published: true,
  slug: "3d-graphics-animation-tools-comprehensive-guide",
  readingTime: 16
};

// Article 16: Audio/Video AI Tools - Enhanced
const article16 = {
  id: "audio-video-ai-tools",
  title: "Audio/Video AI Tools: The Complete Guide to Next-Generation Media Processing",
  description: "Master cutting-edge audio/video AI tools including ElevenLabs Studio 3.0, real-time voice synthesis, FFmpeg integration, and WebRTC for modern media applications.",
  category: "AI Tools",
  date: "2025-09-16",
  content: fs.readFileSync(path.join(__dirname, 'article-16-audio-video-enhanced.md'), 'utf-8'),
  urls: [
    { title: "ElevenLabs API", url: "https://elevenlabs.io/docs" },
    { title: "Luma Labs", url: "https://lumalabs.ai" },
    { title: "FFmpeg Documentation", url: "https://ffmpeg.org/documentation.html" },
    { title: "WebRTC API", url: "https://webrtc.org" }
  ],
  keyFeatures: [
    { title: "ElevenLabs Studio 3.0", description: "Advanced voice synthesis and cloning capabilities" },
    { title: "Real-Time Voice Streaming", description: "WebSocket-based low-latency voice generation" },
    { title: "AI Video Generation", description: "Luma Ray3 for cinematic AI video creation" },
    { title: "FFmpeg Integration", description: "Server and client-side video processing" },
    { title: "WebRTC Audio Processing", description: "Real-time audio manipulation and streaming" },
    { title: "Audio Worklet API", description: "Advanced real-time audio processing" },
    { title: "Adaptive Bitrate Streaming", description: "HLS/DASH streaming implementation" },
    { title: "AI Audio Enhancement", description: "Noise reduction and vocal separation" },
    { title: "Media Pipeline Automation", description: "Complete video processing workflows" },
    { title: "Performance Optimization", description: "Edge processing and streaming efficiency" }
  ],
  tags: ["ElevenLabs", "AI Voice", "Video Processing", "FFmpeg", "WebRTC", "Streaming", "Audio Enhancement", "Media Pipeline"],
  wordCount: 3156,
  qualityScore: 89,
  published: true,
  slug: "audio-video-ai-tools",
  readingTime: 16
};

// Article 17: Developer Utilities & Best Practices - Enhanced
const article17 = {
  id: "developer-utilities-best-practices",
  title: "Developer Utilities & Best Practices: Essential Tools for Modern Web Development",
  description: "Master essential developer utilities including CLI automation, Git workflows, Docker, code quality tools, debugging techniques, and CI/CD pipelines for 2025.",
  category: "Developer Tools",
  date: "2025-09-18",
  content: fs.readFileSync(path.join(__dirname, 'article-17-developer-utilities-enhanced.md'), 'utf-8'),
  urls: [
    { title: "Bun Runtime", url: "https://bun.sh" },
    { title: "Docker Documentation", url: "https://docs.docker.com" },
    { title: "ESLint", url: "https://eslint.org" },
    { title: "Playwright", url: "https://playwright.dev" }
  ],
  keyFeatures: [
    { title: "Advanced CLI Tools", description: "Custom automation with Bun and Deno" },
    { title: "Git Workflow Automation", description: "Pre-commit hooks and intelligent workflows" },
    { title: "Docker Multi-Stage Builds", description: "Optimized containerization strategies" },
    { title: "ESLint Flat Config", description: "Modern linting with 2025 configuration" },
    { title: "Type-Safe Environment", description: "Zod-validated environment variables" },
    { title: "Advanced Debugging", description: "Browser DevTools and VS Code mastery" },
    { title: "Performance Monitoring", description: "OpenTelemetry and Web Vitals tracking" },
    { title: "Error Tracking", description: "Sentry integration and error boundaries" },
    { title: "Testing Infrastructure", description: "Vitest and Playwright configuration" },
    { title: "CI/CD Excellence", description: "GitHub Actions automated pipelines" }
  ],
  tags: ["CLI Tools", "Git", "Docker", "ESLint", "Debugging", "Performance", "Testing", "CI/CD", "Monitoring"],
  wordCount: 3312,
  qualityScore: 91,
  published: true,
  slug: "developer-utilities-best-practices",
  readingTime: 17
};

async function uploadBatch2H() {
  console.log('🚀 Starting Batch 2H Upload - Articles 15-17 (Enhanced)');
  console.log('================================================\n');

  const articles = [article15, article16, article17];
  const results = [];

  for (const article of articles) {
    try {
      console.log(`📝 Uploading: ${article.title}`);
      console.log(`   ID: ${article.id}`);
      console.log(`   Category: ${article.category}`);
      console.log(`   Word Count: ${article.wordCount} words`);
      console.log(`   Quality Score: ${article.qualityScore}/100`);
      console.log(`   Reading Time: ${article.readingTime} min`);

      const result = await client.mutation(api.articles.createArticle, article);

      console.log(`✅ Successfully uploaded: ${article.id}`);
      console.log(`   Article ID: ${result}\n`);

      results.push({ id: article.id, _id: result, status: 'success' });
    } catch (error: any) {
      console.error(`❌ Error uploading ${article.id}:`, error);
      results.push({ id: article.id, error: error.message, status: 'failed' });
    }
  }

  console.log('\n================================================');
  console.log('📊 Batch 2H Upload Summary');
  console.log('================================================');
  console.log(`Total articles: ${articles.length}`);
  console.log(`Successful: ${results.filter(r => r.status === 'success').length}`);
  console.log(`Failed: ${results.filter(r => r.status === 'failed').length}`);
  console.log('\n📈 Quality Metrics:');
  console.log(`Average Word Count: ${Math.round(articles.reduce((sum, a) => sum + a.wordCount, 0) / articles.length)}`);
  console.log(`Average Quality Score: ${Math.round(articles.reduce((sum, a) => sum + a.qualityScore, 0) / articles.length)}`);
  console.log('\n✨ Batch 2H upload complete!');

  return results;
}

// Run the upload
uploadBatch2H()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

export { uploadBatch2H };
