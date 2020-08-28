import { useState } from "react";

import styles from "./FaceIdentitication.module.css";

interface TmpFace {
  x: number;
  y: number;
  h: number;
  w: number;
}

interface Props {
  onSelect: (f: TmpFace) => void;
  children: React.ReactNode;
}

function FaceIdentification({ onSelect, children }: Props) {
  const [tmpFace, setTmpFace] = useState<TmpFace>(null);

  return (
    <div
      className={styles.container}
      onMouseDown={
        !tmpFace
          ? function (event) {
              event.stopPropagation();
              setTmpFace({
                x: event.pageX - event.currentTarget.offsetLeft,
                y: event.pageY - event.currentTarget.offsetTop,
                h: 0,
                w: 0,
              });
            }
          : null
      }
      onMouseMove={
        tmpFace
          ? function (event) {
              event.stopPropagation();
              setTmpFace({
                ...tmpFace,
                w: event.pageX - event.currentTarget.offsetLeft - tmpFace.x,
                h: event.pageY - event.currentTarget.offsetTop - tmpFace.y,
              });
            }
          : null
      }
      onMouseUp={(event) => {
        event.stopPropagation();
        onSelect(tmpFace);
        setTmpFace(null);
      }}
    >
      <>
        {children}
        {tmpFace && (
          <div
            className={styles.tmpFaceBorder}
            style={{
              left: tmpFace.x,
              top: tmpFace.y,
              width: tmpFace.w,
              height: tmpFace.h,
            }}
          />
        )}
      </>
    </div>
  );
}

export default FaceIdentification;
