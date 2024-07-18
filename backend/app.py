from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import speech_recognition as sr
import requests
from werkzeug.utils import secure_filename
from moviepy.editor import VideoFileClip
import logging
from pydub import AudioSegment

app = Flask(__name__)
CORS(app)

# Hugging Face API details 
API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
API_KEY = "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"
headers = {"Authorization": f"Bearer {API_KEY}"}

logging.basicConfig(level=logging.INFO)

def extract_audio_from_video(video_path):
    try:
        clip = VideoFileClip(video_path)
        audio_path = os.path.join('uploads', 'audio.wav')
        clip.audio.write_audiofile(audio_path)
        return audio_path
    except Exception as e:
        logging.error(f"Error extracting audio from video: {e}")
        return None

def convert_audio_to_text(file_path):
    recognizer = sr.Recognizer()
    audio_file = sr.AudioFile(file_path)
    try:
        with audio_file as source:
            audio = recognizer.record(source)
        text = recognizer.recognize_google(audio)
        return text
    except sr.UnknownValueError:
        logging.warning("Speech recognition could not understand audio")
        return ""
    except sr.RequestError as e:
        logging.error(f"Could not request results from Google Speech Recognition service; {e}")
        return ""
    except Exception as e:
        logging.error(f"Unexpected error during audio to text conversion: {e}")
        return ""

def summarize_text(text):
    try:
        response = requests.post(API_URL, headers=headers, json={"inputs": text})
        response.raise_for_status()  # Raise exception for HTTP errors
        summary_list = response.json()
        if isinstance(summary_list, list) and len(summary_list) > 0:
            summary = summary_list[0].get('summary_text', 'Error: Unable to summarize text.')
        else:
            summary = "Error: Unexpected response format."
        return summary
    except requests.exceptions.RequestException as e:
        logging.error(f"HTTP request error in summarize_text function: {str(e)}")
        return f"Error: {str(e)}"
    except KeyError as e:
        logging.error(f"KeyError in summarize_text function: {str(e)} - Response: {response.json()}")
        return "Error: Unable to summarize text."
    except Exception as e:
        logging.error(f"Unexpected error in summarize_text function: {str(e)}")
        return "Error: Unexpected error occurred."

@app.route('/')
def index():
    return "Welcome to the Audio and Video Summarization API!"

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    allowed_extensions = {'mp4', 'avi', 'mov', 'mpeg', 'wav'}
    if '.' not in file.filename or file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        return jsonify({'error': 'File must be a video or audio file'}), 400

    file_path = os.path.join('uploads', secure_filename(file.filename))
    file.save(file_path)

    if file.filename.endswith('.wav'):
        text = convert_audio_to_text(file_path)
    else:
        audio_file_path = extract_audio_from_video(file_path)
        if not audio_file_path:
            return jsonify({'error': 'Failed to extract audio from video'}), 500
        text = convert_audio_to_text(audio_file_path)

    if not text:
        return jsonify({'error': 'Failed to convert audio to text'}), 500

    summary = summarize_text(text)
    return jsonify({'text': text, 'summary': summary})

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    app.run(debug=True)
