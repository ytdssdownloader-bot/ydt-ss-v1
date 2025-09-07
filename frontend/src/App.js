import React, { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/download",
        { url },
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "video.mp4"; // You can later return real filename from backend
      link.click();
    } catch (error) {
      console.error(error);
      alert("Download failed");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "50px" }}>
      <h1>YouTube Video Downloader</h1>
      <input
        type="text"
        placeholder="Enter YouTube URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "400px", padding: "10px" }}
      />
      <button
        onClick={handleDownload}
        disabled={loading}
        style={{ marginLeft: "10px", padding: "10px" }}
      >
        {loading ? "Downloading..." : "Download"}
      </button>
    </div>
  );
}

export default App;
