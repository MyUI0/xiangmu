
import { useState } from 'react';
import { ShoppingCart, Star, Search, Plus, Minus, Trash2, X } from 'lucide-react';

type Product = {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
};

type CartItem = Product & {
  quantity: number;
};

const products: Product[] = [
  {
    id: 1,
    name: '极简设计无线耳机',
    price: 299,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    category: '电子设备'
  },
  {
    id: 2,
    name: '复古风格机械键盘',
    price: 459,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    category: '电子设备'
  },
  {
    id: 3,
    name: '极简设计台灯',
    price: 199,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    category: '家居装饰'
  },
  {
    id: 4,
    name: '高品质休闲鞋',
    price: 359,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    category: '服饰鞋包'
  },
  {
    id: 5,
    name: '咖啡师套装',
    price: 289,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    category: '厨房用品'
  },
  {
    id: 6,
    name: '简约双肩包',
    price: 159,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    category: '服饰鞋包'
  }
];

const categories = ['全部', '电子设备', '家居装饰', '服饰鞋包', '厨房用品'];

export function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === '全部' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(0, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SHOP
          </h1>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索商品..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={() => setShowCart(true)}
            className="relative p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
          >
            <ShoppingCart className="w-6 h-6 text-slate-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-slate-600">{product.rating}</span>
                  <span className="text-xs text-slate-400 ml-auto">{product.category}</span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">¥{product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    加入购物车
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">没有找到相关商品</p>
          </div>
        )}
      </main>

      {showCart && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">购物车</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">购物车是空的</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800">{item.name}</h4>
                        <p className="text-blue-600 font-semibold">¥{item.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-600">总计</span>
                  <span className="text-2xl font-bold text-blue-600">¥{cartTotal}</span>
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                  结算
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

