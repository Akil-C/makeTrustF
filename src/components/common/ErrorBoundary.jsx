import { Component } from 'react'
import { ShieldAlert, RefreshCw, Home, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'

/**
 * Enterprise Application Error Boundary
 * Catches unhandled client-side render exceptions, isolates faults,
 * and prevents sensitive system stack trace exposure to end-users.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      copied: false,
      showDetails: false,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('[Security ErrorBoundary caught exception]:', error, errorInfo)
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  handleCopyDetails = () => {
    const errorText = `[Nexora System Exception]\nTime: ${new Date().toISOString()}\nMessage: ${this.state.error?.message || 'Unknown runtime error'}\nURL: ${window.location.href}`
    navigator.clipboard?.writeText(errorText)
    this.setState({ copied: true })
    setTimeout(() => this.setState({ copied: false }), 2000)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans text-slate-900">
          <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600 shadow-xs">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                <span>Isolated System Exception</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Application Protected
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                An isolated client-side rendering exception was intercepted. Your wallet balance, authentication credentials, and escrow state remain securely protected.
              </p>
            </div>

            {/* Error Diagnostics Toggle */}
            <div className="text-left bg-slate-50 rounded-2xl border border-slate-200 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                  className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5"
                >
                  <span>Diagnostic Summary</span>
                  {this.state.showDetails ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={this.handleCopyDetails}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded-lg transition-colors shadow-2xs"
                >
                  {this.state.copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Log</span>
                    </>
                  )}
                </button>
              </div>

              {this.state.showDetails && (
                <pre className="text-[11px] font-mono text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 overflow-x-auto whitespace-pre-wrap max-h-36">
                  {this.state.error?.message || 'Component tree rendered an unexpected value.'}
                </pre>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 hover:border-slate-900 bg-white text-slate-800 font-bold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Home className="w-4 h-4" />
                <span>Return to Homepage</span>
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
