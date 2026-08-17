import { ProgressBar, Label } from "react-aria-components";

const LoadingScreen = () => {
  return (
    <div className="loader">
      <ProgressBar aria-label="Loading…" isIndeterminate>
        {({ percentage }) => (
          <>
            <Label>Loading</Label>
            <div className="bar">
              <div className="fill" style={{ width: percentage + "%" }} />
            </div>
          </>
        )}
      </ProgressBar>
    </div>
  );
};

export default LoadingScreen;
