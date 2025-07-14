import { useState } from 'react';
import { FileQuestion, Sparkles, Zap } from 'lucide-react';
import { PdfUpload } from '@/components/pdf-upload';
import { QuestionGenerator, GenerationOptions, GeneratedQuestion } from '@/components/question-generator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { extractTextFromPdf, processSentences, generateQuestions } from '@/lib/pdf-processor';
import heroImage from '@/assets/hero-bg.jpg';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);
    
    try {
      const text = await extractTextFromPdf(file);
      setExtractedText(text);
      toast({
        title: "PDF processed successfully!",
        description: `Extracted ${text.length} characters from your PDF.`,
      });
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast({
        title: "Error processing PDF",
        description: "Please try again with a different PDF file.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setExtractedText('');
    setQuestions([]);
  };

  const handleGenerateQuestions = async (options: GenerationOptions) => {
    if (!extractedText) return;
    
    setIsGenerating(true);
    
    try {
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const sentences = processSentences(extractedText);
      const generatedQuestions = generateQuestions(sentences, options);
      
      setQuestions(generatedQuestions);
      
      toast({
        title: "Questions generated successfully!",
        description: `Generated ${generatedQuestions.length} questions from your PDF.`,
      });
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Error generating questions",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 15, 23, 0.85), rgba(15, 15, 23, 0.85)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-primary/20 border border-primary/30">
                <FileQuestion className="h-8 w-8 text-primary" />
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary">
                AI-Powered
              </Badge>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              PDF Question Generator Wizard
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Transform your PDF documents into intelligent questions using advanced AI models. 
              Upload any PDF and generate questions with Template, BERT, and T5 approaches.
            </p>
            
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Template Generation</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>AI Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <FileQuestion className="h-4 w-4 text-primary" />
                <span>Smart Questions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Step 1: Upload */}
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                Upload Your PDF Document
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PdfUpload
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                onRemoveFile={handleRemoveFile}
              />
              {isProcessing && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground animate-pulse">
                    Processing PDF... This may take a moment.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2: Generate Questions */}
          {extractedText && (
            <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
                  Generate Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QuestionGenerator
                  extractedText={extractedText}
                  onGenerate={handleGenerateQuestions}
                  questions={questions}
                  isGenerating={isGenerating}
                />
              </CardContent>
            </Card>
          )}

          {/* Info Cards */}
          {!selectedFile && (
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center p-6">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileQuestion className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Template-Based</h3>
                <p className="text-sm text-muted-foreground">
                  Generate questions using predefined templates and patterns
                </p>
              </Card>
              
              <Card className="text-center p-6">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">BERT Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Use BERT model for contextual understanding and question generation
                </p>
              </Card>
              
              <Card className="text-center p-6">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">T5 Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced T5 transformer model for natural question generation
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
