// components/CookingAssistant.js
import React, { useEffect, useRef, useState, useCallback } from "react";
import { AIResponse, fetchTTS } from "../api";
import { useCharacter } from "../contexts/CharacterContext";
import CircularTimer from "./CircularTimer";

function CookingAssistant({ recipe, currentStep, setCurrentStep }) {
  const { character } = useCharacter();
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);
  const abortControllerRef = useRef(null);
  const [isAssistantOn, setIsAssistantOn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const alarmAudioRef = useRef(null);
  const [, setAlarmPlaying] = useState(false);

  const playCloudTTS = useCallback(async (text) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      if (abortControllerRef.current) abortControllerRef.current.abort();

      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      const response = await fetchTTS(
          text,
          abortControllerRef.current,
          character,
          "wav"
        );
      const data = await response.json();
      
      if (data.audioBase64) {
        const mime = "audio/wav";
        const blob = new Blob(
          [Uint8Array.from(atob(data.audioBase64), c => c.charCodeAt(0))],
          { type: mime }
        );
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        await audio.play();
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error("TTS 오류:", err);
    }
  },
 [character]
);

  const handleAssistantAction = (data) => {
    if (!data || !data.action) return;

    switch (data.action) {
      case "next_step":
        setCurrentStep((prev) => Math.min(prev + 1, recipe.instructions.length - 1));
        break;
      case "prev_step":
        setCurrentStep((prev) => Math.max(prev - 1, 0));
        break;
      case "repeat_step":
        playCloudTTS(recipe.instructions[currentStep]);
        break;
      case "set_timer":
        if (data.time) {
          let seconds = parseInt(data.time, 10);
          if (data.unit === "분") seconds *= 60;
          setCookingTimer(seconds);
        }
        break;
      case "cancel_timer":
        setTimer(null);
        setTimeLeft(0);
        setTimerActive(false);
        stopAlarm();
        break;
      case "response":
        if (data.answer) {
          // ① 답변 재생 전 음성 인식 중지
          recognitionRef.current?.stop();
          setIsListening(false);

          // ② TTS 재생 후 음성 인식 재시작
          playCloudTTS(data.answer).then((audio) => {
            if (audio) {
              audio.onended = () => {
                if (isAssistantOn) {
                  try {
                    recognitionRef.current?.start();
                    setIsListening(true);
                  } catch (err) {
                    console.warn("음성 인식 재시작 실패:", err);
                  }
                }
              };
            }
          });
        }
        break;
      default:
        console.warn("알 수 없는 명령:", data.action);
    }
  };

  const fetchAIResponse = async (question) => {
    if (!character) {
           alert("먼저 상단에서 캐릭터를 선택해주세요.");
           return;
         }
    try {
      const response = await AIResponse(question, recipe, character);
      const data = await response.json();
      handleAssistantAction(data);
    } catch (error) {
      console.error("AI 응답 오류:", error);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("음성 인식을 지원하지 않는 브라우저입니다.");
      return;
    }
  
    // recognition 객체가 없으면 새로 생성
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "ko-KR";
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
  
      // 이벤트 핸들러 등록
      recognitionRef.current.onstart = () => {
        console.log("🎙️ 음성 인식 시작됨...");
        setIsListening(true);
        setIsAssistantOn(true);
      };
  
      recognitionRef.current.onresult = (event) => {
        const voiceText = event.results[event.results.length - 1][0].transcript.trim();
        console.log("음성 입력:", voiceText);
        fetchAIResponse(voiceText);
      };
  
      recognitionRef.current.onerror = (event) => {
        console.error("음성 인식 오류:", event.error);
        setIsListening(false);
      };
  
      recognitionRef.current.onend = () => {
        console.log("음성 인식 종료됨");
        setIsListening(false);
  
        // assistant가 켜져 있다면 자동 재시작
        if (isAssistantOn) {
          setTimeout(() => {
            if (!isListening) {
              try {
                recognitionRef.current?.start();
                setIsListening(true);
              } catch (error) {
                console.warn("음성 인식 재시작 실패:", error);
              }
            }
          }, 1000);
        }
      };
    }
  
    // 중복 실행 방지: isListening이 false일 때만 start 호출
    if (!isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        if (error.name === "InvalidStateError") {
          console.warn("이미 음성 인식이 실행 중입니다.");
        } else {
          console.error("startListening 오류:", error);
        }
      }
    }
  };
  

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsAssistantOn(false);
  };

  // AI 어시스턴트 버튼 클릭 시 ON/OFF
  const toggleAssistant = () => {
    if (isAssistantOn) {
      stopListening();
      setIsListening(false);
    } else {
      startListening();
      setIsAssistantOn(true);
    }
  };

  const setCookingTimer = (seconds) => {
    setTimeLeft(seconds);
    setTimer(seconds);
    setTimerActive(true);
    playCloudTTS(`${seconds}초 타이머를 설정했습니다.`);
  };

  const stopAlarm = () => {
    if (alarmAudioRef.current) {
      alarmAudioRef.current.pause();
      alarmAudioRef.current.currentTime = 0;
      setAlarmPlaying(false);
    }
    setTimer(null);
    setTimeLeft(0);
    setTimerActive(false);
  };

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!recipe || !recipe.instructions) return;

    const currentText = recipe.instructions[currentStep];
    if (currentText) {
      playCloudTTS(currentText);
    }
  }, [currentStep, recipe, playCloudTTS]);


  return (
    <div style={{ marginTop: "30px" }}>
      <button
        onClick={toggleAssistant}
        style={{ marginTop: "20px", padding: "10px 15px", fontSize: "1rem", backgroundColor: isAssistantOn ? "red" : "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >
        {isAssistantOn ? "AI 어시스턴트 끄기" : "AI 어시스턴트 켜기"}
      </button>
      {timerActive && (
        <CircularTimer
          timeLeft={timeLeft}
          isRunning={isAssistantOn}
          initialTime={timer}
          onStop={() => {setTimerActive(false); stopAlarm();}}
        />
      )}
    </div>
  );
}

export default CookingAssistant;
