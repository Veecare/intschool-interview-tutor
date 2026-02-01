import React, { useState, useRef } from 'react';
import { Mic, Square, Trash2 } from 'lucide-react';

function VoiceRecorder({ onTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        
        // Optionally convert speech to text here using Web Speech API
        // For now, we'll just provide the audio
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const clearRecording = () => {
    setAudioURL(null);
    chunksRef.current = [];
    if (onTranscript) onTranscript('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {!isRecording && !audioURL && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <Mic className="w-4 h-4" />
            Start Recording
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition animate-pulse"
          >
            <Square className="w-4 h-4" />
            Stop Recording
          </button>
        )}

        {audioURL && (
          <>
            <audio src={audioURL} controls className="flex-1" />
            <button
              onClick={clearRecording}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {isRecording && (
        <p className="text-sm text-red-600 animate-pulse">
          🔴 Recording... Speak your answer
        </p>
      )}
    </div>
  );
}

export default VoiceRecorder;
