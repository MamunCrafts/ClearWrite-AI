"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Languages, RefreshCw, FileText, Wand2, Copy, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

function MarkdownRenderer({ content }: { content: string }) {
  // Simple markdown parser for basic formatting
  const parseMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>') // Inline code
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>') // H3
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>') // H2
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>') // H1
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>') // Bullet points
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>') // Numbered lists
      .replace(/\n\n/g, '</p><p class="mb-3">') // Paragraphs
  }

  const htmlContent = parseMarkdown(content)

  return (
    <div
      className="prose prose-sm max-w-none text-foreground"
      dangerouslySetInnerHTML={{ __html: `<p class="mb-3">${htmlContent}</p>` }}
    />
  )
}

export default function NLPApp() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState("")
  const [activeTab, setActiveTab] = useState("translate")
  const [paraphraseStyle, setParaphraseStyle] = useState("formal")
  const { toast } = useToast()

  const processText = async (action: string) => {
    if (!inputText.trim()) {
      toast({
        title: "No text provided",
        description: "Please enter some text to process.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch("/api/process-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          action,
          style: paraphraseStyle,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to process text")
      }

      const data = await response.json()
      setOutputText(data.result)

      if (data.detectedLanguage) {
        setDetectedLanguage(data.detectedLanguage)
      }

      toast({
        title: "Processing complete",
        description: "Your text has been successfully processed.",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Processing failed",
        description: "There was an error processing your text. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = async () => {
    if (outputText) {
      await navigator.clipboard.writeText(outputText)
      toast({
        title: "Copied to clipboard",
        description: "The processed text has been copied to your clipboard.",
      })
    }
  }

  const clearAll = () => {
    setInputText("")
    setOutputText("")
    setDetectedLanguage("")
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <Image src="/clearwrite-logo.png" alt="ClearWrite AI Logo" width={40} height={40} className="h-10 w-10" />
              <h1 className="text-xl font-bold text-[#1E3A8A]">ClearWrite AI</h1>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-600 hover:text-[#1E3A8A] font-medium transition-colors">
                About
              </a>
              <a href="#contact" className="text-gray-600 hover:text-[#1E3A8A] font-medium transition-colors">
                Contact
              </a>
            </nav>

            {/* CTA Button */}
            <Button className="bg-[#10B981] hover:bg-[#059669] text-white font-medium px-6">Get Started</Button>
          </div>
        </div>

        {/* Tagline */}
        <div className="container mx-auto px-4 pb-4">
          <p className="text-[#10B981] font-medium text-lg text-center">Write with confidence.</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl flex flex-col">

      <Card className="mt-12 border-gray-200 order-2 lg:order-1">
          <CardHeader>
            <CardTitle className="text-[#1E3A8A]">AI Processing Options</CardTitle>
            <CardDescription>Choose from various NLP tasks to enhance and transform your text.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-12 bg-gray-100">
                <TabsTrigger
                  value="translate"
                  className="text-sm font-medium data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white"
                >
                  Translate
                </TabsTrigger>
                <TabsTrigger
                  value="paraphrase"
                  className="text-sm font-medium data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white"
                >
                  Paraphrase
                </TabsTrigger>
                <TabsTrigger
                  value="summarize"
                  className="text-sm font-medium data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white"
                >
                  Summarize
                </TabsTrigger>
                <TabsTrigger
                  value="grammar"
                  className="text-sm font-medium data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white"
                >
                  Grammar
                </TabsTrigger>
                <TabsTrigger
                  value="tone"
                  className="text-sm font-medium data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white"
                >
                  Tone
                </TabsTrigger>
                <TabsTrigger
                  value="keywords"
                  className="text-sm font-medium data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white"
                >
                  Keywords
                </TabsTrigger>
              </TabsList>

              <div className="mt-10">
                <TabsContent value="translate" className="mt-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-3 text-[#1E3A8A]">Language Translation</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Automatically detect language and translate to English with high accuracy
                      </p>
                    </div>
                    <Button
                      onClick={() => processText("translate")}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-8 py-3 h-12 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <Languages className="h-5 w-5" />
                      Translate Text
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="paraphrase" className="mt-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-3 text-[#1E3A8A]">Text Paraphrasing</h3>
                      <div className="flex items-center gap-4 mb-3">
                        <p className="text-gray-600 font-medium">Style:</p>
                        <Select value={paraphraseStyle} onValueChange={setParaphraseStyle}>
                          <SelectTrigger className="w-40 h-10 border-gray-300 focus:border-[#10B981] focus:ring-[#10B981]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="concise">Concise</SelectItem>
                            <SelectItem value="detailed">Detailed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        Rewrite your text while preserving meaning and adjusting style
                      </p>
                    </div>
                    <Button
                      onClick={() => processText("paraphrase")}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-8 py-3 h-12 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <RefreshCw className="h-5 w-5" />
                      Paraphrase
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="summarize" className="mt-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-3 text-[#1E3A8A]">Text Summarization</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Create a concise summary highlighting the main points and key information
                      </p>
                    </div>
                    <Button
                      onClick={() => processText("summarize")}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-8 py-3 h-12 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <FileText className="h-5 w-5" />
                      Summarize
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="grammar" className="mt-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-3 text-[#1E3A8A]">Grammar Correction</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Fix grammar, spelling errors, and improve overall text fluency
                      </p>
                    </div>
                    <Button
                      onClick={() => processText("grammar")}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-8 py-3 h-12 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <Wand2 className="h-5 w-5" />
                      Correct Grammar
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="tone" className="mt-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-3 text-[#1E3A8A]">Tone Adjustment</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Adjust tone to professional, friendly, or academic while preserving meaning
                      </p>
                    </div>
                    <Button
                      onClick={() => processText("tone")}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-8 py-3 h-12 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <RefreshCw className="h-5 w-5" />
                      Adjust Tone
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="keywords" className="mt-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-3 text-[#1E3A8A]">Keyword Extraction</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Extract key terms, important concepts, and main topics from your text
                      </p>
                    </div>
                    <Button
                      onClick={() => processText("keywords")}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-8 py-3 h-12 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <FileText className="h-5 w-5" />
                      Extract Keywords
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 order-1 lg:order-2">
          {/* Input Section */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1E3A8A]">
                <FileText className="h-5 w-5" />
                Text Input
              </CardTitle>
              <CardDescription>
                Enter or paste your text below to get started with AI-powered processing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] resize-none border-gray-200 focus:border-[#10B981] focus:ring-[#10B981]"
              />

              {detectedLanguage && (
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Detected language:{" "}
                    <Badge variant="outline" className="border-[#10B981] text-[#10B981]">
                      {detectedLanguage}
                    </Badge>
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="flex items-center gap-1 border-gray-300 text-gray-600 hover:border-[#1E3A8A] hover:text-[#1E3A8A] bg-transparent"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-[#1E3A8A]">
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Processed Output
                </span>
                {outputText && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 border-gray-300 text-gray-600 hover:border-[#10B981] hover:text-[#10B981] bg-transparent"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                )}
              </CardTitle>
              <CardDescription>Your processed text will appear here after selecting an action below.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[200px] p-4 bg-gray-50 rounded-md border border-gray-200">
                {isProcessing ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-[#10B981]" />
                    <span className="ml-2 text-gray-600">Processing...</span>
                  </div>
                ) : outputText ? (
                  <MarkdownRenderer content={outputText} />
                ) : (
                  <p className="text-gray-500 text-center">Select an action below to process your text</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      <footer className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>
            Created by {""}
            <span className="font-semibold text-[#1E3A8A]">Md. Al Mamun Mim</span>{" "}
            — {""}
            <span className="text-[#10B981]">Software Developer, Talent Pro</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
