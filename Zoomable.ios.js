import React, { PropTypes } from 'react';
import { ScrollView } from 'react-native';

class Zoomable extends React.Component {

  static state = {
    lastTouchNativeEvent: {},
    lastTouchEndTimestamp: 0,
    lastZoomActionTimestamp: 0,
    isZoomed: false,
  };

  onScroll = (e) => {
    this.props.onScrollOrZoom(e);
    this.setState({
      isZoomed: e.nativeEvent.zoomScale > 1,
    });
  };

  onTouchStart = (e) => {
    const { touches } = e.nativeEvent;
    if (touches.length > 1) return; // don't handle multitouch gestures

    this.setState({ lastTouchNativeEvent: e.nativeEvent });
  };

  onTouchEnd = (e) => {
    const { timestamp, locationX, locationY } = e.nativeEvent;
    const { zoomInTrigger, zoomOutTrigger } = this.props;

    if (!this.isTap(e) || this.isLongPress(e)) return;

    if (this.state.isZoomed) {
      switch (zoomOutTrigger) {
        case 'singletap':
          this.zoomOut(e);
          break;
        case 'doubletap':
          if (this.isDoubleTap(e)) this.zoomOut(e);
          break;
        default:
      }
    } else {
      switch (zoomInTrigger) {
        case 'singletap':
          this.zoomIn(e);
          break;
        case 'doubletap':
          if (this.isDoubleTap(e)) this.zoomIn(e);
          break;
        default:
      }
    }

    this.setState({ lastTouchEndTimestamp: timestamp });
  };

  zoomIn = (e) => {
    const { locationX: x, locationY: y, timestamp } = e.nativeEvent;
    const coords = { x, y, width: 0, height: 0 };

    if (this.isAlreadyZooming(e)) return;

    this.scrollView.scrollResponderZoomTo(coords);
    this.setState({ lastZoomActionTimestamp: timestamp });
  };

  zoomOut = (e) => {
    const { locationX: x, locationY: y, timestamp } = e.nativeEvent;
    const coords = { x, y, width: 10000, height: 10000 };

    if (this.isAlreadyZooming(e)) return;

    this.scrollView.scrollResponderZoomTo(coords);
    this.setState({ lastZoomActionTimestamp: timestamp });

  };

  isDoubleTap = (e) => {
    const { timestamp } = e.nativeEvent;

    return timestamp - this.state.lastTouchEndTimestamp <= 300;
  };

  isLongPress = (e) => {
    const { timestamp } = e.nativeEvent;
    const { timestamp: lastTimestamp } = this.state.lastTouchNativeEvent;

    return timestamp - lastTimestamp >= 300;
  };

  isTap = (e) => {
    const { touches, locationX, locationY } = e.nativeEvent;
    const { locationX: lastLocationX, locationY: lastLocationY } = this.state.lastTouchNativeEvent;

    if (touches.length > 1) return false; // don't handle multitouch gestures

    return locationX === lastLocationX && locationY === lastLocationY;
  };

  isAlreadyZooming = (e) => {
    const { timestamp } = e.nativeEvent;

    return timestamp - this.state.lastZoomActionTimestamp <= 500;
  };

  render() {
    return (
      <ScrollView
        ref={(ref) => { this.scrollView = ref; }}
        onScroll={this.onScroll.bind(this)}
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
        scrollEventThrottle={100}
        scrollsToTop={false}
        alwaysBounceVertical={false}
        alwaysBounceHorizontal={false}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        maximumZoomScale={this.props.zoomScale}
        centerContent
      >
        {this.props.children}
      </ScrollView>
    );
  }
}

Zoomable.propTypes = {
  children: PropTypes.element.isRequired,
  onScrollOrZoom: PropTypes.func,
  zoomScale: PropTypes.number,
  zoomInTrigger: PropTypes.oneOf(['singletap', 'doubletap']),
  zoomOutTrigger: PropTypes.oneOf(['singletap', 'doubletap']),
};

Zoomable.defaultProps = {
  onScrollOrZoom: () => {},
  zoomScale: 4,
  zoomInTrigger: 'doubletap',
  zoomOutTrigger: 'singletap',
};

export default Zoomable;
