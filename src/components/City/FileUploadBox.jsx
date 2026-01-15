export const FileUploadBox = ({ label, handleGeoJsonUpload }) => {
  return (
    <div
      style={{
        border: '2px dashed #9ca3af',
        borderRadius: '10px',
        padding: '18px',
        textAlign: 'center',
        cursor: 'pointer',
        background: '#f9fafb',
        position: 'relative'
      }}
      onClick={() =>
        document.getElementById(label).click()
      }
    >
      <input
        id={label}
        type="file"
        onChange={handleGeoJsonUpload}
        style={{ display: 'none' }}
      />

      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
        {label}
      </div>

      <div style={{ fontSize: '12px', color: '#6b7280' }}>
        Click to upload (.geojson, .kml)
      </div>
    </div>
  );
};
