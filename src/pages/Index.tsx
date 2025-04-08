import React from "react";
import { AudioRecorder } from "@/components/AudioRecorder";
import { DreamTimeline } from "@/components/DreamTimeline";
import { DreamyBackground } from "@/components/DreamyBackground";
import { Header } from "@/components/Header";
import { DreamProvider } from "@/contexts/DreamContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, BookOpen, Moon, CloudMoon, Star } from "lucide-react";
import { FeaturesSection } from "@/components/FeaturesSection";
import { QuoteSection } from "@/components/QuoteSection";
import { WelcomeMessage } from "@/components/WelcomeMessage";

const Index = () => {
  return (
    <DreamProvider>
      <div className="min-h-screen relative">
        <DreamyBackground />
        
        <div className="container max-w-5xl mx-auto px-4 pb-20">
          <Header />
          
          <main className="mt-8">
            <section className="mb-12">
              <div className="text-center mb-8">
                <WelcomeMessage />
                <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight text-shadow">
                  Capture Your Dreams
                </h2>
                <p className="text-center text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Record and revisit your dreams through voice. Speak clearly to capture all the details before they fade away.
                </p>
              </div>

              <Tabs defaultValue="record" className="w-full mb-12">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                  <TabsTrigger value="record" className="flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    Record
                  </TabsTrigger>
                  <TabsTrigger value="archive" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Archive
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="record" className="animate-fade-in">
                  <div className="glass rounded-xl p-6 shadow-lg border border-white/10">
                    <AudioRecorder />
                  </div>
                </TabsContent>
                
                <TabsContent value="archive">
                  <div className="glass rounded-xl p-6 shadow-lg border border-white/10 animate-fade-in">
                    <DreamTimeline />
                  </div>
                </TabsContent>
              </Tabs>
              
              <FeaturesSection />
              <QuoteSection />
            </section>
          </main>
        </div>
      </div>
    </DreamProvider>
  );
};

export default Index;
