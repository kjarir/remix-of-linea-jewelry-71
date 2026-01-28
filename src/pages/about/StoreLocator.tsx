import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import StoreMap from "../../components/about/StoreMap";
import { Button } from "../../components/ui/button";
import AboutSidebar from "../../components/about/AboutSidebar";

const StoreLocator = () => {
  const stores = [
    {
      name: "Mannat Shawl's - Lal Chowk",
      address: "Residency Road, Lal Chowk, Srinagar, Kashmir 190001",
      phone: "+91 (194) 250-1234",
      hours: "Mon-Sat: 10AM-8PM, Sun: 11AM-6PM",
      services: ["Personal Shopping", "Custom Orders", "Authenticity Verification", "Gift Wrapping"]
    },
    {
      name: "Mannat Shawl's - Delhi",
      address: "Khan Market, New Delhi 110003",
      phone: "+91 (11) 4567-8901",
      hours: "Mon-Sat: 11AM-8PM, Sun: 12PM-6PM",
      services: ["Personal Shopping", "Custom Orders", "Exhibition Space", "Carpet Gallery"]
    },
    {
      name: "Mannat Shawl's - Mumbai",
      address: "Linking Road, Bandra West, Mumbai 400050",
      phone: "+91 (22) 2645-7890",
      hours: "Mon-Sat: 11AM-9PM, Sun: 12PM-7PM",
      services: ["Personal Shopping", "Custom Orders", "Bridal Collection"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>
        
        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
        <PageHeader 
          title="Store Locator" 
          subtitle="Visit us in person to experience authentic Kashmiri craftsmanship"
        />
        
        <ContentSection title="Interactive Store Map">
          <StoreMap />
        </ContentSection>

        <ContentSection title="Our Locations">
          <div className="grid gap-8">
            {stores.map((store, index) => (
              <div key={index} className="bg-background rounded-lg p-8 border border-border">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-light text-foreground">{store.name}</h3>
                    <div className="space-y-2 text-muted-foreground">
                      <p>{store.address}</p>
                      <p>{store.phone}</p>
                      <p>{store.hours}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button variant="outline" className="rounded-none">
                        Get Directions
                      </Button>
                      <Button className="rounded-none">
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-light text-foreground">Available Services</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {store.services.map((service, serviceIndex) => (
                        <li key={serviceIndex} className="text-sm text-muted-foreground flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ContentSection>

        <ContentSection title="Private Appointments">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Experience personalized service with a private appointment. Our textile experts will guide you through our collections, help with custom orders, and provide insights into the art of Kashmiri craftsmanship.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="space-y-3">
                <h4 className="text-lg font-light text-foreground">Personal Shopping</h4>
                <p className="text-muted-foreground text-sm">
                  One-on-one guidance to find the perfect piece for any occasion
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-light text-foreground">Custom Orders</h4>
                <p className="text-muted-foreground text-sm">
                  Work with our artisans to create a unique piece just for you
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-light text-foreground">Bridal Consultations</h4>
                <p className="text-muted-foreground text-sm">
                  Special appointments for wedding trousseaus and bridal collections
                </p>
              </div>
            </div>
            
            <div className="pt-8">
              <Button size="lg" className="rounded-none">
                Schedule Your Appointment
              </Button>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Virtual Consultations">
          <div className="bg-muted/10 rounded-lg p-8">
            <h3 className="text-xl font-light text-foreground mb-4">Can't visit in person?</h3>
            <p className="text-muted-foreground mb-6">
              Book a virtual consultation with one of our textile experts. We'll showcase pieces via video call, 
              answer your questions, and help you make the perfect selection from the comfort of your home.
            </p>
            <Button variant="outline" className="rounded-none">
              Book Virtual Consultation
            </Button>
          </div>
        </ContentSection>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default StoreLocator;