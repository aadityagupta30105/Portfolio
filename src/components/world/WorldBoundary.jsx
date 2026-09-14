import { Component } from "react";

// If the world fails to render, fall back to the plain page.
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
