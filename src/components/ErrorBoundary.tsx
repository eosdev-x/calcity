import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto card text-center">
              <h1 className="text-3xl font-semibold text-on-surface mb-3">Something went wrong</h1>
              <p className="text-on-surface-variant mb-6">
                We hit an unexpected error. Please try again or return to the home page.
              </p>
              <Link to="/" className="btn-primary inline-flex justify-center">
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
