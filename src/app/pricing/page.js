import PageHeaders from '../components/PageHeaders';

export default function PricingPage() {
  return (
    <div>
      <PageHeaders
        h1Text="Check out pricing"
        h2Text="Our Pricing is very simple"
      ></PageHeaders>
      <div className="bg-white text-slate-700 rounded-lg max-w-xs mx-auto p-4 text-center">
        <h3 className="font-bold text-3xl">Free forever</h3>
      </div>
    </div>
  );
}
