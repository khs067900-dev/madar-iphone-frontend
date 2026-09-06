import { IoTimeOutline, IoWalletOutline } from "react-icons/io5";

const fmt = (n: number) => n.toLocaleString("en-US");

interface OrderSummaryProps {
  total: number;
  downPayment: number;
  installmentType?: "full" | "installment";
  months?: number;
}

export default function OrderSummary({ total, downPayment, installmentType, months }: OrderSummaryProps) {
  const isInstallment = installmentType === "installment" && downPayment > 0;
  const remaining = total - downPayment;
  const monthlyPayment = isInstallment && months ? Math.ceil(remaining / months) : 0;
  const payNow = isInstallment ? downPayment : total;

  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/30 backdrop-blur-md">
      <div className="p-4 sm:p-5 space-y-3">
        <Row label="مجموع السلة" value={`${fmt(total)} ر.س`} />
        <Row label="التوصيل" value="مجاني 🚀" highlight />

        {isInstallment && (
          <>
            <div className="h-px bg-white/10 my-1" />
            <Row label="الدفعة الأولى (الآن)" value={`${fmt(downPayment)} ر.س`} accent />
            <Row label="المتبقي بالتقسيط" value={`${fmt(remaining > 0 ? remaining : 0)} ر.س`} />
            {monthlyPayment > 0 && (
              <Row label={`القسط الشهري × ${months}`} value={`${fmt(monthlyPayment)} ر.س`} />
            )}
          </>
        )}
      </div>

      {/* Pay Now Banner */}
      <div className="mx-3 mb-3 rounded-xl p-4" style={{ background: "linear-gradient(135deg,#65E0CD 0%,#1B7174 100%)" }}>
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-1.5">
            <IoWalletOutline size={15} className="text-[#053132]" />
            <span className="text-[#053132] font-black text-sm">المطلوب دفعه الآن</span>
          </div>
          <div className="text-right">
            <span className="text-[#053132] text-2xl font-black">{fmt(payNow)}</span>
            <span className="text-[#053132]/60 text-xs font-medium mr-1">ر.س</span>
          </div>
        </div>
        {isInstallment && (
          <div className="flex items-center gap-1 mt-1.5">
            <IoTimeOutline size={12} className="text-[#053132]/60" />
            <p className="text-[#053132]/70 text-[11px]">
              ثم {fmt(monthlyPayment)} ر.س شهرياً لمدة {months} شهر
            </p>
          </div>
        )}
        {!isInstallment && (
          <p className="text-[#053132]/70 text-[11px] mt-1">دفعة واحدة كاملة عند الاستلام</p>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, highlight, accent }: { label: string; value: string; highlight?: boolean; accent?: boolean }) {
  return (
    <div className="flex justify-between items-center text-xs sm:text-sm">
      <span className={accent ? "text-[#65E0CD] font-bold" : "text-white/60"}>{label}</span>
      <span className={`font-bold ${accent ? "text-[#65E0CD]" : highlight ? "text-emerald-400" : "text-white"}`}>{value}</span>
    </div>
  );
}
