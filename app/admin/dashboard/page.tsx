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
  Image as ImageIcon,
  CheckCircle2,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { getBlogSettings, updateBlogSettings, getArticles, BlogPost, addArticle, updateArticle, deleteArticle } from '@/lib/db';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [blogName, setBlogName] = useState('');
  const [blogDescription, setBlogDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [articles, setArticles] = useState<BlogPost[]>([]);

  // Article Form State
  const [isAddingArticle, setIsAddingArticle] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Estratégia',
    author: 'Dennis Emanuel',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
    slug: ''
  });
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  const handleLogout = () => signOut(auth);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [settings, fetchedArticles] = await Promise.all([
          getBlogSettings(),
          getArticles()
        ]);
        setBlogName(settings.name);
        setBlogDescription(settings.description || '');
        setArticles(fetchedArticles);
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
      await updateBlogSettings({ name: blogName, description: blogDescription });
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
      let finalImageUrl = newArticle.imageUrl;

      const slug = newArticle.title.toLowerCase().replace(/ /g, '-');
      
      if (editingArticleId) {
        await updateArticle(editingArticleId, {
          ...newArticle,
          imageUrl: finalImageUrl,
          slug
        });
        alert('Artigo atualizado com sucesso!');
      } else {
        await addArticle({ 
          ...newArticle, 
          imageUrl: finalImageUrl,
          slug, 
          date: new Date().toLocaleDateString('pt-BR') 
        });
        alert('Artigo publicado com sucesso!');
      }

      const updatedArticles = await getArticles();
      setArticles(updatedArticles);
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
      slug: article.slug
    });
    setIsAddingArticle(true);
  };

  const handleDeleteClick = async (id: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o artigo "${title}"?`)) {
      setSaving(true);
      try {
        await deleteArticle(id);
        setArticles(articles.filter(a => a.id !== id));
        alert('Artigo excluído.');
      } catch (err) {
        alert('Erro ao excluir.');
      } finally {
        setSaving(false);
      }
    }
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
      slug: ''
    });
  };



  const tabs = [
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'articles', label: 'Artigos', icon: FileText },
    { id: 'stats', label: 'Métricas', icon: BarChart3 },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-surface pt-28 pb-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Tabs */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white border border-border rounded-3xl p-6 shadow-premium">
              <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <LayoutDashboard className="text-accent w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black uppercase tracking-tighter text-primary">Admin</h2>
                  <p className="text-[10px] font-bold text-secondary uppercase opacity-40">Portal de Controle</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                      activeTab === tab.id 
                        ? 'bg-primary text-white shadow-glow' 
                        : 'text-secondary hover:bg-surface'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div className="h-[1px] bg-border my-6" />

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sair do Sistema
              </button>
            </div>

            <div className="bg-accent text-white p-6 rounded-3xl shadow-glow overflow-hidden relative group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Globe className="w-32 h-32" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">Status da Rede</p>
              <h3 className="text-2xl font-black italic underline">ONLINE</h3>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-border rounded-[2.5rem] p-8 md:p-12 shadow-premium min-h-[600px]"
            >
              {activeTab === 'settings' && (
                <div className="space-y-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-black uppercase tracking-tighter text-primary">Identidade Visual</h2>
                      <p className="text-secondary text-sm mt-2">Gerencie as informações fundamentais do blog.</p>
                    </div>
                    <button 
                      onClick={handleSaveSettings}
                      disabled={saving}
                      className="btn-premium flex items-center gap-2 py-3 px-8"
                    >
                      <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar Protocolo'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-4">Nome do Blog</label>
                       <input 
                         type="text" 
                         value={blogName || ''}
                         onChange={(e) => setBlogName(e.target.value)}
                         placeholder={loading ? 'Carregando...' : ''}
                         className="w-full bg-surface border border-border rounded-xl p-4 outline-none focus:border-accent font-bold"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-4">Descrição do Protocolo</label>
                       <input 
                         type="text" 
                         value={blogDescription || ''}
                         onChange={(e) => setBlogDescription(e.target.value)}
                         placeholder={loading ? 'Carregando...' : ''}
                         className="w-full bg-surface border border-border rounded-xl p-4 outline-none focus:border-accent font-bold"
                       />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'articles' && (
                <div className="space-y-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-black uppercase tracking-tighter text-primary">Repositório de Artigos</h2>
                      <p className="text-secondary text-sm mt-2">Crie e gerencie o fluxo de conhecimento.</p>
                    </div>
                     {!isAddingArticle && (
                       <button 
                         onClick={() => setIsAddingArticle(true)}
                         className="btn-premium flex items-center gap-2 py-3 px-8"
                       >
                         <Plus className="w-4 h-4" /> Novo Artigo
                       </button>
                     )}
                  </div>

                  {isAddingArticle ? (
                    <motion.form 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={handleAddArticle}
                      className="bg-surface border border-border rounded-3xl p-8 space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-4">Título</label>
                            <input type="text" required value={newArticle.title || ''} onChange={e => setNewArticle({...newArticle, title: e.target.value})} className="w-full bg-white border border-border rounded-xl p-3 outline-none" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-4">Categoria</label>
                            <input type="text" required value={newArticle.category || ''} onChange={e => setNewArticle({...newArticle, category: e.target.value})} className="w-full bg-white border border-border rounded-xl p-3 outline-none" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-4">Resumo (Excerpt)</label>
                         <textarea required value={newArticle.excerpt || ''} onChange={e => setNewArticle({...newArticle, excerpt: e.target.value})} className="w-full bg-white border border-border rounded-xl p-3 outline-none h-20" />
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-4 italic">URL da Imagem de Capa</label>
                         <input 
                           type="url" 
                           placeholder="https://images.unsplash.com/..." 
                           value={newArticle.imageUrl || ''}
                           onChange={e => setNewArticle({...newArticle, imageUrl: e.target.value})}
                           className="w-full bg-white border border-border rounded-xl p-3 outline-none focus:border-accent"
                         />
                      </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-4">Conteúdo (Markdown/Texto)</label>
                          <textarea required value={newArticle.content || ''} onChange={e => setNewArticle({...newArticle, content: e.target.value})} className="w-full bg-white border border-border rounded-xl p-3 outline-none h-40 focus:border-accent" />
                       </div>

                       <div className="flex items-center gap-4 pt-4 border-t border-border">
                         <button type="submit" disabled={saving} className="btn-premium py-3 px-10 flex items-center gap-2">
                           {saving ? 'Processando...' : (
                             <>
                               <CheckCircle2 className="w-4 h-4" /> {editingArticleId ? 'Atualizar Protocolo' : 'Finalizar Protocolo'}
                             </>
                           )}
                         </button>
                         <button type="button" onClick={handleCancelEdit} className="bg-border text-primary font-bold px-6 py-3 rounded-xl uppercase text-[10px] tracking-widest hover:bg-red-50 hover:text-red-500 transition-all">
                           Cancelar
                         </button>
                      </div>
                    </motion.form>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {articles.length > 0 ? articles.map((article) => (
                        <div key={article.id} className="bg-surface border border-border rounded-2xl p-6 flex items-center justify-between group hover:border-accent/40 transition-all">
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shadow-sm border border-border">
                               <img src={article.imageUrl || ''} alt="" className="w-full h-full object-cover" />
                             </div>
                             <div>
                                <h4 className="font-black uppercase tracking-tighter text-primary">{article.title}</h4>
                                <p className="text-[10px] font-bold text-secondary uppercase opacity-60">{article.category} • {article.date}</p>
                             </div>
                           </div>
                           <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                             <button 
                               type="button"
                               onClick={() => handleEditClick(article)}
                               className="p-2 hover:bg-primary hover:text-white text-secondary rounded-lg transition-all"
                               title="Editar Artigo"
                             >
                               <Edit2 className="w-4 h-4" />
                             </button>
                             <button 
                               type="button"
                               onClick={() => handleDeleteClick(article.id!, article.title)}
                               className="p-2 hover:bg-red-500 hover:text-white text-secondary rounded-lg transition-all"
                               title="Deletar Artigo"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
                        </div>
                      )) : (
                        <div className="border border-dashed border-border rounded-3xl p-20 text-center">
                          <FileText className="w-12 h-12 text-secondary/20 mx-auto mb-4" />
                          <p className="text-secondary font-medium italic">Nenhum artigo dinâmico encontrado ainda.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="text-center py-20">
                  <BarChart3 className="w-16 h-16 text-accent mx-auto mb-6 opacity-20" />
                  <h3 className="text-xl font-black text-primary uppercase">Métricas em Tempo Real</h3>
                  <p className="text-secondary mt-2 italic">Aguardando integração com o fluxo de dados...</p>
                </div>
              )}
            </motion.div>
          </main>

        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminDashboard;
