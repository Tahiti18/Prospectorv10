export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Pass API requests to the existing backend
    if (url.pathname.startsWith('/api/')) {
      return fetch('https://e48b0990.prospector-os-v2.pages.dev' + url.pathname, request);
    }
    
    // Serve the login page for everything else
    return env.ASSETS.fetch(request);
  }
}
