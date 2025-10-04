# Handwriting Tutor - Product Plan

## 🎯 Project Overview
A web-based handwriting practice app for children that uses computer vision to analyze letter formation in real-time. The app displays template letters on screen, captures handwriting via webcam, and provides instant feedback on form and alignment.

---

## 🚀 Phase 1: Core CV Functionality (PRIORITY)

### 1.1 Letter Template Display
- **Canvas-based letter rendering** with hollow outlines
- **Baseline guides** (horizontal reference line)
- **Stroke direction arrows** showing proper letter formation
- **Letter selector** UI for A-Z
- Scalable templates (adjustable size for different age groups)

### 1.2 Camera Setup & Calibration
- **Webcam integration** using React Webcam component
- **Camera-to-screen alignment** system
  - Calibration markers for coordinate mapping
  - Perspective transformation to align camera view with template
- **Real-time video feed** with overlay capabilities
- **Capture mechanism** for frame analysis

### 1.3 Computer Vision Pipeline (TensorFlow.js)
**Image Preprocessing:**
- Grayscale conversion
- Binary thresholding (isolate pencil marks)
- Noise removal (morphological operations)
- Letter region extraction (bounding box detection)

**Analysis Algorithms:**
- **Alignment Score (0-100)**
  - Detect bottom edge of handwriting
  - Compare to template baseline
  - Calculate deviation metrics
  
- **Form Score (0-100)**
  - Structural similarity (SSIM) between child's letter and template
  - Intersection over Union (IoU) for shape matching
  - Weighted combination for final score

**Overall Score:**
- Weighted average: `(Alignment × 0.4) + (Form × 0.6)`
- Pass threshold: 70%

### 1.4 Visual Feedback System
- **Color-coded overlays** (green/yellow/red based on score)
- **Real-time score bars** with percentages
- **Baseline deviation indicators**
- **Form similarity heatmap** (optional enhancement)

---

## 📱 Phase 2: Frontend Development

### 2.1 Practice Interface
- **Two-column layout**
  - Left: Template display with letter selector
  - Right: Live camera feed with analysis
- **Session controls**
  - Start/Stop practice
  - Next letter progression
  - Reset/Retry functionality
- **Encouragement system**
  - Positive feedback messages
  - Achievement badges for high scores

### 2.2 User Progress Tracking
**Local Storage (Browser-based):**
- Session history (letter, scores, timestamp)
- Per-letter statistics
- Overall progress metrics

**Data Structure:**
```javascript
{
  sessionId: "uuid",
  attempts: [
    {
      letter: "A",
      alignment: 85,
      form: 90,
      overall: 88,
      timestamp: "2025-01-15T10:30:00Z"
    }
  ]
}