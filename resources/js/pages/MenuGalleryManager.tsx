import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Image, Loader2 } from 'lucide-react';

interface MenuGallery {
  menu_gallery_id: string;
  img_menu: string;
  menu_id: string;
  menu?: {
    menu_id: string;
    name: string;
  };
}

interface Menu {
  menu_id: string;
  name: string;
}

interface ApiResponse<T> {
  status: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

const API_BASE_URL = 'http://localhost:8000/api'; // Sesuaikan dengan URL backend Anda

export default function MenuGalleryManager() {
  const [galleries, setGalleries] = useState<MenuGallery[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedGallery, setSelectedGallery] = useState<MenuGallery | null>(null);
  const [formData, setFormData] = useState({
    img_menu: '',
    menu_id: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch galleries
  const fetchGalleries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu-galleries`);
      const result: ApiResponse<MenuGallery[]> = await response.json();
      if (result.status && result.data) {
        setGalleries(result.data);
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch menus
  const fetchMenus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menus`);
      const result: ApiResponse<Menu[]> = await response.json();
      if (result.status && result.data) {
        setMenus(result.data);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  useEffect(() => {
    fetchGalleries();
    fetchMenus();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormErrors({});

    try {
      const url = modalMode === 'create' 
        ? `${API_BASE_URL}/menu-galleries`
        : `${API_BASE_URL}/menu-galleries/${selectedGallery?.menu_gallery_id}`;
      
      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse<MenuGallery> = await response.json();

      if (result.status) {
        await fetchGalleries();
        handleCloseModal();
      } else if (result.errors) {
        setFormErrors(result.errors);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus gallery ini?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/menu-galleries/${id}`, {
        method: 'DELETE',
      });

      const result: ApiResponse<null> = await response.json();

      if (result.status) {
        await fetchGalleries();
      }
    } catch (error) {
      console.error('Error deleting gallery:', error);
    }
  };

  // Handle modal
  const handleOpenModal = (mode: 'create' | 'edit', gallery?: MenuGallery) => {
    setModalMode(mode);
    setSelectedGallery(gallery || null);
    setFormData({
      img_menu: gallery?.img_menu || '',
      menu_id: gallery?.menu_id || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGallery(null);
    setFormData({ img_menu: '', menu_id: '' });
    setFormErrors({});
  };

  // Filter galleries
  const filteredGalleries = galleries.filter(gallery =>
    gallery.img_menu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gallery.menu?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Menu Gallery Manager</h1>
              <p className="text-gray-600 mt-1">Kelola galeri menu dengan mudah</p>
            </div>
            <button
              onClick={() => handleOpenModal('create')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Tambah Gallery
            </button>
          </div>

          {/* Search */}
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari berdasarkan gambar atau nama menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGalleries.map((gallery) => (
            <div key={gallery.menu_gallery_id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                {gallery.img_menu ? (
                  <img src={gallery.img_menu} alt="Menu" className="w-full h-full object-cover" />
                ) : (
                  <Image className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 truncate">
                  {gallery.menu?.name || 'Menu tidak ditemukan'}
                </h3>
                <p className="text-sm text-gray-500 mb-4 truncate">{gallery.img_menu}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal('edit', gallery)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(gallery.menu_gallery_id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGalleries.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada gallery ditemukan</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Coba ubah kata kunci pencarian' : 'Mulai dengan menambahkan gallery baru'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalMode === 'create' ? 'Tambah Gallery' : 'Edit Gallery'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Gambar
                  </label>
                  <input
                    type="text"
                    value={formData.img_menu}
                    onChange={(e) => setFormData({ ...formData, img_menu: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formErrors.img_menu && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.img_menu[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Menu
                  </label>
                  <select
                    value={formData.menu_id}
                    onChange={(e) => setFormData({ ...formData, menu_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Menu</option>
                    {menus.map((menu) => (
                      <option key={menu.menu_id} value={menu.menu_id}>
                        {menu.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.menu_id && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.menu_id[0]}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {modalMode === 'create' ? 'Tambah' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}