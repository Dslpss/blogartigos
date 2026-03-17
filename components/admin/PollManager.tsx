'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  X, 
  BarChart3, 
  Download, 
  Eye,
  Settings2,
  ToggleLeft as Toggle,
  ToggleRight as ToggleActive
} from 'lucide-react';
import { 
  getPolls, 
  addPoll, 
  updatePoll, 
  deletePoll, 
  getPollSubmissions, 
  Poll, 
  PollField 
} from '@/lib/db';

const PollManager = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
  const [viewingSubmissions, setViewingSubmissions] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const [formData, setFormData] = useState<Omit<Poll, 'id' | 'createdAt' | 'submissionsCount'>>({
    title: '',
    description: '',
    fields: [
      { label: 'Nome', type: 'text', required: true },
      { label: 'E-mail', type: 'email', required: true }
    ],
    isActive: false,
    showCounter: true,
    cardColor: '#080808',
    fontColor: '#ffffff',
    options: ['A Favor', 'Contra']
  });

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const data = await getPolls();
      setPolls(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = () => {
    setFormData({
      ...formData,
      fields: [...formData.fields, { label: '', type: 'text', required: false }]
    });
  };

  const handleRemoveField = (index: number) => {
    const newFields = [...formData.fields];
    newFields.splice(index, 1);
    setFormData({ ...formData, fields: newFields });
  };

  const handleFieldChange = (index: number, key: keyof PollField, value: any) => {
    const newFields = [...formData.fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFormData({ ...formData, fields: newFields });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingPoll?.id) {
        await updatePoll(editingPoll.id, formData);
        alert('Enquete atualizada!');
      } else {
        await addPoll(formData);
        alert('Enquete criada!');
      }
      setIsAdding(false);
      setEditingPoll(null);
      fetchPolls();
    } catch (err) {
      alert('Erro ao salvar enquete.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (poll: Poll) => {
    setEditingPoll(poll);
    setFormData({
      title: poll.title,
      description: poll.description || '',
      fields: poll.fields,
      isActive: poll.isActive,
      showCounter: poll.showCounter,
      cardColor: poll.cardColor || '#080808',
      fontColor: poll.fontColor || '#ffffff',
      options: poll.options || ['A Favor', 'Contra']
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Excluir enquete "${title}" e todas as suas assinaturas?`)) {
      setLoading(true);
      try {
        await deletePoll(id);
        alert('Enquete e assinaturas excluídas com sucesso!');
        fetchPolls();
      } catch (err) {
        console.error('Error deleting poll:', err);
        alert('Erro ao excluir enquete. Verifique as permissões.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleActive = async (poll: Poll) => {
    try {
      // If we are activating this one, we should deactivate others
      if (!poll.isActive) {
        const activeOne = polls.find(p => p.isActive);
        if (activeOne?.id) {
          await updatePoll(activeOne.id, { isActive: false });
        }
      }
      await updatePoll(poll.id!, { isActive: !poll.isActive });
      fetchPolls();
    } catch (err) {
      alert('Erro ao alterar status.');
    }
  };

  const handleAddOption = () => {
    if (formData.options.length >= 6) return;
    setFormData({
      ...formData,
      options: [...formData.options, `Opção ${formData.options.length + 1}`]
    });
  };

  const handleRemoveOption = (index: number) => {
    if (formData.options.length <= 2) return;
    const newOptions = [...formData.options];
    newOptions.splice(index, 1);
    setFormData({ ...formData, options: newOptions });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleViewSubmissions = async (pollId: string) => {
    setViewingSubmissions(pollId);
    setLoading(true);
    try {
      const data = await getPollSubmissions(pollId);
      setSubmissions(data);
    } catch (err) {
      alert('Erro ao carregar submissões.');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (pollId: string) => {
    const poll = polls.find(p => p.id === pollId);
    if (!poll || submissions.length === 0) return;

    // Headers and Rows
    const headers = ['Posição', ...poll.fields.map(f => f.label)].join(';');
    const rows = submissions.map(sub => {
      const fieldValues = poll.fields.map(f => sub.data[f.label] || '');
      return [sub.selection || '', ...fieldValues].join(';');
    }).join('\n');

    const csvData = headers + '\n' + rows;
    
    // Add UTF-8 BOM (Byte Order Mark) so Excel recognizes special characters (ã, ç, etc)
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.hash = '#';
    link.href = url;
    link.setAttribute("download", `submissoes_${poll.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading && polls.length === 0) return <div className="p-10 text-center animate-pulse text-secondary uppercase font-black tracking-widest text-xs">Carregando Enquetes...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Gestão de Enquetes ({polls.length})</h3>
        <button 
          onClick={() => {
            setEditingPoll(null);
            setFormData({
              title: '',
              description: '',
              fields: [
                { label: 'Nome', type: 'text', required: true },
                { label: 'E-mail', type: 'email', required: true }
              ],
              isActive: false,
              showCounter: true,
              cardColor: '#080808',
              fontColor: '#ffffff',
              options: ['A Favor', 'Contra']
            });
            setIsAdding(true);
          }} 
          className="btn-premium px-6 py-3 flex items-center gap-2"
        >
          <Plus size={16} /> Nova Enquete
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {polls.map(poll => (
          <div key={poll.id} className="glass-panel p-6 bg-white flex flex-col md:flex-row md:items-center justify-between group border-primary/5 hover:border-accent/20 transition-all text-primary gap-6">
            <div className="flex items-center gap-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${poll.isActive ? 'bg-accent shadow-lg shadow-accent/20' : 'bg-secondary/20 text-secondary'}`}>
                <BarChart3 size={24} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="text-sm font-black uppercase tracking-tight">{poll.title}</h4>
                  {poll.isActive && (
                    <span className="bg-accent/10 text-accent text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-accent/20">Ativa na Home</span>
                  )}
                </div>
                <p className="text-[9px] opacity-50 uppercase mt-1">
                  {poll.fields.length} campos • {poll.submissionsCount || 0} assinaturas • Criada em {poll.createdAt.toDate().toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t md:border-none pt-4 md:pt-0 justify-between md:justify-end">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleToggleActive(poll)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${poll.isActive ? 'bg-accent text-white' : 'bg-secondary/5 text-secondary hover:bg-secondary/10'}`}
                >
                  {poll.isActive ? <ToggleActive size={14} /> : <Toggle size={14} />} 
                  {poll.isActive ? 'Desativar' : 'Ativar na Home'}
                </button>
                <button onClick={() => handleViewSubmissions(poll.id!)} className="p-2 hover:bg-accent/5 text-secondary hover:text-accent rounded-lg transition-colors"><Eye size={18} /></button>
                <button onClick={() => handleEdit(poll)} className="p-2 hover:bg-accent/5 text-secondary hover:text-accent rounded-lg transition-colors"><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(poll.id!, poll.title)} className="p-2 hover:bg-red-50 text-secondary hover:text-red-500 rounded-lg transition-colors"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Adding/Editing Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[60] bg-white flex items-center justify-center p-0 md:p-4">
          <div className="w-full h-full md:h-auto md:max-w-4xl md:max-h-[90vh] overflow-y-auto space-y-8 p-6 md:p-10 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b pb-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white">
                  <Settings2 size={20} />
                </div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-primary">
                  {editingPoll ? 'Editar Enquete' : 'Criar Nova Enquete'}
                </h2>
              </div>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-secondary/5 rounded-full"><X size={24} className="text-primary" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 text-primary">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-4">Título do Formulário</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ex: FORA LULA!"
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    className="w-full bg-white border border-border rounded-xl p-4 outline-none focus:border-accent font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-4">Descrição do Card (Propósito)</label>
                  <textarea 
                    placeholder="Descreva o propósito desta enquete/consulta pública..."
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    rows={3}
                    className="w-full bg-white border border-border rounded-xl p-4 outline-none focus:border-accent font-medium text-sm resize-none" 
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-4 block mb-2">Configurações de Exibição</label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, showCounter: !formData.showCounter})}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.showCounter ? 'bg-accent/5 border-accent text-accent' : 'border-border text-secondary'}`}
                    >
                      <BarChart3 size={14} /> {formData.showCounter ? 'Contador Ativo' : 'Contador Oculto'}
                    </button>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3 px-4 py-2 bg-secondary/5 rounded-xl border border-border">
                        <input 
                          type="color" 
                          value={formData.cardColor || '#080808'} 
                          onChange={e => setFormData({...formData, cardColor: e.target.value})}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                        />
                        <span className="text-[9px] font-black uppercase tracking-widest text-secondary">Cor Fundo</span>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-2 bg-secondary/5 rounded-xl border border-border">
                        <input 
                          type="color" 
                          value={formData.fontColor || '#ffffff'} 
                          onChange={e => setFormData({...formData, fontColor: e.target.value})}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                        />
                        <span className="text-[9px] font-black uppercase tracking-widest text-secondary">Cor Fonte</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-4">Opções de Voto (O que o usuário escolhe)</label>
                  <button 
                    type="button" 
                    onClick={handleAddOption}
                    disabled={formData.options.length >= 6}
                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-accent hover:underline disabled:opacity-30 disabled:no-underline"
                  >
                    <Plus size={14} /> Adicionar Opção
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex gap-2 items-center p-3 bg-secondary/5 rounded-xl border border-transparent hover:border-accent/10 transition-all">
                      <div className="w-6 h-6 flex items-center justify-center bg-accent/10 text-accent rounded-lg text-[10px] font-black">
                        {index + 1}
                      </div>
                      <input 
                        type="text" 
                        placeholder={`Ex: ${index === 0 ? 'A Favor' : index === 1 ? 'Contra' : 'Outro'}`}
                        value={option}
                        onChange={e => handleOptionChange(index, e.target.value)}
                        className="flex-1 bg-transparent text-xs font-bold outline-none"
                      />
                      {formData.options.length > 2 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveOption(index)}
                          className="p-1.5 text-secondary hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[8px] text-secondary/60 uppercase font-bold text-center">Defina de 2 a 6 opções para esta enquete</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-4">Campos do Formulário</label>
                  <button 
                    type="button" 
                    onClick={handleAddField}
                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-accent hover:underline"
                  >
                    <Plus size={14} /> Adicionar Campo
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.fields.map((field, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-3 p-4 bg-secondary/5 rounded-2xl border border-transparent hover:border-accent/10 transition-all items-center">
                      <div className="flex-1 w-full md:w-auto">
                        <input 
                          type="text" 
                          placeholder="Nome do Campo (ex: Cidade)"
                          value={field.label}
                          onChange={e => handleFieldChange(index, 'label', e.target.value)}
                          className="w-full bg-white border border-border rounded-lg p-2 text-xs outline-none focus:border-accent"
                        />
                      </div>
                      <div className="w-full md:w-40">
                        <select 
                          value={field.type}
                          onChange={e => handleFieldChange(index, 'type', e.target.value)}
                          className="w-full bg-white border border-border rounded-lg p-2 text-xs"
                        >
                          <option value="text">Texto Curto</option>
                          <option value="email">E-mail</option>
                          <option value="tel">Telefone</option>
                          <option value="city">Cidade</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-4 px-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={field.required}
                            onChange={e => handleFieldChange(index, 'required', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                          />
                          <span className="text-[9px] font-black uppercase text-secondary">Obrigatório</span>
                        </label>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveField(index)}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-premium w-full py-5 text-sm tracking-[0.2em] uppercase shadow-xl shadow-accent/20">
                {loading ? 'Salvando...' : (editingPoll ? 'Atualizar Configurações' : 'Publicar Enquete')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Submissions Modal */}
      {viewingSubmissions && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto space-y-6 p-6 md:p-10 bg-white rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between border-b pb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-primary">Submissões Recebidas</h2>
                <p className="text-[10px] text-secondary uppercase font-bold tracking-widest mt-1">Total: {submissions.length} registros</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => exportToCSV(viewingSubmissions)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                >
                  <Download size={14} /> Exportar CSV
                </button>
                <button onClick={() => setViewingSubmissions(null)} className="p-2 hover:bg-secondary/5 rounded-full transition-colors"><X size={24} className="text-primary" /></button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-secondary">Data/Hora</th>
                    {polls.find(p => p.id === viewingSubmissions)?.fields.map((f, i) => (
                      <th key={i} className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-secondary">{f.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, i) => (
                    <tr key={i} className="border-b border-secondary/5 hover:bg-secondary/[0.02] transition-colors font-mono">
                      <td className="py-3 px-4 text-[10px] text-primary">{sub.submittedAt.toDate().toLocaleString('pt-BR')}</td>
                      {polls.find(p => p.id === viewingSubmissions)?.fields.map((f, fi) => (
                        <td key={fi} className="py-3 px-4 text-[10px] text-primary">{sub.data[f.label] || '-'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {submissions.length === 0 && !loading && (
                <div className="py-20 text-center text-secondary uppercase font-black tracking-widest text-[10px] opacity-30">Nenhum registro encontrado</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PollManager;
