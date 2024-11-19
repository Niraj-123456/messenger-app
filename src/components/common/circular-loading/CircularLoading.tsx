import { CSSProperties } from "react";
import styles from "./circular-loading.module.css";
const CircularLoading = ({
  size,
  thickness,
  color,
  style,
}: {
  size?: string;
  thickness?: number;
  color?: string;
  style?: CSSProperties;
}) => {
  return (
    <svg
      viewBox="25 25 50 50"
      width={size ? size : "2rem"}
      className={styles.container}
      style={style}
    >
      <circle
        r="20"
        cy="50"
        cx="50"
        strokeWidth={thickness ? thickness : 3}
        stroke={color ? color : "hsl(214, 97%, 59%)"}
        className={styles.circle}
      ></circle>
    </svg>
  );
};

export default CircularLoading;
