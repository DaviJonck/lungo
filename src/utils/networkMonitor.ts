// Monitor de rede para debug
export class NetworkMonitor {
  private static requests: Map<string, number> = new Map();

  static logRequest(url: string) {
    const count = this.requests.get(url) || 0;
    this.requests.set(url, count + 1);
    console.log(`🌐 Request #${count + 1}: ${url}`);
  }

  static getStats() {
    const stats: Record<string, number> = {};
    this.requests.forEach((count, url) => {
      stats[url] = count;
    });
    return stats;
  }

  static clear() {
    this.requests.clear();
  }
}

// Interceptar fetch para monitorar
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const url = args[0] as string;
  NetworkMonitor.logRequest(url);
  return originalFetch(...args);
};
