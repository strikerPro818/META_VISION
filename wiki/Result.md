# Outputs

Result of `humand.detect()` method is a single object that includes data for all enabled modules and all detected objects  

- `persons` property is a special getter which when invokes sorts results according to person that particular body part belongs to  
- `performance` property is set of performance counters used to monitor `Human` performance
- `canvas` property is optional property that returns input after processing, as suitable for screen draw

`Result` object can also be generated as smoothened time-based interpolation from last known `Result` using `human.next()` method

<br>

Full documentation: 
- [**Result Interface Specification**](https://vladmandic.github.io/human/typedoc/interfaces/Result.html)  
- [**Result Interface Definition**](https://github.com/vladmandic/human/blob/main/src/result.ts)

<br>

Overview of `Result` object type:

```ts
interface Result {
  /** {@link FaceResult}: detection & analysis results */
  face: Array<FaceResult>,
  /** {@link BodyResult}: detection & analysis results */
  body: Array<BodyResult>,
  /** {@link HandResult}: detection & analysis results */
  hand: Array<HandResult>,
  /** {@link GestureResult}: detection & analysis results */
  gesture: Array<GestureResult>,
  /** {@link ObjectResult}: detection & analysis results */
  object: Array<ObjectResult>
  /** global performance object with timing values for each operation */
  performance: Record<string, number>,
  /** optional processed canvas that can be used to draw input on screen */
  canvas?: OffscreenCanvas | HTMLCanvasElement | null | undefined,
  /** timestamp of detection representing the milliseconds elapsed since the UNIX epoch */
  readonly timestamp: number,
  /** getter property that returns unified persons object  */
  persons: Array<PersonResult>,
}
```
