import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, X } from 'lucide-react';
import { Region } from '../types';

interface RegionFormProps {
  region?: Region | null;
  onSubmit: (region: any) => void;
  onCancel: () => void;
}

const regionTypes = ['Continent', 'Country', 'City', 'Village', 'Realm', 'Planet', 'Dimension'];

const RegionForm: React.FC<RegionFormProps> = ({ region, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: region?.name || '',
    world_id: region?.world_id || '',
    type: region?.type || '',
    description: region?.description || '',
    culture: region?.culture || '',
    politics: region?.politics || '',
    religion: region?.religion || '',
    climate: region?.climate || '',
    history: region?.history || '',
    map_reference: region?.map_reference || '',
    language: region?.language || [],
    notable_inhabitants: region?.notable_inhabitants || [],
    important_events: region?.important_events || [],
    resources: region?.resources || [],
    created_by: 'user-id'
  });

  const [newLanguage, setNewLanguage] = useState('');
  const [newInhabitant, setNewInhabitant] = useState('');
  const [newEvent, setNewEvent] = useState('');
  const [newResource, setNewResource] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.language.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        language: [...prev.language, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      language: prev.language.filter(l => l !== language)
    }));
  };

  const addInhabitant = () => {
    if (newInhabitant.trim() && !formData.notable_inhabitants.includes(newInhabitant.trim())) {
      setFormData(prev => ({
        ...prev,
        notable_inhabitants: [...prev.notable_inhabitants, newInhabitant.trim()]
      }));
      setNewInhabitant('');
    }
  };

  const removeInhabitant = (inhabitant: string) => {
    setFormData(prev => ({
      ...prev,
      notable_inhabitants: prev.notable_inhabitants.filter(i => i !== inhabitant)
    }));
  };

  const addEvent = () => {
    if (newEvent.trim() && !formData.important_events.includes(newEvent.trim())) {
      setFormData(prev => ({
        ...prev,
        important_events: [...prev.important_events, newEvent.trim()]
      }));
      setNewEvent('');
    }
  };

  const removeEvent = (event: string) => {
    setFormData(prev => ({
      ...prev,
      important_events: prev.important_events.filter(e => e !== event)
    }));
  };

  const addResource = () => {
    if (newResource.trim() && !formData.resources.includes(newResource.trim())) {
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, newResource.trim()]
      }));
      setNewResource('');
    }
  };

  const removeResource = (resource: string) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter(r => r !== resource)
    }));
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-subheading gradient-text-cosmic flex items-center gap-2">
          <MapPin size={20} />
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-body font-medium mb-2">Region Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter region name"
              required
            />
          </div>
          
          <div>
            <label className="block text-body font-medium mb-2">Region Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-3 glass-card rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select type</option>
              {regionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-body font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe this region..."
            rows={3}
          />
        </div>
      </div>

      {/* Cultural Information */}
      <div className="space-y-4">
        <h3 className="text-subheading gradient-text-green">Cultural Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-body font-medium mb-2">Culture</label>
            <textarea
              value={formData.culture}
              onChange={(e) => setFormData(prev => ({ ...prev, culture: e.target.value }))}
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the culture..."
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-body font-medium mb-2">Politics</label>
            <textarea
              value={formData.politics}
              onChange={(e) => setFormData(prev => ({ ...prev, politics: e.target.value }))}
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the political system..."
              rows={3}
            />
          </div>
        </div>

        <div>
          <label className="block text-body font-medium mb-2">Religion</label>
          <textarea
            value={formData.religion}
            onChange={(e) => setFormData(prev => ({ ...prev, religion: e.target.value }))}
            className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe religious beliefs..."
            rows={2}
          />
        </div>
      </div>

      {/* Physical Information */}
      <div className="space-y-4">
        <h3 className="text-subheading gradient-text-blue">Physical Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-body font-medium mb-2">Climate</label>
            <input
              type="text"
              value={formData.climate}
              onChange={(e) => setFormData(prev => ({ ...prev, climate: e.target.value }))}
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the climate..."
            />
          </div>
          
          <div>
            <label className="block text-body font-medium mb-2">Map Reference</label>
            <input
              type="text"
              value={formData.map_reference}
              onChange={(e) => setFormData(prev => ({ ...prev, map_reference: e.target.value }))}
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Coordinates or location reference..."
            />
          </div>
        </div>

        <div>
          <label className="block text-body font-medium mb-2">History</label>
          <textarea
            value={formData.history}
            onChange={(e) => setFormData(prev => ({ ...prev, history: e.target.value }))}
            className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the region's history..."
            rows={3}
          />
        </div>
      </div>

      {/* Languages */}
      <div className="space-y-4">
        <h3 className="text-subheading gradient-text-purple">Languages</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              className="flex-1 px-4 py-2 glass-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a language..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
            />
            <button
              type="button"
              onClick={addLanguage}
              className="px-4 py-2 glass-card-cosmic rounded-lg text-white hover:soft-glow-cosmic smooth-transition"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.language.map((lang, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 glass-card rounded-full text-sm"
              >
                {lang}
                <button
                  type="button"
                  onClick={() => removeLanguage(lang)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Notable Inhabitants */}
      <div className="space-y-4">
        <h3 className="text-subheading gradient-text-orange">Notable Inhabitants</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newInhabitant}
              onChange={(e) => setNewInhabitant(e.target.value)}
              className="flex-1 px-4 py-2 glass-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a notable inhabitant..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInhabitant())}
            />
            <button
              type="button"
              onClick={addInhabitant}
              className="px-4 py-2 glass-card-cosmic rounded-lg text-white hover:soft-glow-cosmic smooth-transition"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.notable_inhabitants.map((inhabitant, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 glass-card rounded-full text-sm"
              >
                {inhabitant}
                <button
                  type="button"
                  onClick={() => removeInhabitant(inhabitant)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Important Events */}
      <div className="space-y-4">
        <h3 className="text-subheading gradient-text-red">Important Events</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              className="flex-1 px-4 py-2 glass-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add an important event..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEvent())}
            />
            <button
              type="button"
              onClick={addEvent}
              className="px-4 py-2 glass-card-cosmic rounded-lg text-white hover:soft-glow-cosmic smooth-transition"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.important_events.map((event, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 glass-card rounded-full text-sm"
              >
                {event}
                <button
                  type="button"
                  onClick={() => removeEvent(event)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="space-y-4">
        <h3 className="text-subheading gradient-text-green">Resources</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newResource}
              onChange={(e) => setNewResource(e.target.value)}
              className="flex-1 px-4 py-2 glass-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a resource..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResource())}
            />
            <button
              type="button"
              onClick={addResource}
              className="px-4 py-2 glass-card-cosmic rounded-lg text-white hover:soft-glow-cosmic smooth-transition"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.resources.map((resource, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 glass-card rounded-full text-sm"
              >
                {resource}
                <button
                  type="button"
                  onClick={() => removeResource(resource)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 glass-card text-white rounded-xl hover:soft-glow smooth-transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 glass-card-cosmic text-white rounded-xl font-semibold hover:soft-glow-cosmic smooth-transition"
        >
          {region ? 'Update Region' : 'Create Region'}
        </button>
      </div>
    </motion.form>
  );
};

export default RegionForm;
