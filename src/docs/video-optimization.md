# Video Background Optimization Guide

## Video Specifications
For optimal performance, prepare your video with these specifications:

1. **Resolution**: 1920x1080 (Full HD)
   - Will automatically scale down for smaller screens
   - Maintains quality on larger displays

2. **Format**: MP4 with H.264 encoding
   - Broad browser compatibility
   - Efficient compression

3. **Duration**: 10-15 seconds
   - Keep it short for faster loading
   - Loop seamlessly

4. **File Size Target**: Under 5MB
   - Compress using HandBrake or similar tools
   - Use these HandBrake settings:
     - Video Codec: H.264
     - Framerate: 30 fps
     - Quality: RF 23-28
     - Audio: Remove
     - Profile: High
     - Level: 4.1

## Implementation Steps

1. Place your optimized video in:
   ```
   public/background-video.mp4
   ```

2. Create a poster image (first frame of video):
   - Save as JPG at 80% quality
   - Place in:
   ```
   public/video-poster.jpg
   ```

3. The component will automatically:
   - Lazy load the video
   - Show poster image first
   - Fade in video when loaded
   - Handle mobile optimization

## Mobile Optimization Tips

- Video will be muted by default (required for autoplay)
- Using `playsinline` attribute for iOS compatibility
- Responsive scaling maintains aspect ratio
- Fallback to poster image if video fails to load

## Testing

Test your landing page on:
- Different screen sizes
- Mobile devices
- Various browsers
- Different network conditions (throttled) 