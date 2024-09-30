from . import (
    auth_route,
    dramatiq_routes
    )

"""
add your protected route here
"""
PROTECTED_ROUTES = [
]


"""
add your public route here
"""
PUBLIC_ROUTES = [
    auth_route.router,
    dramatiq_routes.router
]
