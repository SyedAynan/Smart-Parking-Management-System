'use client';

import { useState } from 'react';
import { generateAllSourceFiles } from '@/lib/keil-source-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Copy, Check, FileCode } from 'lucide-react';

export function SourceCodeViewer() {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const files = generateAllSourceFiles();

  const handleCopy = async (content: string, fileName: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleDownload = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    files.forEach((file) => {
      handleDownload(file.content, file.name);
    });
  };

  return (
    <Card className="bg-muted/30 border-border">
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            Keil uVision Source Code
          </CardTitle>
          <Button size="sm" variant="outline" onClick={handleDownloadAll}>
            <Download className="h-3 w-3 mr-1" />
            Download All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <Tabs defaultValue={files[0].name}>
          <TabsList className="w-full grid grid-cols-4 h-8">
            {files.map((file) => (
              <TabsTrigger key={file.name} value={file.name} className="text-[10px]">
                {file.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {files.map((file) => (
            <TabsContent key={file.name} value={file.name} className="mt-2">
              <div className="flex gap-1 mb-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(file.content, file.name)}
                  className="text-xs"
                >
                  {copiedFile === file.name ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(file.content, file.name)}
                  className="text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
              <pre className="bg-black/50 rounded p-3 text-[10px] font-mono overflow-auto max-h-[400px] text-emerald-400/90">
                {file.content}
              </pre>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-3 p-2 bg-blue-500/10 rounded border border-blue-500/30">
          <div className="text-xs font-medium text-blue-400">Keil uVision Setup:</div>
          <ol className="text-[10px] text-muted-foreground mt-1 space-y-0.5 list-decimal list-inside">
            <li>Create new uVision project (LPC1768)</li>
            <li>Add all 4 source files to your project</li>
            <li>Configure simulator target</li>
            <li>Add g_system, dbg_* variables to Watch Window</li>
            <li>Build and run in debug mode</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
