# react-native-zoomable

React Native component for pinch and double/single tap to zoom, most likely used to preview images but can be used to wrap anything.

![Preview](https://raw.githubusercontent.com/LeBlaaanc/react-native-zoomable/master/preview.gif)

## Usage

```javascript
import Zoomable from 'react-native-zoomable';
```

```javascript
<Zoomable
  zoomScale={3}
  onScrollOrZoom={(e) => alert('did that thing!')}
  tapToZoomOut="double"
>
  <Image source={{ uri }} style={{ width: 50, height: 50 }} />
</Zoomable>
```

## Properties
| Property | Type | Description |
|-----------------|----------|--------------------------------------------------------------|
| onScrollOrZoom | function | called when scrolled or zoomed, sent an event as a param |
| zoomScale | number | zoom scale. (default: 4) |
| zoomInTrigger | string | can be 'singletap' or 'doubletap'. (default: 'doubletap') |
| zoomOutTrigger | string | can be 'singletap' or 'doubletap'. (default: 'singletap') |

## Copyright
Copyright (c) 2017 Chris LeBlanc. Licensed under the MIT license.
