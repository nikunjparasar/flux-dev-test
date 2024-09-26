// src/components/PhotopeaEditor.tsx
import React, { useEffect } from 'react';

interface PhotopeaEditorProps {
  onClose: () => void;
  image: string | null;
  onSave: (dataURL: string) => void;
}

declare global {
  interface Window {
    Photopea: any;
  }
}

const PhotopeaEditor: React.FC<PhotopeaEditorProps> = ({ onClose, image, onSave }) => {
  useEffect(() => {
    const iframe = document.getElementById('photopea-iframe') as HTMLIFrameElement;

    iframe.onload = () => {
      if (image) {
        // Send the image to Photopea
        iframe.contentWindow?.postMessage(
          {
            type: 'load',
            data: image,
          },
          '*'
        );
      }
    };

    // Listen for messages from Photopea
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'ready') {
        // Photopea is ready
        if (image) {
          iframe.contentWindow?.postMessage(
            {
              type: 'load',
              data: image,
            },
            '*'
          );
        }
      } else if (event.data.type === 'save') {
        // Get the edited image
        onSave(event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [image, onSave]);

  return (
    <div className="absolute inset-0 z-50">
      <iframe
        id="photopea-iframe"
        src="https://www.photopea.com"
        title="Photopea Editor"
        className="w-full h-full"
      ></iframe>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Close
      </button>
    </div>
  );
};

export default PhotopeaEditor;
