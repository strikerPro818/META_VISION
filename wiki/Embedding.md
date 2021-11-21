# Face Feature Embedding and Similarity Compare

<br>

To see a demo of all all face embedding features, see `/demo/facematch`  
It highlights functionality such as:

- Loading images
- Extracting faces from images
- Calculating face embedding descriptors
- Finding face similarity and sorting them by similarity
- Finding best face match based on a known list of faces and printing matches

<br>

## Usage

To use face similarity compare feature, you must first enable `face.description` module  
to calculate embedding vectors *(a.k.a. face descriptors)* for both all images you want to compare  

To achieve accurate results, it is also highly recommended to have `face.mesh` and `face.detection.rotation`  
enabled as calculating feature vectors on low-quality inputs can lead to false results  

Similarity match above **50%** can be considered a match  

For example,

```js
const myConfig = {
  face: {
    enabled: true,
    detector: { rotation: true, return: true },
    mesh: { enabled: true },
    description: { enabled: true },
  },
};

const human = new Human(myConfig);
const firstResult = await human.detect(firstImage);
const secondResult = await human.detect(secondImage);
const similarity = human.similarity(firstResult.face[0].embedding, secondResult.face[0].embedding);
console.log(`faces are ${100 * similarity}% simmilar`);
```

If the image or video frame have multiple faces and you want to match all of them, simply loop through all `results.face`

```js
for (let i = 0; i < currentResult.face.length; i++) {
  const currentEmbedding = currentResult.face[i].embedding;
  const similarity = human.similarity(referenceEmbedding, currentEmbedding);
  console.log(`face ${i} is ${100 * similarity}% simmilar`);
}
```

Additional helper function is `human.enhance(face)` which returns an enhanced tensor  
of a face image that can be further visualized with

```js
  const enhanced = human.enhance(face);
  const canvas = document.getElementById('orig');
  human.tf.browser.toPixels(enhanced.squeeze(), canvas);
```

<br>

## Face Descriptor

Face descriptor or embedding vectors are calulated feature vector values uniquely identifying a given face and presented as array of float values  

They can be stored as normal arrays and reused as needed

<br>

## Face Similarity

Similarity function is based on general *Minkowski distance* between all points in vector  
*[Minkowski distance](https://en.wikipedia.org/wiki/Minkowski_distance) is a nth root of sum of nth powers of distances between each point (each descriptor is 1024-member array)*  

*Default is Eucliean distance which is a limited case of Minkowski distance with order of 2*  

Changing `order` can make similarity matching more or less sensitive (default order is 2nd order)  
For example, those will produce slighly different results:

```js
  const similarity2ndOrder = human.similarity(firstEmbedding, secondEmbedding, { order = 2 });
  const similarity3rdOrder = human.similarity(firstEmbedding, secondEmbedding, { order = 3 });
```

<br>

## Face Recognition

Once you run face embedding analysis, you can store results in an annotated form  
to be used at the later time to find the best match for any given face

For example:

```js
  const db = [];
  const res = await human.detect(input);
  db.push({ label: 'this-is-me', embedding: res.face[0].embedding });
```

Note that you can have multiple entries for the same person and best match will be used  

To find the best match, simply use `match` method while providing embedding descriptor to compare and pre-prepared list of descriptors  

```js
  const embeddingArray = db.map((record) => record.embedding); // build array with just embeddings
  const best = human.match(embedding, embeddingArray); // return is object: { index: number, similarity: number, distance: number }
  const label = embeddingArray[best.index].label;
  console.log({ name, similarity: best.similarity });
```

Database can be further stored in a JS or JSON file and retrieved when needed to have  
a permanent database of faces that can be expanded over time to cover any number of known faces  
For example, see `/demo/facematch/facematch.js` and example database `/demo/facematch/faces.json`:

> download db with known faces using http/https  
```js
  let res = await fetch('/demo/facematch/faces.json');
  db = (res && res.ok) ? await res.json() : [];
```
> download db with known faces from a local file
```js
  const fs = require('fs');
  const buffer = fs.readFileSync('/demo/facematch/faces.json');
  db = JSON.parse(buffer);
```

<br>

## Face Image Pre-processing

To achieve optimal result, `Human` performs following operations on an image before calulcating feature vector (embedding):

- Crop to face
- Find rought face angle and straighten face
- Detect mesh
- Find precise face angle and again straighten face
- Crop again with more narrow margins
- Convert image to grayscale to avoid impact of different colorizations
- Normalize brightness to full range for all images

<br>

## Demo

`Human` contains a demo that enumerates number of images,  
extracts all faces from them, processed them and then allows  
for a selection of any face which sorts faces by similarity

Demo is available in `demo/facematch` which uses `facematch.js` as JavaSript module
