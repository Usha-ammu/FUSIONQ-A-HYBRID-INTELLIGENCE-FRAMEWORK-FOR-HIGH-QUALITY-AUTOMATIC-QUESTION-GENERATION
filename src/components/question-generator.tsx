import { useState } from 'react';
import { Brain, Zap, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuestionGeneratorProps {
  extractedText: string;
  onGenerate: (options: GenerationOptions) => void;
  questions: GeneratedQuestion[];
  isGenerating: boolean;
}

export interface GenerationOptions {
  useTemplate: boolean;
  useBert: boolean;
  useT5: boolean;
}

export interface GeneratedQuestion {
  id: string;
  question: string;
  type: 'template' | 'bert' | 't5';
  sentence: string;
}

export function QuestionGenerator({ 
  extractedText, 
  onGenerate, 
  questions, 
  isGenerating 
}: QuestionGeneratorProps) {
  const [options, setOptions] = useState<GenerationOptions>({
    useTemplate: true,
    useBert: true,
    useT5: true,
  });

  const handleGenerate = () => {
    onGenerate(options);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'template':
        return <FileText className="h-4 w-4" />;
      case 'bert':
        return <Brain className="h-4 w-4" />;
      case 't5':
        return <Zap className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      template: 'secondary',
      bert: 'default',
      t5: 'outline',
    } as const;

    return (
      <Badge variant={variants[type as keyof typeof variants]} className="text-xs">
        {getTypeIcon(type)}
        <span className="ml-1">{type.toUpperCase()}</span>
      </Badge>
    );
  };

  const exportQuestions = () => {
    const content = questions.map((q, i) => 
      `${i + 1}. ${q.question}\n   Source: ${q.sentence.substring(0, 100)}...\n   Type: ${q.type.toUpperCase()}\n`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-questions.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Generation Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="template"
              checked={options.useTemplate}
              onCheckedChange={(checked) =>
                setOptions(prev => ({ ...prev, useTemplate: !!checked }))
              }
            />
            <label htmlFor="template" className="text-sm font-medium">
              Template-based Questions
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bert"
              checked={options.useBert}
              onCheckedChange={(checked) =>
                setOptions(prev => ({ ...prev, useBert: !!checked }))
              }
            />
            <label htmlFor="bert" className="text-sm font-medium">
              BERT Analysis
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="t5"
              checked={options.useT5}
              onCheckedChange={(checked) =>
                setOptions(prev => ({ ...prev, useT5: !!checked }))
              }
            />
            <label htmlFor="t5" className="text-sm font-medium">
              T5 Question Generation
            </label>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !Object.values(options).some(Boolean)}
              className="flex-1"
            >
              {isGenerating ? 'Generating...' : 'Generate Questions'}
            </Button>
            {questions.length > 0 && (
              <Button variant="outline" onClick={exportQuestions}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Questions ({questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="border-l-4 border-primary pl-4 py-2">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium text-sm">Q{index + 1}: {question.question}</h4>
                      {getTypeBadge(question.type)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      📘 From: {question.sentence.substring(0, 150)}...
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {extractedText && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Text Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-40">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {extractedText.substring(0, 1000)}...
              </p>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}