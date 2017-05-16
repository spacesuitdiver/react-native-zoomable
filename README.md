# react-native-photo-view

Pinch to zoom and double/single tap support most likely used to preview images.

![Preview](https://raw.githubusercontent.com/LeBlaaanc/react-native-zoomable/blob/master/preview.gif)

## Usage

```javascript
import Zoomable from 'react-native-zoomable';
```

Basics:
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
| tapToZoomIn | string | can be 'double' or 'single'. (default: 'double') |
| tapToZoomOut | string | can be 'double or 'single'. (default: 'single') |
