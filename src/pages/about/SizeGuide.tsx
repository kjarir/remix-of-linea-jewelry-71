import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import { Button } from "../../components/ui/button";
import AboutSidebar from "../../components/about/AboutSidebar";

const SizeGuide = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>
        
        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
        <PageHeader 
          title="Size Guide" 
          subtitle="Find the perfect fit with our comprehensive sizing guide"
        />
        
        <ContentSection title="Shawl Sizes">
          <div className="space-y-8">
            <div className="bg-muted/10 rounded-lg p-8">
              <h3 className="text-xl font-light text-foreground mb-6">Understanding Shawl Dimensions</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Standard Sizes</h4>
                  <p className="text-muted-foreground">
                    Our shawls come in various sizes to suit different styling needs. The dimensions listed are approximate and may vary slightly due to the handmade nature of our products.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Choosing Your Size</h4>
                  <p className="text-muted-foreground">
                    Consider how you plan to wear your shawl - as a wrap, stole, or scarf. Larger sizes offer more draping options, while smaller stoles are perfect for light layering.
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted/20">
                    <th className="border border-border p-3 text-left font-light">Type</th>
                    <th className="border border-border p-3 text-left font-light">Width (cm)</th>
                    <th className="border border-border p-3 text-left font-light">Length (cm)</th>
                    <th className="border border-border p-3 text-left font-light">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: "Stole", width: "70", length: "200", use: "Light wrap, office wear" },
                    { type: "Medium Shawl", width: "100", length: "200", use: "Versatile daily wear" },
                    { type: "Large Shawl", width: "140", length: "200", use: "Full coverage, formal occasions" },
                    { type: "Wrap", width: "100", length: "250", use: "Statement piece, weddings" },
                    { type: "Scarf", width: "30", length: "180", use: "Neck wear, casual styling" },
                  ].map((size, index) => (
                    <tr key={index} className="hover:bg-muted/10">
                      <td className="border border-border p-3">{size.type}</td>
                      <td className="border border-border p-3">{size.width}</td>
                      <td className="border border-border p-3">{size.length}</td>
                      <td className="border border-border p-3">{size.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Kurta Sizes">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Men's Kurta Sizes</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">S (36)</span>
                  <span className="text-foreground">Chest: 36" / Length: 38"</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">M (38)</span>
                  <span className="text-foreground">Chest: 38" / Length: 40"</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">L (40)</span>
                  <span className="text-foreground">Chest: 40" / Length: 42"</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">XL (42)</span>
                  <span className="text-foreground">Chest: 42" / Length: 44"</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">XXL (44)</span>
                  <span className="text-foreground">Chest: 44" / Length: 46"</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Women's Kurta Sizes</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">XS (32)</span>
                  <span className="text-foreground">Bust: 32" / Length: 40"</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">S (34)</span>
                  <span className="text-foreground">Bust: 34" / Length: 41"</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">M (36)</span>
                  <span className="text-foreground">Bust: 36" / Length: 42"</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">L (38)</span>
                  <span className="text-foreground">Bust: 38" / Length: 43"</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">XL (40)</span>
                  <span className="text-foreground">Bust: 40" / Length: 44"</span>
                </div>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Carpet Sizes">
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Our carpets are available in standard and custom sizes. Here are our most popular dimensions:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Small</h4>
                <p className="text-muted-foreground text-sm">2' x 3' (60 x 90 cm)</p>
                <p className="text-muted-foreground text-sm">Ideal for: Bedside, entryway</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Medium</h4>
                <p className="text-muted-foreground text-sm">4' x 6' (120 x 180 cm)</p>
                <p className="text-muted-foreground text-sm">Ideal for: Living room accent</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Large</h4>
                <p className="text-muted-foreground text-sm">6' x 9' (180 x 270 cm)</p>
                <p className="text-muted-foreground text-sm">Ideal for: Dining room, large living room</p>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Need Help?">
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Still unsure about sizing? Our textile consultants are here to help you find the perfect fit. 
              We also offer custom sizing for all our products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="rounded-none">
                Download PDF Guide
              </Button>
              <Button className="rounded-none">
                Request Custom Size
              </Button>
            </div>
          </div>
        </ContentSection>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default SizeGuide;