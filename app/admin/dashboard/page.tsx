'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AdminGuard } from '@/lib/admin-guard';
import { 
  Settings, 
  FileText, 
  Plus, 
  LogOut, 
  Save, 
  LayoutDashboard,
  BarChart3,
  Globe,
  CheckCircle2,
  Edit2,
  Trash2,
  X,
  Shield,
  Users,
  Palette
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { 
  getBlogSettings, 
  updateBlogSettings, 
  getArticles, 
  BlogPost, 
  addArticle, 
  updateArticle, 
  deleteArticle,
  getTeamMembers,
  addTeamMember,
  removeTeamMember,
  UserRole
} from '@/lib/db';
import { useAuth } from '@/lib/auth-context';
import ThemeCustomizer from '@/components/admin/ThemeCustomizer';
import PollManager from '@/components/admin/PollManager';

const SUPER_ADMIN_EMAIL = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;

const AdminDashboard = () => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState('articles');
  const [blogName, setBlogName] = useState('');
  const [blogDescription, setBlogDescription] = useState('');
  const [blogLogoUrl, setBlogLogoUrl] = useState('');
  const [blogNewsletterUrl, setBlogNewsletterUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [articles, setArticles] = useState<BlogPost[]>([]);
  
  const [teamMembers, setTeamMembers] = useState<UserRole[]>([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState({ uid: '', email: '', role: 'editor' as const });

  const [isAddingArticle, setIsAddingArticle] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [newArticle, setNewArticle] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Estratégia',
    author: 'Dennis Emanuel',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
    slug: '',
    status: 'Transmissão_Ativa',
    source: 'CB_Analytics_Hub',
    region: 'LATAM_BRASIL'
  });

  const handleLogout = () => signOut(auth);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [settings, fetchedArticles, members] = await Promise.all([
          getBlogSettings(),
          getArticles(),
          getTeamMembers()
        ]);
        setBlogName(settings.name);
        setBlogDescription(settings.description || '');
        setBlogLogoUrl(settings.logoUrl || '');
        setBlogNewsletterUrl(settings.newsletterUrl || '');
        setArticles(fetchedArticles);
        setTeamMembers(members);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await updateBlogSettings({ 
        name: blogName, 
        description: blogDescription, 
        logoUrl: blogLogoUrl,
        newsletterUrl: blogNewsletterUrl 
      });
      alert('Configurações salvas!');
    } catch (err) {
      alert('Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = newArticle.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      if (editingArticleId) {
        await updateArticle(editingArticleId, { ...newArticle, slug });
        alert('Artigo atualizado!');
      } else {
        await addArticle({ ...newArticle, slug, date: new Date().toLocaleDateString('pt-BR') });
        alert('Artigo publicado!');
      }

      setArticles(await getArticles());
      handleCancelEdit();
    } catch (err) {
      alert('Erro ao processar artigo.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (article: BlogPost) => {
    setEditingArticleId(article.id || null);
    setNewArticle({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      author: article.author,
      imageUrl: article.imageUrl,
      slug: article.slug,
      status: article.status || 'Transmissão_Ativa',
      source: article.source || 'CB_Analytics_Hub',
      region: article.region || 'LATAM_BRASIL'
    });
    setIsAddingArticle(true);
  };

  const handleCancelEdit = () => {
    setIsAddingArticle(false);
    setEditingArticleId(null);
    setNewArticle({
      title: '',
      excerpt: '',
      content: '',
      category: 'Estratégia',
      author: 'Dennis Emanuel',
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
      slug: '',
      status: 'Transmissão_Ativa',
      source: 'CB_Analytics_Hub',
      region: 'LATAM_BRASIL'
    });
  };

  const handleDeleteClick = async (id: string, title: string) => {
    if (window.confirm(`Excluir "${title}"?`)) {
      await deleteArticle(id);
      setArticles(articles.filter(a => a.id !== id));
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!newMember.email) throw new Error('Email é obrigatório');
      await addTeamMember(newMember.email, newMember.role as 'admin' | 'editor');
      setTeamMembers(await getTeamMembers());
      setIsAddingMember(false);
      setNewMember({ uid: '', email: '', role: 'editor' });
      alert('Membro autorizado!');
    } catch (err: any) {
      alert('Erro: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (uid: string) => {
    if (window.confirm('Remover acesso?')) {
      await removeTeamMember(uid);
      setTeamMembers(teamMembers.filter(m => m.uid !== uid));
    }
  };

  if (loading) return null;

  const tabs = [
    { id: 'settings', label: 'Configurações', icon: Settings, roles: ['admin'] },
    { id: 'appearance', label: 'Aparência', icon: Palette, roles: ['admin'] },
    { id: 'polls', label: 'Enquetes', icon: BarChart3, roles: ['admin'] },
    { id: 'articles', label: 'Artigos', icon: FileText, roles: ['admin', 'editor'] },
    { id: 'team', label: 'Equipe', icon: Globe, roles: ['admin'] },
  ];

  const allowedTabs = tabs.filter(t => t.roles.includes(role || ''));

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background p-4 md:p-10">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border text-primary">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white">
                <LayoutDashboard size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter">Painel de Controle</h1>
                <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest italic flex items-center gap-2">
                   USUÁRIO: {role} <span className="w-1 h-1 bg-accent rounded-full animate-pulse" /> CB_STUDY_HUB_v5.0
                </p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary/60 hover:text-accent transition-colors">
              <LogOut size={14} /> Sair do Sistema
            </button>
          </div>

          {/* TAB BAR - Responsive Scrollable */}
          <div className="overflow-x-auto pb-4 -mb-4 no-scrollbar">
            <div className="flex items-center gap-2 p-1 bg-secondary/5 rounded-2xl w-fit min-w-full md:min-w-0">
              {allowedTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === tab.id ? 'bg-white shadow-sm text-accent' : 'text-secondary/50 hover:text-secondary'
                  }`}
                >
                  <tab.icon size={14} /> {tab.label}
                </button>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            
            {activeTab === 'settings' && role === 'admin' && (
              <div className="glass-panel p-10 space-y-10 bg-white shadow-sm border-primary/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                       <BarChart3 size={16} className="text-secondary" /> Metadados Globais
                    </h3>
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-4">Nome do Blog</label>
                          <input type="text" value={blogName} onChange={e => setBlogName(e.target.value)} className="w-full bg-white border border-border rounded-xl p-3 outline-none focus:border-accent text-primary" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-4">URL da Logo (Opcional)</label>
                          <input type="url" placeholder="https://exemplo.com/logo.png" value={blogLogoUrl} onChange={e => setBlogLogoUrl(e.target.value)} className="w-full bg-white border border-border rounded-xl p-3 outline-none focus:border-accent text-primary" />
                          <p className="text-[8px] text-secondary opacity-50 ml-4 italic">* Se vazio, usará a logo padrão de texto.</p>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-4">Link da Newsletter (Opcional)</label>
                          <input type="url" placeholder="https://substack.com/@seu-perfil" value={blogNewsletterUrl} onChange={e => setBlogNewsletterUrl(e.target.value)} className="w-full bg-white border border-border rounded-xl p-3 outline-none focus:border-accent text-primary" />
                          <p className="text-[8px] text-secondary opacity-50 ml-4 italic">* Se vazio, o botão mostrará "Em breve".</p>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-4">Descrição</label>
                          <textarea value={blogDescription} onChange={e => setBlogDescription(e.target.value)} className="w-full bg-white border border-border rounded-xl p-3 outline-none h-32 focus:border-accent text-primary" />
                       </div>
                    </div>
                    <button onClick={handleSaveSettings} disabled={saving} className="btn-premium py-3 px-10 flex items-center gap-2">
                      <Save size={16} /> {saving ? 'Salvando...' : 'Aplicar Alterações'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && role === 'admin' && (
              <div className="glass-panel p-10 bg-white shadow-sm border-primary/5">
                <ThemeCustomizer />
              </div>
            )}

            {activeTab === 'polls' && role === 'admin' && (
              <div className="glass-panel p-10 bg-white shadow-sm border-primary/5">
                <PollManager />
              </div>
            )}

            {activeTab === 'articles' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Repositório ({articles.length})</h3>
                  <button onClick={() => setIsAddingArticle(true)} className="btn-premium px-6 py-3 flex items-center gap-2">
                    <Plus size={16} /> Novo Artigo
                  </button>
                </div>

                {isAddingArticle && (
                  <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-0 md:p-4">
                    <div className="w-full h-full md:h-auto md:max-w-4xl md:max-h-[90vh] overflow-y-auto space-y-8 p-6 md:p-10 bg-white">
                      <div className="flex items-center justify-between border-b pb-4">
                          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-primary">{editingArticleId ? 'Editar Transmissão' : 'Nova Transmissão'}</h2>
                          <button onClick={handleCancelEdit} className="p-2 hover:bg-secondary/5 rounded-full"><X size={24} className="text-primary" /></button>
                      </div>

                      <form onSubmit={handleAddArticle} className="space-y-6 text-primary">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-4">Título</label>
                              <input type="text" required value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} className="w-full bg-white border border-border rounded-xl p-3 outline-none focus:border-accent" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-4">Categoria</label>
                              <input type="text" required value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value})} className="w-full bg-white border border-border rounded-xl p-3 outline-none focus:border-accent" />
                           </div>
                        </div>
                        
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-4">Resumo</label>
                           <textarea required value={newArticle.excerpt} onChange={e => setNewArticle({...newArticle, excerpt: e.target.value})} className="w-full bg-white border border-border rounded-xl p-3 outline-none h-20 focus:border-accent" />
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-4">URL Imagem</label>
                           <input type="url" value={newArticle.imageUrl} onChange={e => setNewArticle({...newArticle, imageUrl: e.target.value})} className="w-full bg-white border border-border rounded-xl p-3 outline-none focus:border-accent" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <input type="text" placeholder="Status" value={newArticle.status} onChange={e => setNewArticle({...newArticle, status: e.target.value})} className="bg-white border border-border rounded-xl p-3 text-xs" />
                           <input type="text" placeholder="Fonte" value={newArticle.source} onChange={e => setNewArticle({...newArticle, source: e.target.value})} className="bg-white border border-border rounded-xl p-3 text-xs" />
                           <input type="text" placeholder="Região" value={newArticle.region} onChange={e => setNewArticle({...newArticle, region: e.target.value})} className="bg-white border border-border rounded-xl p-3 text-xs" />
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-4">Conteúdo</label>
                           <textarea required value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})} className="w-full bg-white border border-border rounded-xl p-3 outline-none h-40 focus:border-accent" />
                        </div>

                        <button type="submit" disabled={saving} className="btn-premium w-full py-4 text-sm tracking-widest uppercase mb-10 md:mb-0">
                          {saving ? 'Processando...' : (editingArticleId ? 'Salvar Alterações' : 'Publicar')}
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {articles.map(article => (
                    <div key={article.id} className="glass-panel p-4 md:p-6 bg-white flex flex-col md:flex-row md:items-center justify-between group border-primary/5 hover:border-accent/20 transition-all text-primary gap-4">
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="w-16 md:w-20 h-12 md:h-14 bg-secondary/5 rounded-xl overflow-hidden border shrink-0">
                           <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[10px] md:text-[11px] font-black uppercase tracking-tight truncate">{article.title}</h4>
                          <p className="text-[8px] opacity-50 uppercase mt-1">{article.category} • {article.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-all justify-end border-t md:border-none pt-2 md:pt-0">
                        <button onClick={() => handleEditClick(article)} className="flex items-center gap-1 px-3 py-1 bg-accent/5 text-accent rounded-lg text-[9px] font-black uppercase md:bg-transparent md:text-primary"><Edit2 size={14} /> <span className="md:hidden">Editar</span></button>
                        <button onClick={() => handleDeleteClick(article.id!, article.title)} className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-500 rounded-lg text-[9px] font-black uppercase md:bg-transparent"><Trash2 size={14} /> <span className="md:hidden">Excluir</span></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'team' && role === 'admin' && (
              <div className="space-y-8">
                {/* Guia de Uso para o Cliente */}
                <div className="glass-panel p-6 bg-accent/5 border-accent/20 flex gap-4 items-start">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                    <Shield className="text-accent w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">Guia de Gestão de Equipe</h4>
                    <ul className="space-y-2 text-[11px] text-secondary font-medium leading-relaxed">
                      <li className="flex gap-2">
                        <span className="text-accent">●</span>
                        <span>Para adicionar um membro, você só precisa do <strong>Email</strong> dele. Não é necessário pedir senhas ou códigos técnicos.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent">●</span>
                        <span>Diga ao novo membro para acessar o blog e clicar em <strong>"Acesso via Google"</strong> usando o mesmo email que você cadastrou.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent">●</span>
                        <span>O sistema fará o reconhecimento automático no primeiro login.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                   <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Autorizações de Equipe</h3>
                   <button onClick={() => setIsAddingMember(true)} className="btn-premium px-6 py-3 flex items-center gap-2">
                     <Plus size={16} /> Novo Acesso
                   </button>
                </div>

                {isAddingMember && (
                  <div className="glass-panel p-8 bg-white border-accent/20">
                     <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-primary">
                       <input 
                         type="email" 
                         placeholder="Email do usuário (ex: joao@gmail.com)" 
                         required 
                         value={newMember.email} 
                         onChange={e => setNewMember({...newMember, email: e.target.value})} 
                         className="w-full bg-white border border-border rounded-xl p-3 text-xs" 
                       />
                       <select value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value as any})} className="bg-white border border-border rounded-xl p-3 text-xs">
                         <option value="editor">Editor (Só Conteúdo)</option>
                         <option value="admin">Administrador (Total)</option>
                       </select>
                       <button type="submit" disabled={saving} className="btn-premium text-[10px]">Autorizar Acesso</button>
                     </form>
                     <p className="text-[9px] text-secondary opacity-50 mt-3 italic">
                        * O sistema identificará automaticamente o usuário quando ele logar com este email.
                     </p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                   <div className="glass-panel p-4 md:p-6 bg-accent/[0.02] border-accent/20 flex flex-col md:flex-row md:items-center justify-between text-primary gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white text-xs">DB</div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-tight break-all">{SUPER_ADMIN_EMAIL}</p>
                          <p className="text-[8px] font-mono text-accent uppercase">Super Admin / Proprietário</p>
                        </div>
                      </div>
                   </div>

                   {teamMembers.filter(m => m.email !== SUPER_ADMIN_EMAIL).map(member => (
                     <div key={member.uid} className="glass-panel p-4 md:p-6 bg-white flex flex-col md:flex-row md:items-center justify-between group text-primary gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center font-black shrink-0">{member.email[0].toUpperCase()}</div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase truncate">{member.email}</p>
                            <p className="text-[8px] font-mono opacity-50 uppercase truncate">{member.role} • UID: {member.uid}</p>
                          </div>
                        </div>
                        <div className="flex justify-end border-t md:border-none pt-2 md:pt-0">
                          <button onClick={() => handleRemoveMember(member.uid!)} className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-500 rounded-lg text-[9px] font-black uppercase md:bg-transparent md:opacity-0 md:group-hover:opacity-100 transition-all"><Trash2 size={14} /> <span>Remover</span></button>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminDashboard;
