import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
}

export function VoiceInput({ onTranscript }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join("");
          
          if (event.results[0].isFinal) {
            onTranscript(transcript);
            stopListening();
          }
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error", event);
          toast({
            title: "Error",
            description: "There was an error with speech recognition. Please try again.",
            variant: "destructive",
          });
          stopListening();
        };

        setRecognition(recognition);
      }
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onTranscript, toast]);

  const startListening = () => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
        toast({
          title: "Listening",
          description: "Speak now to create a task...",
        });
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        toast({
          title: "Error",
          description: "Could not start speech recognition. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognition) {
      try {
        recognition.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
      setIsListening(false);
    }
  };

  return (
    <Button
      variant={isListening ? "destructive" : "outline"}
      size="icon"
      onClick={isListening ? stopListening : startListening}
      className="transition-colors duration-200"
    >
      {isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}