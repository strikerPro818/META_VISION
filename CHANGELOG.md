# @vladmandic/human  

Version: **2.0.3**  
Description: **Human: AI-powered 3D Face Detection & Rotation Tracking, Face Description & Recognition, Body Pose Tracking, 3D Hand & Finger Tracking, Iris Analysis, Age & Gender & Emotion Prediction, Gesture Recognition**  

Author: **Vladimir Mandic <mandic00@live.com>**  
License: **MIT** </LICENSE>  
Repository: **<git+https://github.com/vladmandic/human.git>**  

## Changelog

### **HEAD -> main** 2021/06/18 mandic00@live.com

- modularize model loading

### **2.0.3** 2021/06/18 mandic00@live.com

- fix demo paths
- added multithreaded demo

### **2.0.2** 2021/06/14 mandic00@live.com

- reorganize demos
- fix centernet box width & height
- add body segmentation sample

### **release: 2.0.1** 2021/06/08 mandic00@live.com

- release 2.0

### **2.0.1** 2021/06/08 mandic00@live.com

- add video drag&drop capability
- modularize build platform
- custom build tfjs from sources
- modularize build platform
- enable body segmentation and background replacement in demo
- minor git corruption
- unified build
- enable body segmentation and background replacement
- work on body segmentation
- added experimental body segmentation module
- add meet and selfie models
- add live hints to demo
- switch worker from module to iife importscripts
- release candidate
- added samples to git
- implemented drag & drop for image processing
- release candidate
- breaking changes to results.face output properties
- breaking changes to results.object output properties
- breaking changes to results.hand output properties
- breaking changes to results.body output properties
- implemented human.next global interpolation method
- finished draw buffering and smoothing and enabled by default
- implemented service worker
- quantized centernet
- release candidate
- added usage restrictions
- quantize handdetect model
- added experimental movenet-lightning and removed blazepose from default dist
- added experimental face.rotation.gaze
- fix and optimize for mobile platform
- lock typescript to 4.2 due to typedoc incompatibility with 4.3

### **1.9.4** 2021/05/27 mandic00@live.com

- fix demo facecompare
- webhint and lighthouse optimizations
- add camera startup diag messages
- implemented unified result.persons that combines face, body and hands for each person
- added experimental results interpolation for smooth draw operations

### **1.9.3** 2021/05/23 mandic00@live.com

- use green weighted for input diff calculation
- implement experimental drawoptions.bufferedoutput and bufferedfactor
- use explicit tensor interface
- add tfjs types and remove all instances of any
- enhance strong typing
- rebuild all for release

### **1.9.2** 2021/05/22 mandic00@live.com

- add id and boxraw on missing objects
- restructure results strong typing

### **1.9.1** 2021/05/21 mandic00@live.com

- caching improvements
- sanitize server input
- remove nanodet weights from default distribution
- add experimental mb3-centernet object detection
- individual model skipframes values still max high threshold for caching
- config.videooptimized has been removed and config.cachesensitivity has been added instead
- caching determination is now dynamic based on detection of input change and not based on input types
- human 1.9.0 beta with breaking changes regarding caching

### **1.8.5** 2021/05/18 mandic00@live.com

- add node-video sample
- add node-webcam demo
- fix node build and update model signatures

### **1.8.4** 2021/05/11 mandic00@live.com


### **1.8.3** 2021/05/05 mandic00@live.com

- switch posenet weights

### **1.8.2** 2021/05/04 mandic00@live.com


### **release 1.8 with major changes and tfjs 3.6.0** 2021/04/30 mandic00@live.com


### **1.8.1** 2021/04/30 mandic00@live.com

- blazeface optimizations
- add hand labels in draw
- cleanup demo workflow
- convert blazeface to module
- version 1.8 release candidate
- build nodejs deliverables in non-minified form
- stop building sourcemaps for nodejs deliverables
- remove deallocate, profile, scoped
- replaced maxfaces, maxdetections, maxhands, maxresults with maxdetected
- replaced nmsradius with built-in default
- unified minconfidence and scorethresdold as minconfidence
- add exception handlers to all demos
- remove blazeface-front and add unhandledrejection handler
- major update for 1.8 release candidate
- enable webworker detection

### **1.7.1** 2021/04/25 mandic00@live.com

- remove obsolete binary models
- enable cross origin isolation
- rewrite posenet decoder
- remove efficientpose
- major version rebuild

### **1.6.1** 2021/04/22 mandic00@live.com

- add npmrc
- added filter.flip feature
- added demo load image from http
- mobile demo optimization and iris gestures
- full test run
- full rebuild
- new look
- added benchmarks
- added node-multiprocess demo
- fix image orientation
- flat app style
- add full nodejs test coverage

### **1.5.2** 2021/04/14 mandic00@live.com

- experimental node-wasm support

### **1.5.1** 2021/04/13 mandic00@live.com

- fix for safari imagebitmap
- refactored human.config and human.draw

### **1.4.3** 2021/04/12 mandic00@live.com

- implement webrtc

### **1.4.2** 2021/04/12 mandic00@live.com

- added support for multiple instances of human
- fix typedoc
- exception handling

### **1.4.1** 2021/04/09 mandic00@live.com

- add modelbasepath option

### **1.3.5** 2021/04/06 mandic00@live.com

- add dynamic viewport and fix web worker
- add cdn links

### **1.3.4** 2021/04/04 mandic00@live.com

- implement webhint

### **1.3.3** 2021/04/03 mandic00@live.com

- fix linting and tests

### **1.3.2** 2021/04/02 mandic00@live.com

- input type validation
- normalize all scores

### **1.3.1** 2021/03/30 mandic00@live.com

- added face3d demo
- initial work on face3d three.js demo
- enable buffering
- new icons
- new serve module and demo structure
- move gl flags to correct location
- minor rotation calculation fix
- remove debug output
- new face rotation calculations
- cleanup
- rotationmatrixtoeulerangle, and fixes
- experimental: add efficientpose
- implement nanodet
- face rotation matrix
- start working on efficientpose

### **1.2.5** 2021/03/25 mandic00@live.com

- fix broken exports
- added face matching example to docs
- improve fact matching

### **1.2.4** 2021/03/23 mandic00@live.com


### **1.2.3** 2021/03/21 mandic00@live.com


### **1.2.2** 2021/03/21 mandic00@live.com

- precise face rotation

### **1.2.1** 2021/03/21 mandic00@live.com

- new module: face description

### **1.1.11** 2021/03/21 mandic00@live.com

- refactor face classes

### **1.1.10** 2021/03/18 mandic00@live.com

- cleanup
- redefine tensor
- enforce types
- regen type declarations
- switch to single jumbo dts
- type definitions

### **1.1.9** 2021/03/17 mandic00@live.com

- fix box clamping and raw output
- hierarchical readme notes

### **1.1.8** 2021/03/17 mandic00@live.com

- add experimental nanodet object detection
- full models signature
- cleanup

### **1.1.7** 2021/03/16 mandic00@live.com

- fix for seedrandom
- custom typedoc

### **1.1.6** 2021/03/15 mandic00@live.com

- implement human.match and embedding demo

### **1.1.5** 2021/03/15 mandic00@live.com

- full rebuild

### **1.1.4** 2021/03/14 mandic00@live.com

- fix broken build

### **1.1.3** 2021/03/14 mandic00@live.com

- added api specs
- add typedocs and types
- strong typings

### **1.1.2** 2021/03/12 mandic00@live.com

- distance based on minkowski space and limited euclidean space
- guard against invalid input images

### **1.1.1** 2021/03/12 mandic00@live.com

- switched face embedding to mobileface

### **1.0.4** 2021/03/11 mandic00@live.com

- add face return tensor
- add test for face descriptors
- wip on embedding
- simplify face box coordinate calculations
- annotated models and removed gender-ssrnet
- autodetect inputsizes

### **1.0.3** 2021/03/10 mandic00@live.com

- strong typing for public classes and hide private classes
- re-added blazeface-front
- enhanced age, gender, emotion detection
- full rebuild

### **1.0.2** 2021/03/09 mandic00@live.com

- remove blazeface-front, blazepose-upper, faceboxes
- remove blazeface-front and faceboxes

### **release: 1.0.1** 2021/03/09 mandic00@live.com


### **1.0.1** 2021/03/09 mandic00@live.com

- fix for face detector when mesh is disabled
- optimize for npm

### **0.40.9** 2021/03/08 mandic00@live.com

- fix performance issue when running with low confidence

### **0.40.8** 2021/03/08 mandic00@live.com


### **0.40.7** 2021/03/06 mandic00@live.com

- implemented 3d face angle calculations

### **0.40.6** 2021/03/06 mandic00@live.com

- add curve draw output

### **0.40.5** 2021/03/05 mandic00@live.com

- fix human.draw

### **0.40.4** 2021/03/05 mandic00@live.com

- cleanup blazepose code
- fix demo

### **0.40.3** 2021/03/05 mandic00@live.com


### **0.40.2** 2021/03/05 mandic00@live.com

- added blazepose-upper

### **0.40.1** 2021/03/04 mandic00@live.com

- implement blazepose and update demos
- add todo list

### **0.30.6** 2021/03/03 mandic00@live.com

- fine tuning age and face models

### **0.30.5** 2021/03/02 mandic00@live.com

- add debug logging flag

### **0.30.4** 2021/03/01 mandic00@live.com

- added skipinitial flag

### **0.30.3** 2021/02/28 mandic00@live.com

- typo

### **0.30.2** 2021/02/26 mandic00@live.com

- rebuild
- fix typo

### **0.30.1** 2021/02/25 mandic00@live.com


### **0.20.11** 2021/02/24 mandic00@live.com


### **0.20.10** 2021/02/22 mandic00@live.com


### **0.20.9** 2021/02/21 mandic00@live.com

- remove extra items
- simmilarity fix

### **0.20.8** 2021/02/21 mandic00@live.com

- embedding fix

### **0.20.7** 2021/02/21 mandic00@live.com

- build fix

### **0.20.6** 2021/02/21 mandic00@live.com

- embedding fix

### **0.20.5** 2021/02/21 mandic00@live.com

- fix imagefx and add dev builds

### **0.20.4** 2021/02/19 mandic00@live.com

- 0.20.4

### **0.20.3** 2021/02/17 mandic00@live.com

- rebuild

### **0.20.2** 2021/02/13 mandic00@live.com

- merge branch 'main' of https://github.com/vladmandic/human into main
- create codeql-analysis.yml
- create security.md
- add templates

### **0.20.1** 2021/02/08 mandic00@live.com

- menu fixes
- convert to typescript

### **0.11.5** 2021/02/06 mandic00@live.com

- added faceboxes alternative model

### **0.11.4** 2021/02/06 mandic00@live.com


### **0.11.3** 2021/02/02 mandic00@live.com


### **0.11.2** 2021/01/30 mandic00@live.com

- added warmup for nodejs

### **update for tfjs 3.0.0** 2021/01/29 mandic00@live.com


### **0.11.1** 2021/01/29 mandic00@live.com


### **0.10.2** 2021/01/22 mandic00@live.com


### **0.10.1** 2021/01/20 mandic00@live.com


### **0.9.26** 2021/01/18 mandic00@live.com

- fix face detection when mesh is disabled
- added minification notes
- version bump

### **0.9.25** 2021/01/13 mandic00@live.com

- added humangl custom backend
- rebuild
- code cleanup and enable minification
- fix safari incopatibility

### **0.9.24** 2021/01/12 mandic00@live.com

- work on blazepose
- full rebuild

### **0.9.23** 2021/01/11 mandic00@live.com

- added iris gesture
- fix emotion labels
- full rebuild

### **0.9.22** 2021/01/05 mandic00@live.com

- remove iris coords if iris is disabled
- web worker fix

### **0.9.21** 2021/01/03 mandic00@live.com


### **0.9.20** 2021/01/03 mandic00@live.com

- stricter linting, fix face annotations

### **0.9.19** 2020/12/23 mandic00@live.com

- added rawbox and rawmesh
- variable name changes, setting .rawcoords only if necessary
- option to return raw data (mesh, box) for facemesh / "preserve aspect ratio" fix from facemesh upstream

### **0.9.18** 2020/12/16 mandic00@live.com

- add z axis scaling
- major work on body module
- republish due to tfjs 2.8.0 issues

### **0.9.17** 2020/12/15 mandic00@live.com

- added custom webgl backend

### **0.9.16** 2020/12/12 mandic00@live.com

- change default ports

### **0.9.15** 2020/12/11 mandic00@live.com

- improved caching and warmup
- rebuild

### **0.9.14** 2020/12/10 mandic00@live.com

- conditional hand rotation
- staggered skipframes
- fix permissions

### **0.9.13** 2020/12/08 mandic00@live.com

- implemented face and hand boundary checks
- embedded sample for warmup
- switch to central logger

### **0.9.12** 2020/11/26 mandic00@live.com

- minor compatibility fixes

### **0.9.11** 2020/11/23 mandic00@live.com

- implement multi-person gestures
- modularize pipeline models

### **0.9.10** 2020/11/21 mandic00@live.com

- changed build for optimized node & browser

### **0.9.9** 2020/11/21 mandic00@live.com

- new screenshots
- camera exception handling

### **0.9.8** 2020/11/19 mandic00@live.com

- force f16 textures
- bugfix embedding check

### **0.9.7** 2020/11/19 mandic00@live.com

- ui redesign

### **0.9.6** 2020/11/18 mandic00@live.com

- optimize camera resize on mobile
- completed tfjs wrapper

### **0.9.5** 2020/11/17 mandic00@live.com

- fix serious performance bug around skipframes
- swtich to custom tfjs bundle

### **0.9.4** 2020/11/17 mandic00@live.com

- swtich to tfjs source import

### **0.9.3** 2020/11/16 mandic00@live.com

- switched to minified build

### **release: 1.2** 2020/11/15 mandic00@live.com

- full rebuild

### **0.9.2** 2020/11/14 mandic00@live.com

- fix camera restart on resize

### **0.9.1** 2020/11/13 mandic00@live.com

- version bump
- full rebuild
- implemented face embedding
- added internal benchmark tool

### **0.8.8** 2020/11/12 mandic00@live.com

- reduced bundle size
- implemented buffered processing
- fix for conditional model loading

### **0.8.7** 2020/11/11 mandic00@live.com

- added performance notes
- added notes on models
- fix bug in async ops and change imports
- fix wiki links

### **0.8.6** 2020/11/09 mandic00@live.com

- add wasm bundle

### **0.8.5** 2020/11/09 mandic00@live.com

- reimplemented blazeface processing

### **0.8.4** 2020/11/09 mandic00@live.com

- added additional gestures
- implemented blink detection
- fix wasm module

### **0.8.3** 2020/11/08 mandic00@live.com

- refresh
- optimizations

### **0.8.2** 2020/11/08 mandic00@live.com

- fix typos
- commit

### **0.8.1** 2020/11/07 mandic00@live.com

- fix hand detection performance
- optimized model loader
- merge branch 'main' of https://github.com/vladmandic/human into main
- created wiki
- delete bug_report.md
- optimize font resizing
- fix nms sync call

### **0.7.6** 2020/11/06 mandic00@live.com

- fixed memory leaks and updated docs
- model tuning
- cache invalidation improvements
- full async operations

### **0.7.5** 2020/11/05 mandic00@live.com

- implemented dev-server

### **0.7.4** 2020/11/05 mandic00@live.com

- fix canvas size on different orientation
- switched from es2020 to es2018 build target

### **0.7.3** 2020/11/05 mandic00@live.com

- optimized camera and mobile layout
- fixed worker and filter compatibility
- removed test code

### **0.7.2** 2020/11/04 mandic00@live.com

- major work on handpose model

### **0.7.1** 2020/11/04 mandic00@live.com

- changed demo build process

### **0.6.7** 2020/11/04 mandic00@live.com

- implemented simple gesture recognition

### **0.6.6** 2020/11/04 mandic00@live.com

- remove debug code

### **0.6.5** 2020/11/04 mandic00@live.com

- redo hand detection

### **0.6.4** 2020/11/03 mandic00@live.com

- added manifest

### **0.6.3** 2020/11/03 mandic00@live.com

- enhanced processing resolution
- fix pause restart
- complete model refactoring
- fixed typo

### **0.6.2** 2020/11/02 mandic00@live.com

- optimized demo
- package update

### **0.6.1** 2020/11/02 mandic00@live.com

- major performance improvements for all models
- revert "optimized canvas handling"
- optimized canvas handling
- minor optimization to imagefx
- fix demo image sample
- added tfjs-vis to distribution

### **0.5.5** 2020/11/01 mandic00@live.com

- changed defaults

### **0.5.4** 2020/11/01 mandic00@live.com

- implemented memory profiler

### **0.5.3** 2020/10/30 mandic00@live.com

- improved debug logging

### **0.5.2** 2020/10/30 mandic00@live.com

- added wasm and webgpu backends

### **0.5.1** 2020/10/30 mandic00@live.com

- improve demo line continous draws

### **0.4.10** 2020/10/30 mandic00@live.com

- fix for seedrandom

### **0.4.9** 2020/10/29 mandic00@live.com


### **0.4.8** 2020/10/28 mandic00@live.com

- revert "updated menu handler"
- fix webpack compatibility issue

### **0.4.7** 2020/10/27 mandic00@live.com


### **0.4.6** 2020/10/27 mandic00@live.com

- fix firefox compatibility bug

### **0.4.5** 2020/10/27 mandic00@live.com


### **0.4.4** 2020/10/27 mandic00@live.com

- implelented input resizing

### **0.4.3** 2020/10/22 mandic00@live.com


### **0.4.2** 2020/10/20 mandic00@live.com

- log initialization

### **0.4.1** 2020/10/19 mandic00@live.com

- breaking change: convert to object class
- compatibility notes

### **0.3.9** 2020/10/18 mandic00@live.com

- implemented image filters
- pure tensor pipeline without image converts
- autodetect skipframes

### **0.3.8** 2020/10/17 mandic00@live.com

- new menu layout

### **0.3.7** 2020/10/17 mandic00@live.com

- added diagnostics output
- parallelized agegender operations

### **0.3.6** 2020/10/17 mandic00@live.com

- fixed webcam initialization
- fixed memory leaks and added scoped runs
- modularized draw
- added state handling
- refactored package file layout

### **0.3.5** 2020/10/16 mandic00@live.com

- added auto-generated changelog

### **0.3.4** 2020/10/16 mandic00@live.com

- added camera selection
- optimized blazeface anchors
- added error handling

### **0.3.3** 2020/10/15 mandic00@live.com

- added blazeface back and front models

### **0.3.2** 2020/10/15 mandic00@live.com

- reduced web worker latency
- added debugging and versioning
- optimized demos and added scoped runs
- added multi backend support

### **0.3.1** 2020/10/14 mandic00@live.com


### **0.2.10** 2020/10/14 mandic00@live.com

- added emotion backend
- module parametrization and performance monitoring
- implemented multi-hand support
- fixed documentation typos

### **0.2.9** 2020/10/13 mandic00@live.com

- added node build and demo

### **0.2.8** 2020/10/13 mandic00@live.com

- added example image

### **0.2.7** 2020/10/13 mandic00@live.com

- new examples

### **0.2.6** 2020/10/13 mandic00@live.com

- enable all models by default

### **0.2.5** 2020/10/12 mandic00@live.com

- fixed memory leak

### **0.2.4** 2020/10/12 mandic00@live.com

- removed extra files

### **0.2.3** 2020/10/12 mandic00@live.com


### **0.2.2** 2020/10/12 mandic00@live.com


### **release: 1.0** 2020/10/12 mandic00@live.com


### **0.2.1** 2020/10/12 mandic00@live.com

- added sample image
- initial public commit
- initial commit
