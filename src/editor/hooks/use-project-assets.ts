"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { AssetObjectUrlPool, loadProjectAssets } from "@/storage";

const EMPTY_ASSETS = new Map<string, string>();

export function useProjectAssets(projectId: string) {
  const poolRef = useRef<AssetObjectUrlPool | null>(null);
  poolRef.current ??= new AssetObjectUrlPool();
  const [assetUrls, setAssetUrls] = useState<ReadonlyMap<string, string>>(EMPTY_ASSETS);

  const reloadAssets = useCallback(async () => {
    const records = await loadProjectAssets(projectId);
    setAssetUrls(new Map(poolRef.current?.replace(records) ?? []));
  }, [projectId]);

  useEffect(() => {
    void reloadAssets();
    const pool = poolRef.current;
    return () => pool?.dispose();
  }, [reloadAssets]);

  return { assetUrls, reloadAssets };
}
