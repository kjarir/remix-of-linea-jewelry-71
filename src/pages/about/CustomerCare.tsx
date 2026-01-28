import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import AboutSidebar from "../../components/about/AboutSidebar";

const CustomerCare = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>
        
        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
        <PageHeader 
          title="Customer Care" 
          subtitle="We're here to help you with all your textile needs"
        />
        
        <ContentSection title="Contact Information">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-light text-foreground">Phone</h3>
              <p className="text-muted-foreground">+91 (194) 250-1234</p>
              <p className="text-sm text-muted-foreground">Mon-Sat: 10AM-7PM IST</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-light text-foreground">Email</h3>
              <p className="text-muted-foreground">care@mannatshawls.com</p>
              <p className="text-sm text-muted-foreground">Response within 24 hours</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-light text-foreground">WhatsApp</h3>
              <Button variant="outline" className="rounded-none">
                Chat with Us
              </Button>
              <p className="text-sm text-muted-foreground">Available during business hours</p>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Frequently Asked Questions">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="shipping" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                What are your shipping options and timeframes?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We offer free shipping within India on orders over ₹10,000 (5-7 business days). Express shipping (2-3 business days) is available for ₹500. International shipping is available to select countries with delivery in 10-15 business days.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="returns" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                What is your return and exchange policy?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We offer a 15-day return policy for unused items in original condition with tags attached. Custom-made and personalized items are final sale. Returns within India are free with our prepaid return label.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="authenticity" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                How can I verify the authenticity of my purchase?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Every Mannat Shawl's product comes with a certificate of authenticity and a GI (Geographical Indication) tag for genuine Kashmiri products. You can verify authenticity using the unique code on our website.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="care" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                How should I care for my Pashmina shawl?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Pashmina should be dry cleaned or gently hand washed in cold water with mild detergent. Never wring or twist. Lay flat to dry away from direct sunlight. Store in breathable cotton bags with natural moth repellents.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="custom" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                Do you offer custom orders?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! We offer custom sizing, color combinations, and personalized embroidery. Custom orders typically take 4-8 weeks depending on the complexity. Contact us for a personalized quote.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="carpet" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                How do I care for my Kashmiri carpet?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Vacuum regularly with a brushless attachment. Rotate the carpet every 6 months for even wear. For stains, blot immediately with cold water. Professional cleaning is recommended every 1-2 years.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ContentSection>

        <ContentSection title="Contact Form">
          <div>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-light text-foreground">First Name</label>
                  <Input className="rounded-none" placeholder="Enter your first name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-light text-foreground">Last Name</label>
                  <Input className="rounded-none" placeholder="Enter your last name" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-light text-foreground">Email</label>
                <Input type="email" className="rounded-none" placeholder="Enter your email" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-light text-foreground">Order Number (Optional)</label>
                <Input className="rounded-none" placeholder="Enter your order number if applicable" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-light text-foreground">How can we help you?</label>
                <Textarea 
                  className="rounded-none min-h-[120px]" 
                  placeholder="Please describe your inquiry in detail"
                />
              </div>
              
              <Button type="submit" className="w-full rounded-none">
                Send Message
              </Button>
            </form>
          </div>
        </ContentSection>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default CustomerCare;