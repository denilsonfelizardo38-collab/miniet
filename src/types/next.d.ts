declare module "next/dist/lib/metadata/types/metadata-interface.js" {
  import type { Metadata } from "next"
  export type ResolvingMetadata = (parent: Metadata) => Promise<Metadata>
  export type ResolvingViewport = (parent: Metadata) => Promise<Metadata>
}
