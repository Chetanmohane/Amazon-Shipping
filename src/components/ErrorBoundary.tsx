import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 text-center">
          <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl max-w-md space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto font-black text-2xl">
              ⚠️
            </div>
            <h2 className="text-xl font-extrabold text-white">Something went wrong</h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              An unexpected error occurred while rendering the page. Click below to refresh and clear cache.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full bg-[#FF9900] hover:bg-[#e68a00] text-slate-950 font-black py-3 px-4 rounded-xl shadow transition transform active:scale-95 text-xs"
            >
              🔄 Reload Amazon Portal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
