import React from "react";

import { SegmentedControl, Pagination } from "evergreen-ui";

import styles from "./Browser.module.css";
import { connect, ConnectedProps } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { closeBrowser } from "../browser/browserSlice";
import { getBrowserInfo, getBrowserStatus } from "./browserSlice";

const mapStateToProps = (state: RootState) => ({
  browserState: getBrowserStatus(state),
  browserInfo: getBrowserInfo(state),
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  closeBrowser: () => dispatch(closeBrowser()),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

function Image() {
  return (
    <div className={styles.imageContainer}>
      <img
        style={{ width: "400px" }}
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png"
      />
    </div>
  );
}

function Browser({ browserState, browserInfo, closeBrowser }: Props) {
  const [options] = React.useState([
    { label: "Fox", value: "fox" },
    { label: "Badger", value: "badger" },
    { label: "Cat", value: "cat" },
  ]);
  const [value, setValue] = React.useState<string | number | boolean>("fox");

  return (
    <div>
      {browserState ? (
        <div className={styles.containerBackground}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h3 className={styles.title}>{browserInfo.name}</h3>
              <h3 onClick={() => closeBrowser()} className={styles.cancel}>
                ✕
              </h3>
            </div>
            <div className={styles.filterBar}>
              <SegmentedControl
                width={240}
                size="small"
                options={options}
                value={value}
                onChange={(value) => setValue(value)}
              />
            </div>
            <div className={styles.canvas}>
              <div className={styles.columnContainer}>
                <div className={styles.rowContainer}>
                  <Image />
                  <Image />
                  <Image />
                </div>
                <div className={styles.rowContainer}>
                  <Image />
                  <Image />
                  <Image />
                </div>
              </div>
            </div>
            <div className={styles.footer}>
              <Pagination page={1} totalPages={5}></Pagination>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default connector(Browser);
