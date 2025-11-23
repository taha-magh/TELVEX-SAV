
import React, { useRef, useState } from 'react';
import { Upload, Shield, Headset, FileText, BarChart3, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { UserRole, EnrichedTweet } from '../types';
import { parseCSV } from '../utils/csv';

interface FileUploadProps {
  onComplete: (role: UserRole, data?: EnrichedTweet[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedData, setParsedData] = useState<EnrichedTweet[] | undefined>(undefined);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);

      const text = await uploadedFile.text();
      const data = parseCSV(text);
      setParsedData(data);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedRole(null);
  };

  const handleSubmit = () => {
    if (!selectedRole) return;
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onComplete(selectedRole, parsedData);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-free-red rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-card-bg p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-2xl w-full z-10 transition-all duration-500">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-white tracking-tight">Telvex</h1>
            <div className="bg-free-red text-white font-bold px-3 py-1 rounded-lg text-2xl shadow-lg shadow-red-900/20">SAV</div>
          </div>
          <p className="text-slate-400">Plateforme d'analyse IA des tweets</p>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className={`h-2 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-free-red' : 'w-2 bg-slate-600'}`}></div>
            <div className={`h-2 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-free-red' : 'w-2 bg-slate-600'}`}></div>
          </div>
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">Qui êtes-vous ?</h2>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleRoleSelect('agent')}
                className="group relative w-full p-4 rounded-xl border bg-slate-800 border-slate-700 text-slate-400 hover:bg-blue-900/20 hover:border-blue-500 hover:text-white transition-all duration-200 flex items-center gap-4"
              >
                <div className="p-3 bg-slate-700 group-hover:bg-blue-500/20 rounded-lg transition-colors">
                  <Headset size={24} className="group-hover:text-blue-400" />
                </div>
                <div className="text-left flex-1">
                  <span className="font-bold block text-lg">Agent SAV</span>
                  <span className="text-sm opacity-70">Traitement unitaire & Réponses</span>
                </div>
                <ArrowLeft className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
              </button>

              <button
                onClick={() => handleRoleSelect('supervisor')}
                className="group relative w-full p-4 rounded-xl border bg-slate-800 border-slate-700 text-slate-400 hover:bg-red-900/20 hover:border-free-red hover:text-white transition-all duration-200 flex items-center gap-4"
              >
                <div className="p-3 bg-slate-700 group-hover:bg-red-500/20 rounded-lg transition-colors">
                  <Shield size={24} className="group-hover:text-free-red" />
                </div>
                <div className="text-left flex-1">
                  <span className="font-bold block text-lg">Superviseur</span>
                  <span className="text-sm opacity-70">Monitoring & Alertes</span>
                </div>
                <ArrowLeft className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity text-free-red" />
              </button>

              <button
                onClick={() => handleRoleSelect('analyst')}
                className="group relative w-full p-4 rounded-xl border bg-slate-800 border-slate-700 text-slate-400 hover:bg-purple-900/20 hover:border-purple-500 hover:text-white transition-all duration-200 flex items-center gap-4"
              >
                <div className="p-3 bg-slate-700 group-hover:bg-purple-500/20 rounded-lg transition-colors">
                  <BarChart3 size={24} className="group-hover:text-purple-400" />
                </div>
                <div className="text-left flex-1">
                  <span className="font-bold block text-lg">Analyste</span>
                  <span className="text-sm opacity-70">Exploration & Rapports IA</span>
                </div>
                <ArrowLeft className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <button onClick={handleBack} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
                <ArrowLeft size={16} /> Changer de profil
              </button>
              <span className="bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-300 uppercase tracking-wider border border-slate-700">
                {selectedRole === 'agent' ? 'Agent' : selectedRole === 'supervisor' ? 'Superviseur' : 'Analyste'}
              </span>
            </div>

            <h2 className="text-xl font-semibold text-white mb-6 text-center">Importez vos données</h2>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`h-48 border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${file ? 'border-green-500 bg-green-900/10' : 'border-slate-600 hover:border-slate-400 hover:bg-slate-800'}`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden"
              />
              {file ? (
                <div className="text-center">
                  <div className="bg-green-500/20 p-3 rounded-full w-fit mx-auto mb-3">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <span className="text-green-400 font-medium block truncate max-w-[250px] mx-auto">{file.name}</span>
                  <span className="text-slate-400 text-sm mt-1 block">{parsedData?.length || 0} tweets analysés</span>
                  <span className="text-slate-500 text-xs mt-4 block hover:text-white hover:underline">Cliquez pour changer de fichier</span>
                </div>
              ) : (
                <div className="text-center group">
                  <div className="bg-slate-700 p-4 rounded-full w-fit mx-auto mb-4 group-hover:bg-slate-600 transition-colors">
                    <Upload className="w-8 h-8 text-slate-300" />
                  </div>
                  <span className="text-slate-200 font-medium block">Glissez votre fichier CSV ici</span>
                  <span className="text-slate-500 text-sm mt-1 block">ou cliquez pour parcourir</span>
                </div>
              )}
            </div>

            <div className="mt-8 space-y-3">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${isLoading
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-free-red hover:bg-free-red-dark text-white shadow-red-900/20 hover:shadow-red-900/40 transform hover:-translate-y-0.5'
                  }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Chargement...
                  </>
                ) : (
                  "Lancer le Dashboard"
                )}
              </button>

              {!file && (
                <p className="text-xs text-slate-500 text-center italic">
                  Aucun fichier sélectionné ? Les données de démonstration seront utilisées.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
