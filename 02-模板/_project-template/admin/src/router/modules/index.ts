import { AppRouteRecord } from '@/types/router'
import { systemHomeRoutes } from './system-home'
import { organizationTemplateRoutes } from './organization-template'
import { permissionTemplateRoutes } from './permission-template'
import { systemConfigRoutes } from './system-config'

export const routeModules: AppRouteRecord[] = [
  systemHomeRoutes,
  organizationTemplateRoutes,
  permissionTemplateRoutes,
  systemConfigRoutes
]
