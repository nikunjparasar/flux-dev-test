// src/components/AIPhotoEditor.tsx
import React, { useState, useEffect } from 'react';
import {
  Layers,
  Image as LucideImage,
  Sliders,
  Share,
  Save,
  Folder,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import NodeWorkflow from './NodeWorkflow';

interface GlassmorphicPanelProps {
  children: React.ReactNode;
  className?: string;
}

const GlassmorphicPanel: React.FC<GlassmorphicPanelProps> = ({ children, className = '' }) => (
  <div className={`bg-white bg-opacity-5 backdrop-blur-lg rounded-lg shadow-lg ${className}`}>
    {children}
  </div>
);

interface IconButtonProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-2 text-white hover:bg-white hover:bg-opacity-10 rounded transition-colors"
  >
    <Icon className="w-5 h-5" />
    <span className="text-xs mt-1">{label}</span>
  </button>
);

interface SidebarProps {
  children: React.ReactNode;
  isLeft?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ children, isLeft = true }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className={`h-full flex ${isLeft ? 'mr-2' : 'ml-2'}`}>
      <GlassmorphicPanel
        className={`h-full ${isOpen ? 'w-64' : 'w-0'} overflow-hidden transition-all duration-300 flex flex-col`}
      >
        {children}
      </GlassmorphicPanel>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white bg-opacity-5 hover:bg-opacity-10 text-white p-2 self-center rounded-full shadow"
      >
        {isOpen
          ? isLeft
            ? <ChevronLeft />
            : <ChevronRight />
          : isLeft
            ? <ChevronRight />
            : <ChevronLeft />
        }
      </button>
    </div>
  );
};


const AIPhotoEditor: React.FC = () => {
  const [showNodeWorkflow, setShowNodeWorkflow] = useState(false);
  const [activeTab, setActiveTab] = useState<'tools' | 'ai'>('tools');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-800 via-black to-gray-900 text-white overflow-hidden flex flex-col p-4">
      <GlassmorphicPanel className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white border-opacity-10">
          <div className="flex space-x-2">
            <IconButton icon={Folder} label="Open" onClick={() => { /* Handle Open */ }} />
            <IconButton icon={Save} label="Save" onClick={() => { /* Handle Save */ }} />
            <IconButton icon={Share} label="Share" onClick={() => { /* Handle Share */ }} />
          </div>
          <div className="flex space-x-2">
            <IconButton icon={Settings} label="Settings" onClick={() => { /* Handle Settings */ }} />
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left sidebar */}
          <Sidebar>
            <div className="flex border-b border-white border-opacity-10">
              <button
                className={`flex-1 p-2 ${activeTab === 'tools' ? 'bg-white bg-opacity-10' : ''}`}
                onClick={() => setActiveTab('tools')}
              >
                Tools
              </button>
              <button
                className={`flex-1 p-2 ${activeTab === 'ai' ? 'bg-white bg-opacity-10' : ''}`}
                onClick={() => setActiveTab('ai')}
              >
                AI
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              {activeTab === 'tools' && (
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tools</h3>
                    <div className="space-y-2">
                      <IconButton icon={Sliders} label="AI Enhance" onClick={() => { /* Handle AI Enhance */ }} />
                      <IconButton icon={Sliders} label="Adjust" onClick={() => { /* Handle Adjust */ }} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Color Grading</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-1">Exposure</label>
                        <input type="range" className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Contrast</label>
                        <input type="range" className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Saturation</label>
                        <input type="range" className="w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'ai' && (
                <div className="p-4 space-y-4">
                  <h3 className="text-lg font-semibold mb-2">AI Features</h3>
                  <div className="space-y-2">
                    <button className="w-full py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors">
                      Remove Background
                    </button>
                    <button className="w-full py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors">
                      Enhance Details
                    </button>
                    <button className="w-full py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors">
                      Style Transfer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Sidebar>

          {/* Main editing area */}
          <div className="flex-1 m-2 bg-black bg-opacity-30 backdrop-blur-sm rounded-lg shadow-2xl flex items-center justify-center relative">
            {showNodeWorkflow ? (
              <NodeWorkflow />
            ) : uploadedImage ? (
              <img src={uploadedImage} alt="Uploaded" className="max-w-full max-h-full rounded-lg" />
            ) : (
              <button
                onClick={() => document.getElementById('imageUpload')?.click()}
                className="flex flex-col items-center text-white opacity-50 hover:opacity-100 transition-opacity"
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
            <h2 className="text-xl font-bold p-4 border-b border-white border-opacity-10">Layers</h2>
            <div className="space-y-2 p-4">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4" />
                <span>Background</span>
              </div>
              {/* Add more layers here */}
            </div>
          </Sidebar>
        </div>

        {/* Bottom bar - Timeline and Node Workflow */}
        <div className="h-16 flex items-center justify-between px-4 border-t border-white border-opacity-10">
          <div className="flex-1 h-2 bg-white bg-opacity-20 rounded-full mx-4">
            <div className="w-1/3 h-full bg-blue-500 rounded-full"></div>
          </div>
          <button
            onClick={() => setShowNodeWorkflow(!showNodeWorkflow)}
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            {showNodeWorkflow ? 'Hide' : 'Show'} Node Workflow
          </button>
        </div>
      </GlassmorphicPanel>
    </div>
  );
};

export default AIPhotoEditor;
