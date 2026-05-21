import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "sonner";
import { CartProvider } from "@/contexts/cart-context";
import CartDrawer from "@/components/cart/cart-drawer";
import HomePage from "@/pages/home";
import CollectionPage from "@/pages/collection";
import ProductPage from "@/pages/product";
import CartPage from "@/pages/cart";
import CheckoutSuccessPage from "@/pages/checkout-success";
import StoryPage from "@/pages/story";
import CulturePage from "@/pages/culture";
import ContactPage from "@/pages/contact";
import FAQPage from "@/pages/faq";
import ShippingPage from "@/pages/shipping";
import SizeGuidePage from "@/pages/size-guide";
import CommunityPage from "@/pages/community";
import CareersPage from "@/pages/careers";
import TrackOrderPage from "@/pages/track-order";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDF8EF] flex items-center justify-center flex-col gap-4">
      <span className="text-6xl text-[#C89D29]/30 select-none">𓂀</span>
      <h1 className="text-2xl font-black hieroglyph-font">PAGE NOT FOUND</h1>
      <a href="/" className="text-[#C89D29] font-bold hover:underline hieroglyph-font text-sm">← RETURN HOME</a>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/collection" component={CollectionPage} />
      <Route path="/product/:id">
        {(params) => <ProductPage id={params.id} />}
      </Route>
      <Route path="/cart" component={CartPage} />
      <Route path="/checkout/success" component={CheckoutSuccessPage} />
      <Route path="/story" component={StoryPage} />
      <Route path="/culture" component={CulturePage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/shipping" component={ShippingPage} />
      <Route path="/size-guide" component={SizeGuidePage} />
      <Route path="/community" component={CommunityPage} />
      <Route path="/careers" component={CareersPage} />
      <Route path="/track-order" component={TrackOrderPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <CartProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
        <CartDrawer />
      </WouterRouter>
      <Toaster position="bottom-right" richColors closeButton />
    </CartProvider>
  );
}

export default App;
