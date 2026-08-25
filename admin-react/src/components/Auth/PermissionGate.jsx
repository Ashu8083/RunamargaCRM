import {
    hasAllPermissions,
    hasAnyPermission,
} from '../../app/permissions'

function PermissionGate({
    permission,
    permissions,
    requireAll = false,
    fallback = null,
    children,
}) {
    const requiredPermissions = permissions || permission

    const allowed = requireAll
        ? hasAllPermissions(requiredPermissions)
        : hasAnyPermission(requiredPermissions)

    if (!allowed) return fallback

    return children
}

export default PermissionGate
