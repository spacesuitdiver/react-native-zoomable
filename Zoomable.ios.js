import React, { PropTypes } from 'react';
import { ScrollView } from 'react-native';

class Zoomable extends React.Component {

  static state = {
    lastTouchNativeEvent: {},
    lastTouchEndTimestamp: 0,
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
    const { tapToZoomIn, tapToZoomOut } = this.props;

    if (!this.isTap(e) || this.isLongPress(e)) return;

    if (this.state.isZoomed) {
      switch (tapToZoomOut) {
        case 'single':
          this.zoomOut(locationX, locationY);
          break;
        case 'double':
          if (this.isDoubleTap(e)) this.zoomOut(locationX, locationY);
          break;
        default:
      }
    } else {
      switch (tapToZoomIn) {
        case 'single':
          this.zoomIn(locationX, locationY);
          break;
        case 'double':
          if (this.isDoubleTap(e)) this.zoomIn(locationX, locationY);
          break;
        default:
      }
    }

    this.setState({ lastTouchEndTimestamp: timestamp });
  };

  zoomIn = (x, y) => {
    const size = { width: 0, height: 0 };

    this.scrollView.scrollResponderZoomTo({ x, y, ...size });
  };

  zoomOut = (x, y) => {
    const size = { width: 10000, height: 10000 };

    this.scrollView.scrollResponderZoomTo({ x, y, ...size });
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
  tapToZoomIn: PropTypes.oneOf(['single', 'double']),
  tapToZoomOut: PropTypes.oneOf(['single', 'double']),
};

Zoomable.defaultProps = {
  onScrollOrZoom: () => {},
  zoomScale: 4,
  tapToZoomIn: 'double',
  tapToZoomOut: 'double',
};

export default Zoomable;
