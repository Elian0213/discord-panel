import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  errorNode?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(error, info);
    this.setState({ hasError: true });
  }

  render(): ReactNode {
    if (this.state.hasError)
      return this.props.errorNode || <h1>Something went wrong...</h1>;
    return this.props.children;
  }
}

export default ErrorBoundary;
