import { Component } from "react";

/**
 * The world is a canvas, so when it throws while rendering there is nothing
 * left on screen to explain itself — the visitor is looking at black. Asset
 * loading already has its own error path; this covers the rest, and falls back
 * to the plain page, which needs neither tilesets nor a game loop.
 */
export default class WorldBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("The world failed to render:", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
