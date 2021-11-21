# Demos

All demos are included in `/demo` and come with individual documentation per-demo

## Browser Demos

- **Full** [[*Live*]](https://vladmandic.github.io/human/demo/index.html) [[*Details*]](https://github.com/vladmandic/human/tree/main/demo): Main browser demo app that showcases all Human capabilities
- **Simple** [[*Live*]](https://vladmandic.github.io/human/demo/typescript/index.html) [[*Details*]](https://github.com/vladmandic/human/tree/main/demo/typescript): Simple demo in WebCam processing demo in TypeScript
- **Face Match** [[*Live*]](https://vladmandic.github.io/human/demo/facematch/index.html) [[*Details*]](https://github.com/vladmandic/human/tree/main/demo/facematch): Extract faces from images, calculates face descriptors and simmilarities and matches them to known database
- **Face ID** [[*Live*]](https://vladmandic.github.io/human/demo/faceid/index.html) [[*Details*]](https://github.com/vladmandic/human/tree/main/demo/faceid): Runs multiple checks to validate webcam input before performing face match to faces in IndexDB
- **Multi-thread** [[*Live*]](https://vladmandic.github.io/human/demo/multithread/index.html) [[*Details*]](https://github.com/vladmandic/human/tree/main/demo/multithread): Runs each `human` module in a separate web worker for highest possible performance  
- **Face 3D** [[*Live*]](https://vladmandic.github.io/human/demo/face3d/index.html) [[*Details*]](https://github.com/vladmandic/human/tree/main/demo/face3d): Uses WebCam as input and draws 3D render of face mesh using `Three.js`
- **Virtual Avatar** [[*Live*]](https://vladmandic.github.io/human-vrm/src/human-vrm.html) [[*Details*]](https://github.com/vladmandic/human-vrm): VR model with head, face, eye, body and hand tracking  

## NodeJS Demos

- **Main** [[*Details*]](https://github.com/vladmandic/human/tree/main/demo/nodejs): Process images from files, folders or URLs using native methods  
- **Canvas** [[*Details*]](https://github.com/vladmandic/human/tree/main/demo/nodejs): Process image from file or URL and draw results to a new image file using `node-canvas`  
- **Video** [[*Details*]](https://github.com/vladmandic/human/tree/main/demo/nodejs): Processing of video input using `ffmpeg`  
- **WebCam** [[*Details*]](https://github.com/vladmandic/human/tree/main/demo/nodejs): Processing of webcam screenshots using `fswebcam`  
- **Events** [[*Details*]](https://github.com/vladmandic/human/tree/main/demo/nodejs): Showcases usage of `Human` eventing to get notifications on processing
- **Similarity** [[*Details*]](https://github.com/vladmandic/human/tree/main/demo/nodejs): Compares two input images for similarity of detected faces
- **Face Match** [[*Details*]](https://github.com/vladmandic/human/tree/main/demo/facematch): Parallel processing of face **match** in multiple child worker threads
- **Multiple Workers** [[*Details*]](https://github.com/vladmandic/human/tree/main/demo/nodejs): Runs multiple parallel `human` by dispaching them to pool of pre-created worker processes  

<br><hr><br>
