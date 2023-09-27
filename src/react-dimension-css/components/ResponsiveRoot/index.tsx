"use client";

import styles from './styles.module.css';
import React from "react";


interface ResponsiveRootProps {
  baseDimension: number,
  children?: React.ReactNode
}

interface SceneDimension {
  width: number;
  height: number;
}

function ResponsiveRoot(props: ResponsiveRootProps) {
  const [rootDimension, setRootDimension] = React.useState<SceneDimension | null>(null);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      setRootDimension({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  let scaleFactor: number;
  if (rootDimension) {
    const minDimension = Math.min(rootDimension.height, rootDimension.width);
    scaleFactor = minDimension / props.baseDimension;
  } else {
    scaleFactor = 1;
  }

  return <div className={styles.responsiveRoot} ref={ref}>
    <div className={styles.responsiveResizer} style={{
      "--scaleFactor": scaleFactor,
    } as React.CSSProperties}>
      {props.children}
    </div>
  </div>;
}

export default React.memo(ResponsiveRoot);
