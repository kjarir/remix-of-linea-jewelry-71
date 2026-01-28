import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import ImageTextBlock from "../../components/about/ImageTextBlock";
import AboutSidebar from "../../components/about/AboutSidebar";

const OurStory = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>
        
        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
          <PageHeader 
            title="Our Story" 
            subtitle="A legacy of Kashmiri craftsmanship passed through generations"
          />
          
          <ContentSection>
            <ImageTextBlock
              image="/founders.png"
              imageAlt="Kashmiri artisans"
              title="Founded on Tradition"
              content="Mannat Shawl's was born from a deep reverence for Kashmir's rich textile heritage. Our founders, descendants of master weavers, established this brand with a commitment to preserving centuries-old techniques while bringing authentic Kashmiri handicrafts to the world."
              imagePosition="left"
            />
          </ContentSection>

          <ContentSection title="Our Heritage">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-xl font-light text-foreground">Traditional Craftsmanship</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every piece in our collection is meticulously handcrafted by skilled artisans who have honed their craft over generations. From the delicate Sozni embroidery to the intricate Kani weaving, we honor traditional techniques that have made Kashmiri textiles legendary worldwide.
                </p>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-light text-foreground">Authentic Materials</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We source only the finest materials - genuine Pashmina from Changthangi goats of Ladakh, pure mulberry silk, and the softest Merino wool. Each material is carefully selected to ensure the highest quality and authenticity in every product.
                </p>
              </div>
            </div>
          </ContentSection>

          <ContentSection title="Our Values">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Authenticity</h3>
                <p className="text-muted-foreground">
                  Every piece comes with a certificate of authenticity, guaranteeing genuine Kashmiri craftsmanship.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Artisan Support</h3>
                <p className="text-muted-foreground">
                  We work directly with artisan families, ensuring fair wages and preserving traditional livelihoods.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Heritage Preservation</h3>
                <p className="text-muted-foreground">
                  We actively work to preserve and promote traditional Kashmiri weaving and embroidery techniques.
                </p>
              </div>
            </div>
          </ContentSection>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default OurStory;