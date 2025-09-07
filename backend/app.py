from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import yt_dlp
import io

app = Flask(__name__)
CORS(app)

COOKIES_FILE = 'cookies.txt'  # Your exported cookies

@app.route('/download', methods=['POST'])
def download_video():
    data = request.json
    url = data.get('url')

    if not url:
        return jsonify({'error': 'URL is required'}), 400

    ydl_opts = {
        'format': 'best',
        'cookiefile': COOKIES_FILE,
        'noplaylist': True,
        'quiet': True,
        'no_warnings': True,
        'outtmpl': '-',  # Stream output
    }

    try:
        def generate():
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                stream_url = info.get('url')

                import requests
                with requests.get(stream_url, stream=True) as r:
                    for chunk in r.iter_content(chunk_size=8192):
                        if chunk:
                            yield chunk

        return Response(generate(), content_type='video/mp4')

    except Exception as e:
        return jsonify({'error': str(e)}), 500
