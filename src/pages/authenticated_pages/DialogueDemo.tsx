import React, { useState } from 'react';
import { MessageSquare, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import DialogueList from '../../components/DialogueList';
import { Dialogue } from '../../types/dialogue';

// Sample data for demo
const sampleCharacters = [
  {
    character_id: 'char-1',
    name: 'Rahul',
    traits: { species: 'Human', profession: 'Student' }
  },
  {
    character_id: 'char-2',
    name: 'Priya',
    traits: { species: 'Human', profession: 'Teacher' }
  },
  {
    character_id: 'char-3',
    name: 'Vikram',
    traits: { species: 'Human', profession: 'Shopkeeper' }
  }
];

const sampleDialogues: Dialogue[] = [
  {
    dialogue_id: 'dial-1',
    scene_id: 'scene-demo',
    character_id: 'char-1',
    content: "Good morning, Priya ma'am! How are you today?",
    delivery_type: 'speech_bubble',
    sequence: 1,
    sentiment_score: 0.8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    dialogue_id: 'dial-2',
    scene_id: 'scene-demo',
    character_id: 'char-2',
    content: "Good morning, Rahul! I'm doing well, thank you for asking. How about you?",
    delivery_type: 'speech_bubble',
    sequence: 2,
    sentiment_score: 0.9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    dialogue_id: 'dial-3',
    scene_id: 'scene-demo',
    character_id: undefined,
    content: "The classroom buzzed with the energy of young minds eager to learn.",
    delivery_type: 'narration',
    sequence: 3,
    sentiment_score: 0.6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    dialogue_id: 'dial-4',
    scene_id: 'scene-demo',
    character_id: 'char-1',
    content: "I hope I can do well in today's test...",
    delivery_type: 'thought',
    sequence: 4,
    sentiment_score: -0.2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    dialogue_id: 'dial-5',
    scene_id: 'scene-demo',
    character_id: 'char-3',
    content: "🎵 Chai garam chai garam, piyo aur fresh ho jao! 🎵",
    delivery_type: 'song',
    sequence: 5,
    sentiment_score: 0.7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const DialogueDemo: React.FC = () => {
  const [dialogues, setDialogues] = useState<Dialogue[]>(sampleDialogues);
  const [isEditable, setIsEditable] = useState(true);

  const handleAddDialogue = (dialogueData: Omit<Dialogue, 'dialogue_id' | 'created_at' | 'updated_at'>) => {
    const newDialogue: Dialogue = {
      ...dialogueData,
      dialogue_id: `dial-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setDialogues(prev => [...prev, newDialogue]);
  };

  const handleUpdateDialogue = (updatedDialogue: Dialogue) => {
    setDialogues(prev => prev.map(d => 
      d.dialogue_id === updatedDialogue.dialogue_id ? updatedDialogue : d
    ));
  };

  const handleDeleteDialogue = (dialogueId: string) => {
    setDialogues(prev => prev.filter(d => d.dialogue_id !== dialogueId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dialogue System Demo
              </h1>
              <p className="text-gray-300 mt-2">
                Experience the power of our storytelling dialogue system
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsEditable(!isEditable)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isEditable 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isEditable ? 'Edit Mode' : 'View Mode'}
            </button>
          </div>
        </div>

        {/* Demo Description */}
        <div className="bg-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-4">
            <MessageSquare className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-semibold">About This Demo</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Features Demonstrated</h3>
              <ul className="space-y-2">
                <li>• Multiple dialogue types (Speech, Narration, Thoughts, Songs)</li>
                <li>• Character assignment and management</li>
                <li>• Sequence ordering and management</li>
                <li>• Sentiment analysis integration</li>
                <li>• Real-time editing and filtering</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Sample Scene</h3>
              <p className="text-sm">
                This demo shows a classroom scene with Rahul (student), Priya (teacher), 
                and Vikram (shopkeeper). It demonstrates how different types of dialogue 
                can be used to create rich, engaging storytelling experiences.
              </p>
            </div>
          </div>
        </div>

        {/* Dialogue System */}
        <div className="bg-white/5 rounded-2xl p-8 backdrop-blur-sm">
          <DialogueList
            sceneId="scene-demo"
            dialogues={dialogues}
            characters={sampleCharacters}
            onAddDialogue={handleAddDialogue}
            onUpdateDialogue={handleUpdateDialogue}
            onDeleteDialogue={handleDeleteDialogue}
            isEditable={isEditable}
          />
        </div>

        {/* Technical Details */}
        <div className="mt-8 bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-white mb-4">Technical Implementation</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-300">
            <div>
              <h4 className="font-medium text-white mb-2">Components</h4>
              <ul className="space-y-1">
                <li>• DialogueComponent</li>
                <li>• DialogueList</li>
                <li>• DialogueForm</li>
                <li>• useDialogues Hook</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Features</h4>
              <ul className="space-y-1">
                <li>• TypeScript interfaces</li>
                <li>• Responsive design</li>
                <li>• Real-time updates</li>
                <li>• Error handling</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Database</h4>
              <ul className="space-y-1">
                <li>• Supabase integration</li>
                <li>• CRUD operations</li>
                <li>• Relationship management</li>
                <li>• Optimistic updates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogueDemo;
