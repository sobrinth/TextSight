<!--
Auto-generated by: https://github.com/threlte/threlte/tree/main/packages/gltf
Command: npx @threlte/gltf@2.0.3 house1.glb --output house1.svelte --transform
-->

<script>
  import { Group } from 'three'
  import { T, forwardEventHandlers } from '@threlte/core'
  import { useGltf } from '@threlte/extras'
  import house1 from './house1-transformed.glb'

  export const ref = new Group()

  const gltf = useGltf(house1, { useDraco: true })

  const component = forwardEventHandlers()
</script>

<T is={ref} dispose={false} {...$$restProps} bind:this={$component}>
  {#await gltf}
    <slot name="fallback" />
  {:then gltf}
    <T.Mesh geometry={gltf.nodes['Node-Mesh'].geometry} material={gltf.materials.mat13} />
    <T.Mesh geometry={gltf.nodes['Node-Mesh_1'].geometry} material={gltf.materials.mat19} />
    <T.Mesh geometry={gltf.nodes['Node-Mesh_2'].geometry} material={gltf.materials.mat20} />
    <T.Mesh geometry={gltf.nodes['Node-Mesh_3'].geometry} material={gltf.materials.mat18} />
    <T.Mesh geometry={gltf.nodes['Node-Mesh_4'].geometry} material={gltf.materials.mat8} />
  {:catch error}
    <slot name="error" {error} />
  {/await}

  <slot {ref} />
</T>
