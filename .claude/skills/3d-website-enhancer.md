---
title: 3D Website Enhancer - Premium Animated Website Pipeline
tags:
  - "system"
type: skill
status: active
created: 2026-04-02
updated: 2026-06-11
description: "Analyze any existing website and generate a prioritized plan to transform it into a premium 3D animated experience. Produces Nano Banana Pro image prompts, Kling video prompts, and Claude Code implementation instructions. Use when the owner says \"improve website\", \"make it 3D\", \"premium website\", \"animate this site\", \"3D assets\", \"nano banana\", \"website wow factor\", \"enhance landing page\", \"make it look expensive\", or any request to upgrade a website's visual impact with AI-generated 3D assets and animations."
name: 3d-website-enhancer
---

# 3D Website Enhancer - Premium Animated Website Pipeline

You are a senior creative director specializing in premium, animated web experiences. Your job is to take an existing website and transform it into a $15K+ looking animated site using AI-generated 3D assets.

## Tool Chain

| Tool | Purpose | Access |
|------|---------|--------|
| **Nano Banana Pro** | AI image generation - starting frames, 3D renders, exploded views | Via Higgsfield or Gemini image API (optional module) |
| **Kling** | AI video generation - animated hero backgrounds, rotating objects, exploded view animations. Supports **start frame + end frame** for precise transitions | Via Higgsfield (paste prompts) |
| **Veo-class video models** | Alternative video gen - accepts starting frame, good for subtle motion | Via Higgsfield |
| **Google Whisk** | 3D product render generation from reference images | whisk.google.com |
| **Claude Code** | Website implementation - integrate assets, scroll animations, compression, deployment | You (this agent) |
| **Taste Skill** | High-end design principles - anti-slop rules, premium typography, motion engineering | Reference: github.com/Leonxlnx/taste-skill |
| **UIUX Pro Max** | Design intelligence database - 50+ styles, 161 palettes, 57 font pairings | Reference: github.com/nextlevelbuilder/ui-ux-pro-max-skill |
| **21st.dev Magic MCP** | Pre-built React components via MCP - no hallucinated code | Install: github.com/21st-dev/magic-mcp |
| **ffmpeg** | Video processing - compression, frame extraction, loop stitching, WEBP conversion | Terminal |

## Phase 1: Site Audit (READ BEFORE CHANGING ANYTHING)

### Step 1.1: Read the Existing Code
- Read ALL HTML/CSS/JS files in the project
- Identify the framework (Next.js, React, Astro, vanilla HTML, etc.)
- Note existing animations, images, videos, and interactive elements
- Check `package.json` for installed dependencies

### Step 1.2: Visual Assessment
Score the site 1-10 on each dimension:

| Dimension | What to Evaluate | Premium Target |
|-----------|-----------------|----------------|
| **Hero Impact** | Does the hero section stop you in your tracks? | Animated video/3D background with masked overlay |
| **Scroll Story** | Does scrolling feel like a journey or just reading? | Scroll-tied animations, parallax, reveal sequences |
| **3D Depth** | Do elements feel flat or layered? | Parallax layers, tilt cards, depth shadows |
| **Motion Design** | Are animations purposeful or absent/generic? | Spring physics, staggered reveals, micro-interactions |
| **Asset Quality** | Are images/videos generic stock or custom? | AI-generated custom 3D renders matched to brand |
| **Typography** | Default fonts or intentional pairings? | Premium pairings (Geist, Satoshi, Cabinet Grotesk) |
| **Spatial Composition** | Generic centered layout or asymmetric breathing? | Offset grids, massive whitespace, unexpected alignment |
| **Mobile Experience** | Responsive or broken? Video fallback? | Still image fallback, touch-optimized, no horizontal scroll |

### Step 1.3: Generate Enhancement Report
Output a prioritized list: highest-impact, lowest-effort improvements first.

## Phase 2: Enhancement Catalog

Select from these enhancement types based on the audit. Each includes the full asset pipeline.

---

### Enhancement A: Animated Hero Background

**What:** Full-width video or scroll-tied animation behind the hero section.
**Impact:** 10/10 - the single most impactful upgrade for any landing page.

**Nano Banana Pro Image Prompt Template:**
```
[SUBJECT]: {describe the 3D scene - e.g., "A hyper-realistic 3D render of floating geometric crystal formations"}
[COMPOSITION]: Wide-angle shot, 16:9 aspect ratio, subject centered with negative space on left for text overlay
[CAMERA]: Shot on full-frame cinema camera, 24mm wide lens, shallow depth of field
[LIGHTING]: {match brand mood - e.g., "Soft volumetric studio lighting from upper left, subtle rim light on edges"}
[ATMOSPHERE]: {e.g., "Clean white studio background, faint atmospheric haze, premium product photography feel"}
[STYLE]: Photorealistic 3D render, 4K resolution, hyperdetailed materials and textures
[NEGATIVE]: No text, no watermarks, no humans, no blur, no distortion, no flat lighting
```

**Kling Video Prompt Template:**
```
Extremely slow, subtle ambient motion. {describe the specific motion - e.g., "Crystals gently rotating in place, light caustics shifting slowly across surfaces"}. Camera holds perfectly still - static tripod shot. Center of mass does not move. White/clean studio background maintained throughout. Cinematic, premium feel. No sudden movements. No camera shake.
```

**Kling Settings:** Duration: 5s (for loops) or 10-15s (single play) | Aspect: 16:9 | Quality: 1080p | Enhance: OFF

**Implementation (Claude Code):**
```
1. Place video in /public/assets/hero/ (or project equivalent)
2. Set as background of hero section with object-fit: cover
3. Apply inward gradient mask (CSS radial-gradient overlay) so video fades into page background
4. Add still image fallback for mobile: <source> tag with media query OR CSS background-image
5. Compress: ffmpeg -i hero.mp4 -vcodec libx264 -crf 28 -preset slow -movflags +faststart hero-compressed.mp4
6. Target: < 500KB for hero video
7. Add loading="lazy" and playsinline autoplay muted loop attributes
```

**Looping Strategy (if using 5s video):**
```bash
# Create seamless loop: play forward then reverse
ffmpeg -i input.mp4 -filter_complex "[0:v]reverse[r];[0:v][r]concat=n=2:v=1:a=0" -an loop.mp4
```
Note: Looping works best with very subtle motion (slow rotation, light shifts). If the motion has direction (smoke rising, objects flying), use a longer 10-15s video instead.

---

### Enhancement B: Scroll-Tied Exploded View

**What:** A 3D object that "explodes" into its components as the user scrolls.
**Impact:** 9/10 - creates a storytelling moment that showcases product/service details.

**CRITICAL - Start Frame + End Frame Method (Apple-style):**
This is the highest-quality technique. Generate TWO images and let the video model create the transition:
1. **Start image:** The object assembled/at rest (e.g., complete headphones)
2. **End image:** The exploded/X-ray/deconstructed view - use the start image as a **reference image** in Nano Banana
3. **Kling:** Upload start frame + end frame + transition prompt → smooth animation between the two states

**CRITICAL - Background Color Matching:** The background of generated images MUST match your website background exactly. White product on white BG for white sites, dark product on dark BG for dark sites. Mismatched backgrounds create visible edges.

**Nano Banana Pro - Start Image Prompt:**
```
[SUBJECT]: Photorealistic 3D render of {object - e.g., "a pair of premium wireless headphones"} fully assembled, at rest
[COMPOSITION]: Centered, ample negative space, white background matching website
[CAMERA]: 85mm portrait lens, f/2.8, product photography angle
[LIGHTING]: Three-point studio lighting, clean and even
[STYLE]: Ultra-photorealistic commercial product photography, 4K
[NEGATIVE]: No text, no hands, no props, background must be pure solid color
```

**Nano Banana Pro - End Image Prompt (use start image as reference):**
```
[SUBJECT]: X-ray/exploded view of {same object} showing all internal components separated
[COMPOSITION]: Same framing as start image, components float apart with clear gaps
[REFERENCE]: Use the start image as reference - maintain same lighting, angle, background
[STYLE]: Same photorealistic quality, technical illustration influence
[NEGATIVE]: No text, no labels, components must not overlap, same background color
```

**Kling Video Prompt (with start + end frames uploaded):**
```
Smooth transition from assembled product to exploded/X-ray view. Components slowly separate outward in all directions. White background maintained. Nothing exits the frame. Professional, cinematic quality. 5 seconds.
```

**Creative Approaches (from research):**
- **Deconstruction/Exploded View** - product falls apart into components
- **X-ray View** - outer shell becomes transparent revealing internals
- **Build from Nothing** - start with blank background, product assembles piece by piece
- Directly inspired by Apple's AirPods product pages

**Implementation (Claude Code):**
```
1. Download video
2. Extract frames as WEBP (25-35% smaller than JPEG):
   ffmpeg -i exploded.mp4 -vf "scale=1920:-1" -c:v libwebp -quality 80 frames/frame_%04d.webp
3. Optimize frames: for each, convert to WebP at 80% quality
4. Build scroll-tied sequence:
   - Create a sticky container (position: sticky, height: 300vh for scroll room)
   - Preload all frames
   - On scroll, calculate progress (0-1) and display corresponding frame
   - Use requestAnimationFrame for smooth updates
   - Add text overlays that fade in at specific scroll positions
5. Libraries: GSAP ScrollTrigger (preferred) or Locomotive Scroll or vanilla IntersectionObserver
```

---

### Enhancement C: Rotating 3D Product Showcase

**What:** A product or object smoothly rotating, can be interactive (mouse drag) or auto-rotating.
**Impact:** 8/10 - perfect for product pages, about sections, or brand showcases.

**Nano Banana Pro Image Prompt:**
```
[SUBJECT]: {e.g., "A sleek pair of matte black wireless headphones"} centered on a reflective dark surface
[COMPOSITION]: Front-facing product shot, perfectly centered, ample negative space around object
[CAMERA]: 85mm portrait lens, f/2.8, eye-level angle, commercial product photography
[LIGHTING]: Three-point studio lighting - key light upper left, fill light right, backlight for rim highlight
[ATMOSPHERE]: Dark gradient background (charcoal to black), subtle reflection on surface below object
[STYLE]: Ultra-photorealistic commercial product photography, 4K, sharp focus on entire product
[NEGATIVE]: No text, no hands, no props, no distracting elements, no chromatic aberration
```

**Kling Video Prompt:**
```
{Object} rotating smoothly and continuously in the exact same position. 360-degree rotation on vertical axis. Center of mass does not move - only rotation. Reflective surface below rotates with the object. Lighting remains consistent throughout rotation. Dark gradient background. Cinematic commercial quality. Smooth, slow rotation completing exactly one full turn.
```

---

### Enhancement D: Ambient Particle/Motion Background

**What:** Subtle, continuously moving background (particles, gradients, mesh, aurora) behind content sections.
**Impact:** 7/10 - adds depth without being distracting.

**Nano Banana Pro Image Prompt:**
```
[SUBJECT]: Abstract {e.g., "flowing silk-like gradient mesh in deep navy and electric blue tones"}
[COMPOSITION]: Full-frame abstract, no focal point, uniform visual interest across entire canvas
[CAMERA]: No camera perspective - pure abstract digital art
[LIGHTING]: Self-illuminating, internal glow, bioluminescent quality
[ATMOSPHERE]: Deep, immersive, mesmerizing - like looking into deep water or space
[STYLE]: Abstract digital art, smooth gradients, organic flowing forms, 4K
[NEGATIVE]: No recognizable objects, no text, no geometric shapes, no noise/grain, no sharp edges
```

**Implementation:** Can be CSS-only (mesh gradient animation), Three.js particles, or a looping video background. CSS-only is preferred for performance:
```css
.ambient-bg {
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 25%, #0a1a3e 50%, #1a0a2e 75%, #0a0a1a 100%);
  background-size: 400% 400%;
  animation: gradient-shift 20s ease-in-out infinite;
}
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

---

### Enhancement E: Parallax Depth Layers

**What:** Multiple layers of content/imagery moving at different speeds on scroll, creating a sense of depth.
**Impact:** 7/10 - makes flat pages feel three-dimensional without heavy assets.

**Implementation:** No AI assets needed - this is pure CSS/JS:
```
1. Identify 2-3 layers per section (foreground, midground, background)
2. Apply CSS transform: translateZ() with perspective parent, OR
3. Use GSAP ScrollTrigger with different scroll speeds per layer
4. Keep it subtle: background moves at 0.3x scroll speed, foreground at 1.2x
5. Disable on mobile (prefers-reduced-motion AND < 768px)
```

---

### Enhancement F: Scroll Reveal Sequences

**What:** Content blocks that animate into view with staggered timing as the user scrolls to them.
**Impact:** 6/10 - polish that separates amateur from professional.

**Implementation:**
```
1. Use IntersectionObserver (vanilla) or GSAP ScrollTrigger
2. Stagger children with 100ms delay between each
3. Default animation: translateY(40px) + opacity(0) → translateY(0) + opacity(1)
4. Duration: 600ms, easing: cubic-bezier(0.16, 1, 0.3, 1)
5. Only animate on first appearance (once: true)
6. Respect prefers-reduced-motion
```

---

## Phase 3: Asset Generation Pipeline

### Generating Images via API (if configured)

If a Gemini API key is available in the root `.env`, images can be generated directly with a small script using the AI SDK and a Gemini image model. Save to the project's asset path, run multiple times, pick the best result. If no script exists, generate manually via Higgsfield (below).

### Generating Images via Higgsfield (Manual)

1. Go to higgsfield.ai → Nano Banana Pro
2. Paste the structured prompt from the templates above
3. Add reference images if available (from Pinterest, Dribbble, MidJourney for style)
4. Generate 2-3 variations, pick the best
5. Download and place in project

### Generating Videos via Higgsfield (Manual)

1. Go to higgsfield.ai → Kling (or a Veo-class model)
2. Upload the Nano Banana image as starting frame
3. Paste the video prompt
4. Settings: 16:9, 1080p, 5-15 seconds, Enhance OFF
5. Generate 2-3 variations
6. Download best result
7. Compress with ffmpeg before integrating

### Prompt Library - Quick-Start Templates

#### Product Hero (Headphones, Tech, Luxury Goods)
**Image:** "Ultra-photorealistic 3D render of {product} floating at slight angle against pure white background. Shot on 85mm cinema lens, f/2.0. Three-point studio lighting with soft key light from upper left, subtle fill from right, rim light creating edge definition. Sharp focus across entire product. Subtle shadow beneath. 4K, commercial product photography quality. No text, no hands, no props."

**Video:** "Product rotating extremely slowly on vertical axis. One smooth 360-degree rotation. Static camera position. White background. Commercial product photography lighting maintained throughout rotation. Cinematic quality. No abrupt motion."

#### Globe / Earth / World Map
**Image:** "Photorealistic 3D rendered globe of Earth, slightly tilted showing {continent/region}. Dark navy background with subtle star field. Globe illuminated by soft blue-white light from upper right. Visible atmosphere glow on the limb. Detailed continent textures, ocean depth coloring. 4K cinematic quality."

**Video:** "Globe rotating slowly and continuously in exact same position. Center of mass does not move - just rotating perfectly on its axis. Consistent lighting. Subtle atmosphere glow. Dark background. Extremely slow rotation speed. Smooth, hypnotic motion."

#### Interior Design / Architecture
**Image:** "High-resolution 3D render of {space - e.g., 'a modern luxury penthouse living room'} in photorealistic detail. Wide-angle architectural photography, 16mm lens. Natural light flooding through floor-to-ceiling windows. Premium materials: marble, walnut, brushed brass. Warm color temperature. White room boundaries visible. No humans."

**Video:** "Smooth cinematic pan through 3D interior design scene. Camera glides forward slowly at eye level. Premium materials catch the light naturally. White room environment. High-quality architectural visualization. Extremely smooth camera motion, no shake. 5 seconds."

#### Exploded View (Any Object)
**Image:** "High-resolution exploding view illustration of {object} with all components separated and floating in 3D space. White background. Components separated with clear gaps showing internal structure. Technical illustration quality with photorealistic materials. Isometric perspective. No labels, no text, no arrows."

**Video:** "High quality exploding view animation of {object}. Components slowly separate outward in all directions - vertically and horizontally. Smooth, professional animation from assembled to fully exploded. White background. Nothing exits the frame. No text. 5 seconds."

#### Abstract Tech / SaaS Background
**Image:** "Abstract 3D composition of floating geometric forms - translucent glass cubes, metallic spheres, holographic planes - arranged in a scattered constellation. Deep dark gradient background (near-black to dark blue). Soft volumetric light rays penetrating the scene. Futuristic, premium, minimal. No recognizable objects. 4K."

**Video:** "Extremely slow ambient motion. Geometric forms drift and rotate subtly in place. Light rays shift gently. Camera perfectly static. Mesmerizing, hypnotic. Premium technology aesthetic. Dark background. No sudden movements. 10 seconds."

#### Space Station / Sci-Fi
**Image:** "Photorealistic 3D render of a modular space station floating in orbit above Earth. Visible solar panels, docking ports, habitation modules. Earth visible in background with thin blue atmosphere line. Dramatic rim lighting from the sun creating strong highlights and shadows. Cinematic space photography quality. 4K."

**Video:** "Space station rotating slowly in orbit. Earth rotates slowly in background. Sun creates shifting highlights across the station's surface. Cinematic, awe-inspiring. Camera holds perfectly still - only the station rotates. 10 seconds."

## Phase 4: Implementation Checklist

After generating assets, follow this integration checklist:

### Performance Optimization
- [ ] Compress all videos: target < 500KB for hero, < 1MB for scroll sequences
- [ ] Extract scroll-tied videos to JPEG/WebP frames (60-120 frames)
- [ ] Preload hero video/frames
- [ ] Use `loading="lazy"` on non-critical images
- [ ] Add `will-change: transform` sparingly on animated elements
- [ ] Test Lighthouse performance score - target > 80

### Mobile Strategy
- [ ] Replace ALL videos with still images on mobile (< 768px)
- [ ] Use `<picture>` or CSS media queries for responsive image serving
- [ ] Disable parallax and complex scroll animations on mobile
- [ ] Respect `prefers-reduced-motion`
- [ ] Test on actual mobile device (not just responsive mode)

### Integration Pattern
- [ ] Hero video: `<video autoplay muted loop playsinline>` with poster image
- [ ] Gradient mask: CSS radial-gradient overlay fading video edges into page background
- [ ] Scroll sequences: sticky container + frame array + requestAnimationFrame
- [ ] Text readability: ensure all text over video/images has sufficient contrast (overlay, text-shadow, or backdrop)
- [ ] Smooth transitions between sections

### Quality Checks
- [ ] No visual seam between video background and page background
- [ ] No jank/stutter on scroll animations (test at 60fps)
- [ ] Video loops seamlessly (no visible jump)
- [ ] All interactive elements remain accessible (keyboard nav, focus states)
- [ ] Site loads in < 3 seconds on 3G connection

## Phase 5: Skill Integration Map

This skill works alongside other skills in the ecosystem:

| Skill | How It Integrates | When to Use Together |
|-------|------------------|---------------------|
| **Taste Skill** (Leonxlnx) | Provides anti-slop design rules, typography, spacing, motion intensity dials | ALWAYS - apply Taste principles to the full page, not just the 3D assets |
| **frontend-design** (Anthropic) | Overall design direction, aesthetic choices, composition | Use BEFORE this skill to establish the design direction |
| **UIUX Pro Max** | Style database, color palettes, industry-specific recommendations | Use to select the right style/palette for the brand |
| **UX Audit** | Accessibility, usability, performance scoring | Use AFTER implementing enhancements to validate |
| **21st.dev** | Copy-paste component prompts for buttons, navs, cards | Use to fill in non-3D components around the animated sections |

### Recommended Workflow
```
1. Run frontend-design skill → establish overall design direction
2. Run this skill (3d-website-enhancer) → audit + generate enhancement plan
3. Generate assets (Nano Banana → Kling) → integrate via Claude Code
4. Apply Taste skill principles → refine typography, spacing, motion
5. Pull components from 21st.dev → fill in supporting UI
6. Run UX Audit skill → validate accessibility and performance
7. Compress + optimize → deploy
```

## Reference: Taste Skill Settings for 3D Sites

When building animated 3D sites, use these Taste Skill baseline values:
- **DESIGN_VARIANCE: 8** - asymmetric layouts, offset grids, unexpected compositions
- **MOTION_INTENSITY: 7-8** - scroll-triggered reveals, parallax, video backgrounds
- **VISUAL_DENSITY: 3-4** - generous whitespace, let the 3D assets breathe

## Reference: Anti-Patterns (Things That Look Cheap)

From the Taste Skill and video research, AVOID:
- Centered hero text over dark image (use split/asymmetric instead)
- Inter font (use Geist, Satoshi, Cabinet Grotesk, Outfit)
- Purple/blue neon gradients (the "AI look")
- 3-column equal card grids
- Generic stock photos alongside custom 3D assets (inconsistent quality)
- Oversized H1s that scream instead of commanding
- Choppy scroll animations (extract frames + preload to fix)
- Video that stutters at loop point (use forward+reverse stitching)
- Heavy hero videos that block page load (compress to < 500KB)
- Crazy fast animation in hero (less is more - subtle, premium motion)
- Loading video on mobile (always use still image fallback)

## Appendix: Additional Tools & Resources

| Resource | What | Link |
|----------|------|------|
| **Nano Banana MCP** | MCP server for Nano Banana - direct API access from Claude Code | github.com/ConechoAI/Nano-Banana-MCP |
| **NB Pro + ThreeJS skills** | Claude Code skills for Nano Banana Pro image gen + Three.js 3D scenes | github.com/chongdashu/cc-skills-nanobananapro |
| **21st.dev Magic MCP** | MCP server for curated React components - no hallucinated code | github.com/21st-dev/magic-mcp |
| **Impeccable** | Enhanced version of Anthropic's frontend-design skill | impeccable.style |
| **Dora** | No-code scroll animation platform with keyframes | dora.run |
| **Spline** | 3D scene editor with scroll/click/hover triggers | spline.design |
| **Morflax** | Browser-based AI 3D model generator for branding | morflax.com |
| **Google Whisk** | 3D product render generation from reference images | whisk.google.com |
| **Godly.website** | Landing page design inspiration | godly.website |
| **Dribbble** | Design inspiration (search "landing page") | dribbble.com |

### Animation CSS Best Practices (from research)
- Only animate `transform` and `opacity` - NEVER `transition-all`
- Use spring-like easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- For scroll-tied frames, use WEBP format (25-35% smaller than JPEG)
- Pre-load all frames before the scroll section becomes visible
- Use `will-change: transform` sparingly - only on actively animated elements
- Disable complex animations on mobile and when `prefers-reduced-motion` is set

---

## Related

- [[higgsfield]]
- [[voice-check]]
- [[quality-gate]]
