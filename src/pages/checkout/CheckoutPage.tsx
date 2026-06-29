import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { http } from '../../services/http-client';
import { ENDPOINTS } from '../../config/api.config';
import type { Product } from '../../hooks/usePayments';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Fetch active products
    setLoading(true);
    http
      .get(ENDPOINTS.LIST_ACTIVE_PRODUCTS)
      .then((data) => {
        setProducts((data as Product[]) || []);
        if ((data as Product[])[0]) {
          setSelectedProductId((data as Product[])[0].id);
        }
      })
      .catch((error) => {
        console.error('Failed to load products:', error);
        showError('Failed to load products');
      })
      .finally(() => setLoading(false));
  }, [showError]);

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
  };

  const handleCheckout = async () => {
    if (!selectedProductId || !user?.id) {
      showError('Please select a product');
      return;
    }

    setProcessing(true);
    try {
      await http.post(ENDPOINTS.INITIATE_PAYMENT, {
        customer: { id: user.id },
        product: { productId: selectedProductId, quantity: 1 },
      });

      success('Payment initiated successfully!');
      // In a real app, you'd redirect to a payment provider here
      // For now, just show success
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Checkout failed';
      showError(message);
    } finally {
      setProcessing(false);
    }
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex items-center gap-4 w-full">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Choose a package to enhance your CV reviews</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-12 w-full">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-gray-600 text-sm">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No products available</p>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Product Cards */}
            <div className="space-y-4">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.id)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedProductId === product.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                    </div>
                    {selectedProductId === product.id && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Pricing */}
                  {product.pricing.length > 0 && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900">
                        {product.pricing[0].amount} {product.pricing[0].currency}
                      </p>
                      {product.pricing[0].type === 'RECURRING' && product.pricing[0].billingCycle && (
                        <p className="text-xs text-gray-600">
                          Billed every {product.pricing[0].billingCycle}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Features */}
                  {product.features.length > 0 && (
                    <div className="space-y-2">
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            {selectedProduct && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 bg-white rounded-xl border border-gray-200"
              >
                <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{selectedProduct.name}</span>
                    <span className="font-semibold text-gray-900">
                      {selectedProduct.pricing[0]?.amount} {selectedProduct.pricing[0]?.currency}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mb-6">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-primary">
                    {selectedProduct.pricing[0]?.amount} {selectedProduct.pricing[0]?.currency}
                  </span>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={processing}
                >
                  {processing ? 'Processing...' : 'Complete Purchase'}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
