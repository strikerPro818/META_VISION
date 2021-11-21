# Profiling

If `config.profile` is enabled, call to `human.profileData()` will return detailed profiling data from the last detect invokation.

example:

```js
  result = {
    {age: {…}, gender: {…}, emotion: {…}}
      age:
        timeKernelOps: 53.78892800000002
        newBytes: 4
        newTensors: 1
        numKernelOps: 341
        peakBytes: 46033948
        largestKernelOps: Array(5)
          0: {name: "Reshape", bytesAdded: 107648, totalBytesSnapshot: 46033948, tensorsAdded: 1, totalTensorsSnapshot: 1149, …}
          1: {name: "Reshape", bytesAdded: 0, totalBytesSnapshot: 45818652, tensorsAdded: 1, totalTensorsSnapshot: 1147, …}
          2: {name: "Reshape", bytesAdded: 0, totalBytesSnapshot: 45633996, tensorsAdded: 1, totalTensorsSnapshot: 1148, …}
          3: {name: "Reshape", bytesAdded: 0, totalBytesSnapshot: 45389376, tensorsAdded: 1, totalTensorsSnapshot: 1154, …}
          4: {name: "Reshape", bytesAdded: 53824, totalBytesSnapshot: 45381776, tensorsAdded: 1, totalTensorsSnapshot: 1155, …}
        slowestKernelOps: Array(5)
          0: {name: "_FusedMatMul", bytesAdded: 12, totalBytesSnapshot: 44802280, tensorsAdded: 1, totalTensorsSnapshot: 1156, …}
          1: {name: "_FusedMatMul", bytesAdded: 4, totalBytesSnapshot: 44727564, tensorsAdded: 1, totalTensorsSnapshot: 1152, …}
          2: {name: "_FusedMatMul", bytesAdded: 12, totalBytesSnapshot: 44789100, tensorsAdded: 1, totalTensorsSnapshot: 1157, …}
          3: {name: "Add", bytesAdded: 4, totalBytesSnapshot: 44788748, tensorsAdded: 1, totalTensorsSnapshot: 1158, …}
          4: {name: "Add", bytesAdded: 4, totalBytesSnapshot: 44788748, tensorsAdded: 1, totalTensorsSnapshot: 1158, …}
  }
```
