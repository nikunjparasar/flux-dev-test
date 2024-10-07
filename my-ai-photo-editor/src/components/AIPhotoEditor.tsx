// src/components/AIPhotoEditor.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Image as LucideImage,
  Share,
  Save,
  Folder,
  Settings,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Crop,
  RotateCw,
  Type,
  Brush,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

import NodeWorkflow from './NodeWorkflow';
import PhotopeaEditor from './PhotopeaEditor';

interface GlassmorphicPanelProps {
  children: React.ReactNode;
  className?: string;
}

const GlassmorphicPanel: React.FC<GlassmorphicPanelProps> = ({
  children,
  className = '',
}) => (
  <div
    className={`bg-gradient-to-r from-gray-700 via-gray-900 to-black bg-opacity-30 backdrop-blur-md rounded-lg shadow-2xl ${className}`}
  >
    {children}
  </div>
);

interface IconButtonProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  label,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-3 text-white hover:bg-blue-600 hover:bg-opacity-20 rounded transition-colors"
  >
    <Icon className="w-6 h-6" />
    <span className="text-xs mt-1 font-medium tracking-wide">{label}</span>
  </button>
);

interface SidebarProps {
  children: React.ReactNode;
  isLeft?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ children, isLeft = true }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className={`h-full flex ${isLeft ? 'mr-4' : 'ml-4'}`}>
      <GlassmorphicPanel
        className={`h-full ${
          isOpen ? 'w-72' : 'w-0'
        } overflow-hidden transition-all duration-300 flex flex-col`}
      >
        {children}
      </GlassmorphicPanel>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 bg-opacity-20 hover:bg-opacity-40 text-white p-3 self-center rounded-full shadow-lg"
      >
        {isOpen ? (
          isLeft ? (
            <ChevronLeft />
          ) : (
            <ChevronRight />
          )
        ) : isLeft ? (
          <ChevronRight />
        ) : (
          <ChevronLeft />
        )}
      </button>
    </div>
  );
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 rounded-lg text-white w-96 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
        {/* Settings content */}
        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold">Theme</label>
            <select className="w-full p-3 bg-gray-800 rounded focus:outline-none">
              <option>Dark</option>
              <option>Light</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold">Language</label>
            <select className="w-full p-3 bg-gray-800 rounded focus:outline-none">
              <option>English</option>
              <option>Spanish</option>
              {/* Add more languages */}
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold">Shortcuts</label>
            <button
              className="w-full py-3 bg-blue-600 rounded hover:bg-blue-700 transition-colors focus:outline-none"
              onClick={() => alert('Shortcut settings coming soon!')}
            >
              Edit Shortcuts
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-8 px-5 py-3 bg-blue-600 rounded hover:bg-blue-700 transition-colors focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const AIPhotoEditor: React.FC = () => {
  const [showNodeWorkflow, setShowNodeWorkflow] = useState(false);
  const [activeTab, setActiveTab] = useState<'tools' | 'ai'>('tools');
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    null
  );
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [showPhotopea, setShowPhotopea] = useState(false);

  const [exposure, setExposure] = useState(0);
  const [contrast, setContrast] = useState(1);
  const [saturation, setSaturation] = useState(1);

  const [controlNets, setControlNets] = useState<string[]>([]);
  const [loRAs, setLoRAs] = useState<string[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleOpen = () => {
    document.getElementById('imageUpload')?.click();
  };

  const handleSave = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'edited-image.png';
      link.click();
    }
  };

  const handleShare = () => {
    alert('Sharing feature coming soon!');
  };

  const handleAddControlNet = () => {
    const name = prompt('Enter ControlNet name:');
    if (name) setControlNets([...controlNets, name]);
  };

  const handleFineTuneLoRA = () => {
    const name = prompt('Enter LoRA model name:');
    if (name) setLoRAs([...loRAs, name]);
  };

  useEffect(() => {
    if (uploadedImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const image = new Image();
      image.src = uploadedImage;
      image.onload = () => {
        // Set canvas size to match image
        canvas.width = image.width;
        canvas.height = image.height;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply filters
        ctx.filter = `
          brightness(${exposure + 1})
          contrast(${contrast})
          saturate(${saturation})
        `;

        // Draw the image
        ctx.drawImage(image, 0, 0);
      };
    }
  }, [uploadedImage, exposure, contrast, saturation]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden flex flex-col p-6">
      <GlassmorphicPanel className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white border-opacity-10">
          <div className="flex space-x-4">
            <IconButton icon={Folder} label="Open" onClick={handleOpen} />
            <IconButton icon={Save} label="Save" onClick={handleSave} />
            <IconButton icon={Share} label="Share" onClick={handleShare} />
            <IconButton icon={Undo} label="Undo" onClick={() => alert('Undo action')} />
            <IconButton icon={Redo} label="Redo" onClick={() => alert('Redo action')} />
          </div>
          <div className="flex space-x-4">
            <IconButton
              icon={Settings}
              label="Settings"
              onClick={() => setSettingsModalOpen(true)}
            />
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left sidebar */}
          <Sidebar>
            <div className="flex border-b border-white border-opacity-10">
              <button
                className={`flex-1 p-3 font-semibold tracking-wide text-sm ${
                  activeTab === 'tools' ? 'bg-blue-600 bg-opacity-30' : ''
                }`}
                onClick={() => setActiveTab('tools')}
              >
                Tools
              </button>
              <button
                className={`flex-1 p-3 font-semibold tracking-wide text-sm ${
                  activeTab === 'ai' ? 'bg-blue-600 bg-opacity-30' : ''
                }`}
                onClick={() => setActiveTab('ai')}
              >
                AI
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              {activeTab === 'tools' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Tools</h3>
                    <div className="space-y-3">
                      <button
                        className="w-full py-3 bg-blue-600 rounded hover:bg-blue-700 transition-colors flex items-center justify-center focus:outline-none"
                        onClick={() => setShowPhotopea(true)}
                      >
                        <Edit3 className="w-5 h-5 mr-3" />
                        Advanced Editor
                      </button>
                      <button
                        className="w-full py-3 bg-blue-600 rounded hover:bg-blue-700 transition-colors flex items-center justify-center focus:outline-none"
                        onClick={() => alert('Crop tool selected')}
                      >
                        <Crop className="w-5 h-5 mr-3" />
                        Crop
                      </button>
                      <button
                        className="w-full py-3 bg-blue-600 rounded hover:bg-blue-700 transition-colors flex items-center justify-center focus:outline-none"
                        onClick={() => alert('Rotate tool selected')}
                      >
                        <RotateCw className="w-5 h-5 mr-3" />
                        Rotate
                      </button>
                      <button
                        className="w-full py-3 bg-blue-600 rounded hover:bg-blue-700 transition-colors flex items-center justify-center focus:outline-none"
                        onClick={() => alert('Add Text tool selected')}
                      >
                        <Type className="w-5 h-5 mr-3" />
                        Add Text
                      </button>
                      <button
                        className="w-full py-3 bg-blue-600 rounded hover:bg-blue-700 transition-colors flex items-center justify-center focus:outline-none"
                        onClick={() => alert('Brush tool selected')}
                      >
                        <Brush className="w-5 h-5 mr-3" />
                        Brush
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Color Grading</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Exposure</label>
                        <input
                          type="range"
                          className="w-full accent-blue-600"
                          min="-1"
                          max="1"
                          step="0.01"
                          value={exposure}
                          onChange={(e) => setExposure(parseFloat(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Contrast</label>
                        <input
                          type="range"
                          className="w-full accent-blue-600"
                          min="0"
                          max="3"
                          step="0.01"
                          value={contrast}
                          onChange={(e) => setContrast(parseFloat(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Saturation</label>
                        <input
                          type="range"
                          className="w-full accent-blue-600"
                          min="0"
                          max="3"
                          step="0.01"
                          value={saturation}
                          onChange={(e) => setSaturation(parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'ai' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-3">AI Features</h3>
                  <div className="space-y-3">
                    <button
                      className="w-full py-3 bg-blue-600 rounded hover:bg-blue-700 transition-colors focus:outline-none"
                      onClick={() => alert('Background removed (simulated)!')}
                    >
                      Remove Background
                    </button>
                    <button
                      className="w-full py-3 bg-blue-600 rounded hover:bg-blue-700 transition-colors focus:outline-none"
                      onClick={() => alert('Details enhanced (simulated)!')}
                    >
                      Enhance Details
                    </button>
                    <button
                      className="w-full py-3 bg-blue-600 rounded hover:bg-blue-700 transition-colors focus:outline-none"
                      onClick={() => alert('Style transferred (simulated)!')}
                    >
                      Style Transfer
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">ControlNets</h3>
                  <div className="space-y-3">
                    <button
                      className="w-full py-3 bg-green-600 rounded hover:bg-green-700 transition-colors focus:outline-none"
                      onClick={handleAddControlNet}
                    >
                      Add ControlNet
                    </button>
                    {/* List of ControlNets */}
                    {controlNets.map((name, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-800 p-3 rounded"
                      >
                        <span>{name}</span>
                        <button
                          onClick={() =>
                            setControlNets(controlNets.filter((_, i) => i !== index))
                          }
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">LoRA Fine-tuning</h3>
                  <div className="space-y-3">
                    <button
                      className="w-full py-3 bg-purple-600 rounded hover:bg-purple-700 transition-colors focus:outline-none"
                      onClick={handleFineTuneLoRA}
                    >
                      Fine-tune LoRA
                    </button>
                    {/* List of LoRAs */}
                    {loRAs.map((name, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-800 p-3 rounded"
                      >
                        <span>{name}</span>
                        <button
                          onClick={() => setLoRAs(loRAs.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Sidebar>

          {/* Main editing area */}
          <div className="flex-1 m-4 bg-black bg-opacity-40 backdrop-blur-lg rounded-xl shadow-2xl flex items-center justify-center relative">
            {showNodeWorkflow ? (
              <NodeWorkflow />
            ) : showPhotopea ? (
              <PhotopeaEditor
                onClose={() => setShowPhotopea(false)}
                image={uploadedImage}
                onSave={(dataURL) => {
                  setUploadedImage(dataURL);
                  setShowPhotopea(false);
                }}
              />
            ) : uploadedImage ? (
              <canvas ref={canvasRef} className="max-w-full max-h-full rounded-lg" />
            ) : (
              <button
                onClick={handleOpen}
                className="flex flex-col items-center text-white opacity-50 hover:opacity-100 transition-opacity focus:outline-none"
              >
                <LucideImage className="w-32 h-32" />
                <span>Click to Upload</span>
              </button>
            )}
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    if (event.target?.result) {
                      setUploadedImage(event.target.result as string);
                    }
                  };
                  reader.readAsDataURL(e.target.files[0]);
                }
              }}
            />
          </div>

          {/* Right sidebar - Layers */}
          <Sidebar isLeft={false}>
            <h2 className="text-xl font-bold p-5 border-b border-white border-opacity-10">Layers</h2>
            <div className="space-y-4 p-5">
              <div className="flex items-center space-x-3">
                <Layers className="w-5 h-5" />
                <span>Background</span>
              </div>
              {/* Additional layers */}
              <div className="flex items-center space-x-3">
                <Layers className="w-5 h-5" />
                <span>Adjustments</span>
              </div>
              {controlNets.map((name, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Layers className="w-5 h-5" />
                  <span>{name}</span>
                </div>
              ))}
              {loRAs.map((name, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Layers className="w-5 h-5" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </Sidebar>
        </div>

        {/* Bottom bar - Timeline and Node Workflow */}
        <div className="h-16 flex items-center justify-between px-6 border-t border-white border-opacity-10">
          <div className="flex-1 h-2 bg-white bg-opacity-20 rounded-full mx-4">
            <div className="w-1/3 h-full bg-blue-500 rounded-full"></div>
          </div>
          <button
            onClick={() => setShowNodeWorkflow(!showNodeWorkflow)}
            className="px-5 py-3 bg-blue-600 rounded hover:bg-blue-700 transition-colors focus:outline-none"
          >
            {showNodeWorkflow ? 'Hide' : 'Show'} Node Workflow
          </button>
        </div>
      </GlassmorphicPanel>
      <SettingsModal isOpen={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
    </div>
  );
};

export default AIPhotoEditor;
