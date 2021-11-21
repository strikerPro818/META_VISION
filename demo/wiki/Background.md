# Comparing Human and FaceAPI

## Background

During 2020 I've modernized `FaceAPI` with goals of using it accross my other ML projects  
That task turned out to be quite large in scope and resulted in a separate version:

- `FaceAPI`: <https://github.com/vladmandic/face-api>

But after a while, further improvements became impossible due to architecture of models used in `FaceAPI`  

So I've started a new project:

- `Human`: <https://github.com/vladmandic/human>  

With goals of using *SotA* (state-of-the-art) models and expanding detection to cover other parts of any person, not just face while keeping library portable:

- Must be fully asnychronous to support parallel execution
- Must be able to execute in **Browser** and **NodeJS** environments
- Must be supported using using `CPU`, `WebGL`, `WASM` and `Node` backends
- Any used model must have size below 10MB
- Model can come from any framework: TF, Keras, PyTorch, MLNet, etc.  

<br>

As of `Human` **version 1.0 released in March 2021**, I consider project stable and have fully replaced all use-cases covered by `FaceAPI`:

- Face Detection
- Face Landmars
- Age & Gender
- Emotion
- Face Description

With improved details - for example:

- FaceAPI has 68-point landmarks while Human has 468-points
- FaceAPI uses 128-element descriptor while Human uses 1024-element descriptor

While adding functionality:

- Gesture Analysis
- Body Detection and Landmarks
- Hand Detection and Landmarks

And expanding platform support:

- *NodeJS* using *WASM*
- *Browser* with *WebWorkers*

<br><hr>

## Future

I will continue maintaining `FaceAPI` due to popular demand,  
but all further improvments will be focused on `Human`  

***Any feature requests or model suggestions are welcome!***

<br><hr>

## Benchmarks

Using tensorflow backend (CPU execution using *libtensorflow*)

In most cases CPU will be fully saturated with 4 workers with 80% user-mode and 20% system meaning waiting for I/O such as reading actual images

### System: i5-6500TE; 4-cores @ 2.30GHz

**Enabled: Detection, Landmarks, Age, Gender, Emotion, Descriptor**

- FaceAPI: Processed: 69 images in total: 43896 ms working: 42559 ms average: 616 ms
- Human: Processed: 69 images in total: 24846 ms working: 23706 ms average: 343 ms

### System: i7-8750H; 12-cores @ 2.20GHz

**Enabled: Detection, Landmarks, Age, Gender, Emotion, Descriptor**

- FaceAPI: Processed: 69 images in total: 13176 ms working: 12613 ms average: 182 ms
- Human: Processed: 69 images in total: 10038 ms working: 9315 ms average: 135 ms

<br>

For image processing, Human is ~2x faster than FaceAPI with much higher level of details  

For video processing, difference is even higher  
since `FaceAPI` processes each frame independently while `Human` has aggressive caching between frames
