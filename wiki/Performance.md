# Performance

Performance will vary depending on your hardware, but also on number of resolution of input video/image, enabled modules as well as their parameters  

For example, it can perform multiple face detections at 60+ FPS, but drops to ~20 FPS on a medium complex images if all modules are enabled  

<br>

## Performance per module on a **notebook** with nVidia GTX1050 GPU on a FullHD input

- Enabled all: 20 FPS
- Image filters: 80 FPS (standalone)
- Gesture: 80 FPS (standalone)
- Face Detect: 80 FPS (standalone)
- Face Geometry: 30 FPS (includes face detect)
- Face Iris: 30 FPS (includes face detect and face geometry)
- Age: 60 FPS (includes face detect)
- Gender: 60 FPS (includes face detect)
- Emotion: 60 FPS (includes face detect)
- Hand: 40 FPS (standalone)
- Body: 50 FPS (standalone)

## Performance per module on a **smartphone** with Snapdragon 855 on a FullHD input

- Enabled all: 10 FPS
- Image filters: 30 FPS (standalone)
- Gesture: 30 FPS (standalone)
- Face Detect: 20 FPS (standalone)
- Face Geometry: 10 FPS (includes face detect)
- Face Iris: 5 FPS (includes face detect and face geometry)
- Age: 20 FPS (includes face detect)
- Gender: 20 FPS (includes face detect)
- Emotion: 20 FPS (includes face detect)
- Hand: 40 FPS (standalone)
- Body: 15 FPS (standalone)

<br>

For performance details, see output of `result.performance` object during after running inference  
