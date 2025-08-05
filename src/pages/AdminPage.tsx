import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ImageUploader from '../components/ImageUploader';
import { useAuth } from '../hooks/useAuth';

const AdminPage: React.FC = () => {
  const { products, deleteProduct, heroImage, updateHeroImage, whatsappNumber, updateWhatsappNumber } = useProducts();
  const [currentWhatsapp, setCurrentWhatsapp] = useState(whatsappNumber);
  const { logout } = useAuth();
  const isApiKeyConfigured = !!process.env.API_KEY;

  useEffect(() => {
    setCurrentWhatsapp(whatsappNumber);
  }, [whatsappNumber]);


  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert(`There was an error deleting the product: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };
  
  const handleHeroImageChange = async (images: string[]) => {
    if (images.length > 0) {
      try {
        await updateHeroImage(images[0]);
        alert('Hero image updated successfully!');
      } catch (error) {
        console.error("Failed to update hero image:", error);
        alert(`There was an error updating the hero image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleWhatsappUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateWhatsappNumber(currentWhatsapp);
      alert('WhatsApp number updated successfully!');
    } catch (error) {
      console.error("Failed to update WhatsApp number:", error);
      alert(`There was an error updating the WhatsApp number: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-brand-background text-brand-primary p-4 sm:p-6 lg:p-8 rounded-lg space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-brand-primary">Admin Dashboard</h1>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link 
            to="/admin/product/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-semibold text-white shadow-sm bg-gray-800 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-background focus:ring-gray-800 transition-colors"
          >
            Add Product
          </Link>
          <button
            onClick={logout}
            className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-semibold text-white shadow-sm bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-background focus:ring-red-500 transition-colors"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Store Settings Section */}
      <div className="bg-brand-surface p-6 rounded-lg shadow-sm border border-brand-border">
        <h2 className="text-xl font-semibold text-brand-primary mb-6 border-b border-brand-border pb-3">Store Settings</h2>
        <div className="space-y-8">
          {/* Hero Image Setting */}
          <div>
            <h3 className="text-lg font-medium text-brand-primary mb-2">Homepage Hero Image</h3>
            <p className="text-sm text-brand-secondary mb-4">This image is displayed at the top of your homepage.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div>
                <p className="text-sm font-medium text-brand-secondary mb-2">Current Image</p>
                <img src={heroImage} alt="Current hero" className="rounded-lg max-h-48 w-full object-cover border border-brand-border" />
              </div>
              <div>
                <p className="text-sm font-medium text-brand-secondary mb-2">Upload New Image</p>
                <ImageUploader images={[]} onImagesChange={handleHeroImageChange} multiple={false} />
                <p className="text-xs text-gray-500 mt-2">Uploading a new image will replace the current one.</p>
              </div>
            </div>
          </div>

          {/* WhatsApp Number Setting */}
          <div>
            <h3 className="text-lg font-medium text-brand-primary mb-2">WhatsApp Number</h3>
            <p className="text-sm text-brand-secondary mb-4">This number is used for the 'Buy Now' button on product pages.</p>
            <form onSubmit={handleWhatsappUpdate} className="flex items-center gap-4">
              <input 
                type="tel" 
                value={currentWhatsapp} 
                onChange={(e) => setCurrentWhatsapp(e.target.value)} 
                className="block w-full max-w-xs bg-brand-surface border-brand-border text-brand-primary rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent placeholder:text-gray-400"
                placeholder="e.g. 911234567890"
              />
              <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded-md hover:bg-black">Save</button>
            </form>
          </div>
          
          {/* Gemini AI API Status */}
          <div>
            <h3 className="text-lg font-medium text-brand-primary mb-2">Gemini AI Status</h3>
            <p className="text-sm text-brand-secondary mb-4">
              Powers AI features like product description generation. Status is based on environment configuration.
            </p>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-brand-border">
              <div
                className={`flex-shrink-0 w-3 h-3 rounded-full ${isApiKeyConfigured ? 'bg-green-500' : 'bg-red-500'}`}
                aria-hidden="true"
              />
              <div>
                <p className="font-medium text-brand-primary">
                  {isApiKeyConfigured ? 'API Connected' : 'API Not Configured'}
                </p>
                {!isApiKeyConfigured && (
                  <p className="mt-1 text-xs text-red-600">The API Key is missing. AI features will not work.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Products Table Section */}
      <div>
        <h2 className="text-xl font-semibold text-brand-primary mb-4">Product Management</h2>
        <div className="overflow-x-auto rounded-lg shadow border border-brand-border">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase tracking-wider">Image</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase tracking-wider">Brand</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-brand-surface divide-y divide-brand-border">
              {products.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-md border border-brand-border"/>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-primary">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-secondary">{product.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-secondary">₹{product.offerPrice.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-4">
                      <Link to={`/admin/product/${product.id}`} className="text-brand-accent hover:text-yellow-700">Edit</Link>
                      <button onClick={() => handleDelete(product.id, product.name)} className="text-red-600 hover:text-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-10 bg-brand-surface rounded-b-lg">
              <p className="text-brand-secondary">No products found. Add one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;