import React, { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const downloadVideo = async () => {
    if (!url) return alert("Please enter a YouTube URL");

    setLoading(true);
    try {
      const response = await axios.post(
        "https://ydt-ss-v1.onrender.com/download",
        // "http://127.0.0.1:5000/download",
        { url },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "video/mp4" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "video.mp4";
      link.click();
    } catch (error) {
      console.error("Download failed:", error.response?.data || error.message);
      alert("Download failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>YouTube Video Downloader</h1>
      <input
        type="text"
        placeholder="Enter YouTube URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={styles.input}
      />
      <button onClick={downloadVideo} style={styles.button} disabled={loading}>
        {loading ? "Downloading..." : "Download"}
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  title: { marginBottom: 20 },
  input: {
    width: 400,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    padding: "10px 20px",
    fontSize: 16,
    cursor: "pointer",
  },
};

export default App;
