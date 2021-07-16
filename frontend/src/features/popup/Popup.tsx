import React from "react";

import styles from "./Popup.module.css";

interface labelProps {
  label: string;
  value: string;
}

function Label(props: labelProps) {
  return (
    <div className={styles.labelContainer}>
      <div className={styles.labelKey}>
        <p>{props.label}</p>
      </div>
      <div className={styles.labelValue}>
        <p>{props.value}</p>
      </div>
    </div>
  );
}

export function Popup() {
  return (
    <div className={styles.containerBackground}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Wapley Camera Trap</h3>
          <img
            className={styles.cancel}
            alt="svgImg"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMzAiIGhlaWdodD0iMzAiCnZpZXdCb3g9IjAgMCAxNzEgMTcxIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MS45OTE4NHYtMTcxLjk5MTg0aDE3MS45OTE4NHYxNzEuOTkxODR6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTM5LjksMjIuOGMtMS40NTg0OSwwIC0yLjkxODU4LDAuNTU1NTcgLTQuMDMwMDgsMS42Njk5MmwtMTEuNCwxMS40Yy0yLjIyODcsMi4yMjg3IC0yLjIyODcsNS44MzcxNiAwLDguMDYwMTZsNDEuNTY5OTIsNDEuNTY5OTJsLTQxLjU2OTkyLDQxLjU2OTkyYy0yLjIyODcsMi4yMjg3IC0yLjIyODcsNS44MzcxNSAwLDguMDYwMTVsMTEuNCwxMS40YzIuMjI4NywyLjIyODcgNS44MzcxNiwyLjIyODcgOC4wNjAxNiwwbDQxLjU2OTkyLC00MS41Njk5Mmw0MS41Njk5Miw0MS41Njk5MmMyLjIyMywyLjIyODcgNS44MzcxNSwyLjIyODcgOC4wNjAxNSwwbDExLjQsLTExLjRjMi4yMjg3LC0yLjIyODcgMi4yMjg3LC01LjgzNzE1IDAsLTguMDYwMTVsLTQxLjU2OTkyLC00MS41Njk5Mmw0MS41Njk5MiwtNDEuNTY5OTJjMi4yMjg3LC0yLjIyMyAyLjIyODcsLTUuODM3MTYgMCwtOC4wNjAxNmwtMTEuNCwtMTEuNGMtMi4yMjg3LC0yLjIyODcgLTUuODM3MTUsLTIuMjI4NyAtOC4wNjAxNSwwbC00MS41Njk5Miw0MS41Njk5MmwtNDEuNTY5OTIsLTQxLjU2OTkyYy0xLjExNDM1LC0xLjExNDM1IC0yLjU3MTU5LC0xLjY2OTkyIC00LjAzMDA4LC0xLjY2OTkyeiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+"
          />
        </div>
        <div className={styles.body}>
          <Label label="Latitude" value="-2.56" />
          <Label label="Longitude" value="51.54331" />
          <Label label="Images" value="160" />
        </div>
        <div className={styles.footer}>
          <div className={`${styles.iconButton} ${styles.deleteButton}`}>
            <h4>Delete</h4>
          </div>
          <div className={styles.iconButton}>
            <h4>Image Browser</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
