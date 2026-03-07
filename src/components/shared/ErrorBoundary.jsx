import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error('UI error caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-3 rounded-lg">
          Something went wrong in this section. Please reload or contact admin.
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
