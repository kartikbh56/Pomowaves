/* eslint-disable react/prop-types */
export default function SettingsContainer({
  children,
  saveSettings,
  discardChanges,
}) {
  return (
    <div
      className="modalview"
      onClick={discardChanges}
      onKeyDown={(e) => e.key === "Enter" && saveSettings()}
    >
      <div className="settings-container" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">SETTINGS</div>
        <img
          className="close-button"
          src="icons/close.png"
          onClick={discardChanges}
        />
        <div className="settingsContent">{children}</div>
      </div>
    </div>
  );
}
