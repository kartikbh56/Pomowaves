/* eslint-disable react/prop-types */
export default function Footer({ saveSettings }) {
    return (
      <div className="settings-footer">
        <button className="ok-button" onClick={saveSettings}>
          OK
        </button>
      </div>
    );
  }