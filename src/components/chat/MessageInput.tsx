import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Image, Video, Mic, Loader2 } from 'lucide-react';

interface MessageInputProps {
  roomId: string;
  replyTo?: string;
  onMessageSent?: () => void;
}

const MessageInput = ({ roomId, replyTo, onMessageSent }: MessageInputProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const sendMessage = async (
    content: string,
    type: string = 'text',
    fileUrl?: string,
    fileName?: string
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          user_id: user.id,
          content: content || null,
          message_type: type,
          file_url: fileUrl || null,
          file_name: fileName || null,
          reply_to: replyTo || null
        });

      if (error) throw error;

      setMessage('');
      if (onMessageSent) onMessageSent();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(message, 'text');
  };

  const handleFileUpload = async (file: File, type: string) => {
    if (!user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-files')
        .getPublicUrl(fileName);

      await sendMessage(message, type, publicUrl, file.name);
      setMessage('');
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error('Erreur lors de l\'envoi du fichier');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let type = 'file';
    if (file.type.startsWith('image/')) type = 'image';
    else if (file.type.startsWith('video/')) type = 'video';
    else if (file.type.startsWith('audio/')) type = 'audio';

    handleFileUpload(file, type);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const file = new File([audioBlob], `audio-${Date.now()}.webm`, { type: 'audio/webm' });
        await handleFileUpload(file, 'audio');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      toast.success('Enregistrement en cours...');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Erreur lors de l\'accès au microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
      />

      <Button
        size="icon"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Paperclip className="h-4 w-4" />
        )}
      </Button>

      <Button
        size="icon"
        variant="outline"
        onClick={recording ? stopRecording : startRecording}
        className={recording ? 'bg-destructive text-destructive-foreground' : ''}
      >
        <Mic className="h-4 w-4" />
      </Button>

      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Écrivez votre message..."
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        disabled={uploading || recording}
      />

      <Button onClick={handleSend} disabled={!message.trim() || uploading || recording}>
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MessageInput;
