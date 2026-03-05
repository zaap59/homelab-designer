import { RouterNode }    from './RouterNode'
import { SwitchNode }    from './SwitchNode'
import { ServerNode }    from './ServerNode'
import { VMNode }        from './VMNode'
import { ContainerNode } from './ContainerNode'
import { FirewallNode }  from './FirewallNode'
import { NASNode }       from './NASNode'
import { CloudNode }     from './CloudNode'
import { ISPNode }       from './ISPNode'
import { APWiFiNode }    from './APWiFiNode'
import { GroupNode }     from './GroupNode'
import { CameraNode }    from './CameraNode'

export {
  RouterNode, SwitchNode, ServerNode, VMNode,
  ContainerNode, FirewallNode, NASNode, CloudNode,
  ISPNode, APWiFiNode, GroupNode, CameraNode,
}

export const nodeTypes = {
  router:    RouterNode,
  switch:    SwitchNode,
  server:    ServerNode,
  vm:        VMNode,
  container: ContainerNode,
  firewall:  FirewallNode,
  nas:       NASNode,
  cloud:     CloudNode,
  isp:       ISPNode,
  apwifi:    APWiFiNode,
  group:     GroupNode,
  camera:    CameraNode,
} as const
