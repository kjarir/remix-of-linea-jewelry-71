import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import AboutSidebar from "../../components/about/AboutSidebar";

const Sustainability = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>
        
        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
        <PageHeader 
          title="Sustainability" 
          subtitle="Creating beautiful textiles while preserving our environment and heritage"
        />
        
        <ContentSection title="Our Environmental Commitment">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Natural Materials</h3>
              <p className="text-muted-foreground leading-relaxed">
                All our products are crafted from natural, biodegradable materials - pure Pashmina, silk, and wool. We avoid synthetic fibers and use only natural dyes derived from plants, minerals, and other organic sources.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Ethical Sourcing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our Pashmina wool is ethically sourced from Changthang region, where goats are combed during their natural shedding season. We ensure no harm comes to the animals and support sustainable herding practices.
              </p>
            </div>
          </div>

          <div className="bg-muted/10 rounded-lg p-8">
            <h3 className="text-2xl font-light text-foreground mb-6">Our Impact Goals</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-light text-primary mb-2">500+</div>
                <p className="text-sm text-muted-foreground">Artisan families supported</p>
              </div>
              <div>
                <div className="text-3xl font-light text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Natural and organic dyes used</p>
              </div>
              <div>
                <div className="text-3xl font-light text-primary mb-2">Zero</div>
                <p className="text-sm text-muted-foreground">Chemical treatments in our process</p>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Preserving Heritage">
          <div className="space-y-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe in sustainability not just for the environment, but for the preservation of traditional crafts. By supporting artisan communities, we help ensure these ancient skills are passed to future generations.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Artisan Training</h3>
                <p className="text-muted-foreground">
                  We sponsor apprenticeship programs that train young artisans in traditional techniques, ensuring the craft continues for generations.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Fair Trade Practices</h3>
                <p className="text-muted-foreground">
                  We pay fair wages directly to artisans, cutting out middlemen and ensuring the craftspeople receive proper compensation for their work.
                </p>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Certifications & Recognition">
          <div className="space-y-8">
            <p className="text-muted-foreground leading-relaxed">
              Our commitment to authenticity and sustainability is recognized through various certifications and partnerships with craft preservation organizations.
            </p>
            
            <div className="grid md:grid-cols-4 gap-8 items-center">
              <div className="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">GI Certified</span>
              </div>
              <div className="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Craft Council</span>
              </div>
              <div className="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Fair Trade</span>
              </div>
              <div className="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Handmade India</span>
              </div>
            </div>
          </div>
        </ContentSection>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Sustainability;