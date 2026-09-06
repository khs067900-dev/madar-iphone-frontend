import Image from "next/image";
import { Plus, Minus, X } from "lucide-react";

const fmt = (n: number) => n.toLocaleString("en-US");

interface CartItemProps {
  product: {
    _id: string;
    name: string;
    price: number;
    salePrice?: number;
    originalPrice?: number;
    images?: string[];
    image?: string;
  };
  qty: number;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const resolveImg = (src: string) =>
  src.startsWith("http") ? src : `${API}${src}`;

export default function CartItem({ product, qty, onUpdateQty, onRemove }: CartItemProps) {
  const price = product.salePrice ?? product.originalPrice ?? product.price;
  const rawImg = product.images?.[0] || product.image;
  const img = rawImg ? resolveImg(rawImg) : undefined;
  const hasDiscount = product.salePrice && product.originalPrice && product.salePrice < product.originalPrice;
  const discountPercent = hasDiscount ? Math.round((1 - product.salePrice! / product.originalPrice!) * 100) : 0;

  return (
    <div className="group bg-black/40 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/10 hover:border-white/20 hover:bg-black/50 transition-all duration-300 p-2.5 sm:p-4">
      <div className="flex gap-2.5 sm:gap-4">
        {/* Image */}
        <div className="relative w-[72px] h-[72px] sm:w-24 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden shrink-0 bg-white/10">
          {img ? (
            <Image src={img} alt={product.name} fill className="object-contain p-1.5 sm:p-2 group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl">📱</div>
          )}
          {hasDiscount && (
            <span className="absolute top-1 right-1 text-[8px] sm:text-[9px] font-black text-white bg-red-500 px-1 sm:px-1.5 py-0.5 rounded">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* Top */}
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="text-[11px] sm:text-sm font-bold text-white leading-relaxed line-clamp-2">{product.name}</h3>
            <button
              onClick={() => onRemove(product._id)}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 hover:bg-red-500/30 flex items-center justify-center transition shrink-0 group/btn"
            >
              <X size={12} className="text-white/50 group-hover/btn:text-red-400 transition sm:w-[14px] sm:h-[14px]" />
            </button>
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between mt-2 sm:mt-3">
            <div className="min-w-0">
              <span className="text-sm sm:text-lg font-black text-[#65E0CD]">{fmt(price * qty)}</span>
              <span className="text-[9px] sm:text-[10px] text-white/40 mr-0.5">ر.س</span>
              {hasDiscount && (
                <span className="text-[9px] sm:text-[10px] text-white/30 line-through mr-1.5 sm:mr-2">{fmt(product.originalPrice! * qty)}</span>
              )}
            </div>

            {/* Qty */}
            <div className="flex items-center bg-white/10 rounded-full overflow-hidden border border-white/10 shrink-0">
              <button
                onClick={() => onUpdateQty(product._id, qty - 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-white/10 transition"
              >
                <Minus size={12} className="text-white/60 sm:w-[13px] sm:h-[13px]" />
              </button>
              <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-black text-white">{qty}</span>
              <button
                onClick={() => onUpdateQty(product._id, qty + 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#65E0CD] hover:bg-[#4ecfbb] transition text-[#053132] rounded-full"
              >
                <Plus size={12} className="sm:w-[13px] sm:h-[13px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
