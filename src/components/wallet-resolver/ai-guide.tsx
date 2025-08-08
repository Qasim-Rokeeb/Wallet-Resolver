"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HelpCircle, Loader2 } from 'lucide-react';
import { getAIGuide } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

type Task = 'add' | 'resolve';

export function AIGuide() {
  const [guide, setGuide] = useState<string | null>(null);
  const [loadingTask, setLoadingTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchGuide = async (task: Task) => {
    setLoadingTask(task);
    setError(null);
    setGuide(null);
    try {
      const result = await getAIGuide(task);
      const formattedGuide = result.guide
        .replace(/\n/g, '<br />')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      setGuide(formattedGuide);
    } catch (e) {
      setError('Failed to load guide. Please try again.');
    } finally {
      setLoadingTask(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Help">
          <HelpCircle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>AI-Powered Quick Start</DialogTitle>
          <DialogDescription>
            Get a quick guide on how to use Wallet Resolver. Select a topic below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={() => handleFetchGuide('add')}
              disabled={!!loadingTask}
              className="w-full"
            >
              {loadingTask === 'add' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              How to Register
            </Button>
            <Button
              onClick={() => handleFetchGuide('resolve')}
              disabled={!!loadingTask}
              className="w-full"
            >
              {loadingTask === 'resolve' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              How to Send
            </Button>
          </div>
          {(loadingTask || error || guide) && <Separator />}
          {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
          {guide && (
             <Alert>
              <AlertTitle>Quick Start Guide</AlertTitle>
              <AlertDescription>
                <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: guide }} />
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
