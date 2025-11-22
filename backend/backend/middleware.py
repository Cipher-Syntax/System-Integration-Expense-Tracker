# backend/middleware.py
class DevCrossOriginMiddleware:
    """
    Temporary middleware to allow window.postMessage in dev.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        # COOP/COEP headers for dev
        response["Cross-Origin-Opener-Policy"] = "unsafe-none"
        response["Cross-Origin-Embedder-Policy"] = "unsafe-none"
        return response
