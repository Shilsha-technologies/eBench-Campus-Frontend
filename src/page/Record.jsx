import { useRef, useCallback } from 'react';

export function useMediaStream() {
  const mediaStreamRef = useRef(null);

  const getMediaStream = useCallback(async (constraints = { audio: true, video: true }) => {
    if (mediaStreamRef.current) return mediaStreamRef.current;
    try {
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = s;
      return s;
    } catch (err) {
      throw err;
    }
  }, []);

  const stopAllTracks = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
  }, []);

  return { mediaStreamRef, getMediaStream, stopAllTracks };
}

// File: hooks/useMicTest.js
// import {  useState, useCallback, useEffect } from 'react';

export function useMicTest({ mediaStreamRef, canvasRef }) {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const rafRef = useRef(null);
  const micLevelRef = useRef(0);
  const [micTestActive, setMicTestActive] = useState(false);
  const [micTestPassed, setMicTestPassed] = useState(false);

  const PASS_RMS_THRESHOLD = 0; // tweak
  const PASS_SECONDS_REQUIRED = 0.01;
  const micTimerRef = useRef(null);

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'rgba(255,255,255,0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#0ea5e9';
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      let sum = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0 - 1.0;
        sum += Math.abs(v);
        const y = (v * canvas.height) / 2 + canvas.height / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      micLevelRef.current = sum / bufferLength;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
  }, [canvasRef]);

  const start = useCallback(async () => {
    if (!mediaStreamRef.current) {
      throw new Error('No media stream');
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      // already started
    } else {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      sourceRef.current = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
      sourceRef.current.connect(analyserRef.current);
    }

    setMicTestActive(true);
    drawWaveform();

    // Run mic-level check
    let passStart = null;
    micTimerRef.current = setInterval(() => {
      const lvl = micLevelRef.current;
      if (lvl > PASS_RMS_THRESHOLD) {
        if (!passStart) passStart = performance.now();
        const held = (performance.now() - passStart) / 1000;
        if (held >= PASS_SECONDS_REQUIRED) {
          setMicTestPassed(true);
          stop();
          clearInterval(micTimerRef.current);
          micTimerRef.current = null;
        }
      } else {
        passStart = null;
      }
    }, 150);
  }, [drawWaveform, mediaStreamRef]);

  const stop = useCallback(() => {
    setMicTestActive(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => { });
      audioContextRef.current = null;
      analyserRef.current = null;
      sourceRef.current = null;
    }

    if (micTimerRef.current) {
      clearInterval(micTimerRef.current);
      micTimerRef.current = null;
    }

    // clear canvas
    const c = canvasRef.current;
    if (c) {
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, c.width, c.height);
    }
  }, [canvasRef]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    micTestActive,
    micTestPassed,
    micLevelRef,
    startMicTest: start,
    stopMicTest: stop,
  };
}


export function useSpeechToText() {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const recordingRef = useRef(false);
  const finalTranscriptRef = useRef(''); // source of truth, immune to stale closures

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = '';
    setTranscript('');
    setInterim('');
  }, []);

  const start = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      throw new Error('SpeechRecognition not supported');
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const res = event.results[i];
        if (res.isFinal) {
          finalTranscriptRef.current =
            (finalTranscriptRef.current ? finalTranscriptRef.current + ' ' : '') +
            res[0].transcript.trim();
        } else {
          interimText += res[0].transcript;
        }
      }
      setTranscript(finalTranscriptRef.current);
      setInterim(interimText);
    };

    recognition.onerror = (e) => {
      console.warn('Speech recognition error:', e);
    };

    recognition.onend = () => {
      setListening(false);
      if (recordingRef.current) {
        setTimeout(() => {
          try {
            if (recognitionRef.current) recognitionRef.current.start();
          } catch (e) { }
        }, 200);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    recordingRef.current = true;
  }, []); // no longer depends on `transcript` — no more stale closures

  const stop = useCallback(() => {
    recordingRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = () => { };
        recognitionRef.current.stop();
      } catch (e) { }
      recognitionRef.current = null;
    }
    setListening(false);
  }, []);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return {
    listening,
    transcript,
    interim,
    startRecognition: start,
    stopRecognition: stop,
    setTranscript,
    resetTranscript, // new
  };
}

// File: hooks/useRecorder.js
// import { useRef, useState, useCallback } from 'react';

export function useRecorder({ mediaStreamRef, onRecordingStop }) {
  const recorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false); // ✅ NEW
  const [videoURL, setVideoURL] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);

  const startRecording = async () => {
    const stream = mediaStreamRef.current;
    if (!stream) throw new Error("No media stream");

    recordedChunksRef.current = [];

    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp9,opus",
    });

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, {
        type: "video/webm",
      });

      setRecordedBlob(blob);
      const url = URL.createObjectURL(blob);
      setVideoURL(url);

      if (onRecordingStop) onRecordingStop(blob, url);
    };

    recorderRef.current = recorder;
    recorder.start(200);
    setRecording(true);
    setPaused(false); // ✅ reset
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    setRecording(false);
    setPaused(false);
  };

  // ✅ NEW: Pause
  const pauseRecording = () => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.pause();
      setPaused(true);
    }
  };

  // ✅ NEW: Resume
  const resumeRecording = () => {
    if (recorderRef.current && recorderRef.current.state === "paused") {
      recorderRef.current.resume();
      setPaused(false);
    }
  };

  return {
    recording,
    paused, // ✅ expose
    startRecording,
    stopRecording,
    pauseRecording,   // ✅ expose
    resumeRecording,  // ✅ expose
    videoURL,
    setVideoURL,
    recordedBlob,
  };
}

// File: RecordInterviewPage.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import { useUploadTestMutation } from '../redux/services/userApi';
import toast from 'react-hot-toast';

export default function RecordInterviewPage() {
  const navigate = useNavigate();
  const { mediaStreamRef, getMediaStream, stopAllTracks } = useMediaStream();
  const canvasRef = useRef(null);
  const localVideoRef = useRef(null);
  const location = useLocation();
  const candidateId = location?.state?.data ?? null;
  const [uploadTest, { isLoading }] = useUploadTestMutation();

  // console.log("local-video-ref", localVideoRef);

  const { micTestActive, micTestPassed, micLevelRef, startMicTest, stopMicTest } = useMicTest({ mediaStreamRef, canvasRef });
  const { listening, transcript, interim, startRecognition, stopRecognition, setTranscript, resetTranscript } = useSpeechToText();
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  const onRecordingStop = (blob, url) => {
    if (blob && blob.size > 0) {
      toast.success('Video recorded and saved. You can review or upload it now.', {
        duration: 5000,
      });
    } else {
      toast.error('Recording failed — no video data was captured. Please record again.');
    }
  };

  // const { recording, videoURL, startRecording, stopRecording, recordedBlob, setVideoURL } = useRecorder({ mediaStreamRef, onRecordingStop });
  const {
    recording,
    paused,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    videoURL,
    recordedBlob,
    setVideoURL
  } = useRecorder({ mediaStreamRef, onRecordingStop });
  useEffect(() => {
    // warm-up media to reduce permission friction
    getMediaStream().then((s) => {
      if (localVideoRef.current) localVideoRef.current.srcObject = s;
    }).catch((e) => {
      console.warn('Media init failed:', e);
    });

    return () => {
      stopAllTracks();
      stopMicTest();
      stopRecognition();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartMicTest = async () => {
    try {
      if (!mediaStreamRef.current) await getMediaStream();
      await startMicTest();
    } catch (e) {
      alert('Please allow microphone & camera.');
    }
  };


  const startRecordingFlow = async () => {
    try {
      if (!mediaStreamRef.current) await getMediaStream();
      if (localVideoRef.current) localVideoRef.current.srcObject = mediaStreamRef.current;
      // reset transcript
      setTranscript('');
      resetTranscript()
      await startRecording();
      startRecognition();
      setTimer(0);

      // simple timer 
      timerRef.current = setInterval(() => {
        setTimer((t) => {
          const nt = t + 1;
          if (nt >= 120) {
            stopRecordingFlow();
          }
          return nt;
        });
      }, 1000);
    } catch (e) {
      alert('Recording failed or not supported in this browser.');
    }
  };

  function recognition(s1, s2) {

  }


  const handlePause = () => {
    pauseRecording();
    stopRecognition();

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleResume = () => {
    resumeRecording();
    startRecognition();

    timerRef.current = setInterval(() => {
      setTimer((t) => {
        const nt = t + 1;
        if (nt >= 120) {
          stopRecordingFlow();
        }
        return nt;
      });
    }, 1000);
  };

  const stopRecordingFlow = () => {
    stopRecording();
    stopRecognition();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimer(0);
    // keep stream active if you want; here we stop it to release camera
    stopAllTracks();
  };


  const uploadVideo = async () => {
    if (!videoURL) return alert('No video to upload');

    const file = new File([recordedBlob], "interview.webm", {
      type: "video/webm",
    });
    // console.log("ffff", file)


    const formData = new FormData();
    formData.append("file", file);
    formData.append("candidate_session", candidateId)
    // debugger;
    try {
      const result = await uploadTest(formData);
      if (result?.error) {
        toast.error(result?.error?.data?.detail ?? 'Upload failed. Please try again.')
        return;
      }
      toast.success('Video uploaded successfully!');

      setTimeout(() => {
        navigate('/test-success');
      }, 1500)
      // debugger;
      // console.log("result from api", result);

    } catch (err) {
      // console.log("ee", e);
      toast.error(err?.data?.detail ?? "Something went wrong Pls try again.")
    }

  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-br pt-20 from-slate-50 via-white to-blue-50 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden"
        >
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-7 pr-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#0f5e87]">AI Interview — Speaking Test</h2>
                  <p className="text-sm text-gray-500 mt-1">Mic check → Live transcript → Record video</p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-500">Mic Status</div>
                  <div
                    className={`mt-1 px-3 py-1 rounded-full text-sm font-semibold ${micTestPassed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {micTestPassed ? 'Ready' : micTestActive ? 'Testing...' : 'Not tested'}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 shadow-sm bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-[#0f5e87]">Live Transcript</h4>
                  <div className="text-sm text-gray-500">Interim shown in gray</div>
                </div>

                <div className="min-h-[140px] max-h-56 overflow-auto p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <p className="whitespace-pre-wrap text-gray-800">
                    {transcript}
                    <span className="text-gray-400"> {interim}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="col-span-5 pl-4">
              <div className="relative mb-4">
                <div className="absolute -top-4 -right-4 p-2 rounded-full bg-gradient-to-br from-[#0f5e87] to-[#2b82a8] text-white text-xs shadow-lg">AI Mode</div>

                <div className="w-full rounded-xl overflow-hidden border border-slate-100 shadow-lg">
                  <div className="relative">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-91 h-48 mx-auto mt-3 rounded-2xl object-cover bg-black"
                    />
                    {/* {recording && (
                      <motion.div
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        className="absolute top-3 left-3 bg-red-500 w-3 h-3 rounded-full shadow"
                      />
                    )} */}
                    {/* 🔴 Recording Indicator */}
                    {recording && !paused && (
                      <motion.div
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        className="absolute top-3 left-3 bg-red-500 w-3 h-3 rounded-full shadow"
                      />
                    )}

                    {/* ⏸️ Paused Indicator */}
                    {recording && paused && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-semibold shadow">
                        Paused
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm text-gray-500">Camera</div>
                        <div className="font-semibold text-gray-800">Front Camera</div>
                      </div>
                      <div className="text-sm text-gray-500">Status: {mediaStreamRef.current ? 'Live' : 'No camera'}</div>
                    </div>

                    <div className="mt-3">
                      <canvas ref={canvasRef} width={400} height={80} className="w-full rounded-md bg-white" />
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <div>Mic level</div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm">{(micLevelRef.current * 100).toFixed(0)}%</div>
                          {micTestPassed ? (
                            <div className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">Passed</div>
                          ) : (
                            <div className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs">Not passed</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {
                  !micTestPassed &&
                  <button
                    onClick={async () => {
                      if (!micTestActive && !micTestPassed) {
                        await handleStartMicTest();
                      } else {
                        stopMicTest();
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-linear-to-r from-[#0f5e87] to-[#2b82a8] text-white font-semibold shadow"
                  >
                    {micTestPassed ? 'Mic Ready ✓' : micTestActive ? 'Stop Mic Test' : 'Start Mic Test'}
                  </button>
                }


                <button
                  disabled={isLoading}
                  onClick={() => {
                    if (!micTestPassed) {
                      alert('Please pass the mic test first so your audio is loud & clear.');
                      return;
                    }
                    if (!recording) startRecordingFlow();
                    else stopRecordingFlow();
                  }}
                  className={`w-full px-4 py-3 rounded-xl font-semibold shadow ${recording ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
                >
                  {recording ? '⏹ Stop Recording' : '🎬 Start Recording'}
                </button>

                {recording && (
                  <button
                  disabled={isLoading}
                    onClick={() => {
                      if (paused) handleResume();
                      else handlePause();
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-yellow-500 text-white font-semibold shadow"
                  >
                    {paused ? '▶ Resume Recording' : '⏸ Pause Recording'}
                  </button>
                )}

                {videoURL && (
                  <div className="space-y-2">
                    <a href={videoURL} target="_blank" rel="noreferrer" className="block text-sm text-blue-700 underline">Open recorded video</a>
                    <div className="flex gap-2">
                      <button
                        disabled={isLoading}
                        onClick={() => uploadVideo()}
                        className={`flex-1 px-4 py-2 rounded-lg bg-[#0f5e87] text-white font-semibold flex items-center justify-center gap-2 transition-all ${isLoading
                            ? "cursor-not-allowed opacity-70"
                            : "cursor-pointer hover:bg-[#1675a5]"
                          }`}
                      >
                        {isLoading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          "⬆ Upload"
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="text-xs text-center text-gray-400 mt-2">Tip: Allow microphone & camera. Use Chrome for best STT experience.</div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </>
  );
}
