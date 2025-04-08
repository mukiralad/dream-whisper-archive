
import React from "react";
import { AudioRecorder } from "@/components/AudioRecorder";
import { DreamTimeline } from "@/components/DreamTimeline";
import { DreamyBackground } from "@/components/DreamyBackground";
import { Header } from "@/components/Header";
import { DreamProvider } from "@/contexts/DreamContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, BookOpen } from "lucide-react";

const Index = () => {
  return (
    <DreamProvider>
      <div className="min-h-screen relative">
        <DreamyBackground />
        
        <div className="container max-w-3xl mx-auto px-4 pb-20">
          <Header />
          
          <main className="mt-8">
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-3 tracking-tight text-shadow">
                Capture Your Dreams
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-md mx-auto">
                Record and revisit your dreams through voice. Speak clearly to capture all the details before they fade away.
              </p>

              <Tabs defaultValue="record" className="w-full">
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
                  <div className="glass rounded-xl p-6 shadow-sm">
                    <AudioRecorder />
                  </div>
                </TabsContent>
                
                <TabsContent value="archive">
                  <div className="glass rounded-xl p-6 shadow-sm animate-fade-in">
                    <DreamTimeline />
                  </div>
                </TabsContent>
              </Tabs>
            </section>
          </main>
        </div>
      </div>
    </DreamProvider>
  );
};

export default Index;
