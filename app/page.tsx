"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Languages, RefreshCw, FileText, Wand2, Copy, Trash2, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import ThemeToggle from "@/components/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"

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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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
    <div className="min-h-screen bg-gradient-to-br from-[#f5f9ff] to-white dark:from-[#0b1120] dark:to-black">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/30 ${
          scrolled ? "shadow-sm border-b border-gray-200/60 dark:border-white/10" : ""
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <Image src="/clearwrite-logov1.png" alt="ClearWrite AI Logo" width={120} height={32} priority className="h-8 w-auto" />
              <span className="text-xl font-semibold bg-gradient-to-r from-[#1E3A8A] to-[#10B981] bg-clip-text text-transparent">
                ClearWrite AI
              </span>
            </div>

            {/* Navigation + Theme */}
            <div className="flex items-center gap-2">
              <nav className="hidden md:flex items-center gap-6 pr-2">
                <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-[#1E3A8A] dark:hover:text-[#10B981] font-medium transition-colors">
                  About
                </a>
                <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-[#1E3A8A] dark:hover:text-[#10B981] font-medium transition-colors">
                  Contact
                </a>
              </nav>
              <ThemeToggle />
              <Button className="bg-[#10B981] hover:bg-[#059669] text-white font-medium px-5" asChild>
                <a href="#workbench">Get Started</a>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Animated blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
          <div className="absolute -top-16 -left-10 h-72 w-72 rounded-full bg-[#1E3A8A]/20 blur-3xl animate-blob" />
          <div className="absolute -bottom-16 -right-10 h-72 w-72 rounded-full bg-[#10B981]/20 blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/3 right-1/3 h-72 w-72 rounded-full bg-[#4f46e5]/10 dark:bg-[#10B981]/10 blur-3xl animate-blob animation-delay-4000" />
        </div>
        <div className="lg:w-[1140px] w-full mx-auto px-4 pt-12 pb-8 lg:pt-16 lg:pb-12">
          <div className="grid grid-cols-1  gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-[#1E3A8A] to-[#10B981] bg-clip-text text-transparent">
                  AI-Powered Writing Assistant
                </span>
              </h1>
              <p className="mt-4 text-lg md:text-xl text-[#10B981] font-medium">Write with confidence.</p>
              <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
                Translate, paraphrase, summarize, and refine your text with clarity and speed.
              </p>
              <div className="mt-6 flex items-center justify-center lg:justify-start gap-3">
                <Button className="bg-gradient-to-r from-[#E0F2FE] via-[#ECFEFF] to-[#DCFCE7] dark:from-[#0b1120] text-black dark:via-[#0b1328] dark:to-[#052e2b] dark:text-white px-6 py-6 h-11 shadow-md hover:shadow-lg transition-all" asChild>
                  <a href="#workbench">Start Writing</a>
                </Button>
              
              </div>
            </motion.div>

            {/* Hero preview card */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <Image src="/clearwrite-logo.png" alt="ClearWrite AI" width={40} height={40} className="rounded-full" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Quick Preview</p>
                    <p className="font-semibold">Transform your text instantly</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3">
                  <div className="h-3 rounded bg-gray-200/80 dark:bg-white/10 w-5/6" />
                  <div className="h-3 rounded bg-gray-200/80 dark:bg-white/10 w-4/6" />
                  <div className="h-3 rounded bg-gray-200/80 dark:bg-white/10 w-3/6" />
                </div>
                <div className="mt-6 flex gap-2">
                  <div className="h-8 w-24 rounded-full bg-[#1E3A8A]" />
                  <div className="h-8 w-24 rounded-full bg-[#10B981]" />
                </div>
              </div>
            </motion.div> */}
          </div>
        </div>
      </section>

      <div id="workbench" className="container border-gray-200/80 dark:border-white/20 bg-gradient-to-r from-[#e1eaf0] via-[#eef8f8] to-[#DCFCE7] dark:from-[#0b1120] dark:via-[#0b1328] dark:to-[#052e2b]  mx-auto px-4 py-8 max-w-6xl flex flex-col">

      <Card className="mb-12 border-gray-200/70 dark:border-white/10 bg-gradient-to-r from-[#E0F2FE] via-[#ECFEFF] to-[#DCFCE7] dark:from-[#0b1120] dark:via-[#0b1328] dark:to-[#052e2b] order-2 lg:order-1">
          <CardHeader>
            <CardTitle className="text-[#1E3A8A] dark:text-[#10B981]">AI Processing Options</CardTitle>
            <CardDescription>Choose from various AI-powered tasks to enhance and transform your text.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-12 bg-gray-100 dark:bg-white/10">
                <TabsTrigger
                  value="translate"
                  className="text-sm font-medium transition-all data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white hover:bg-gray-200/70 dark:hover:bg-white/10"
                >
                  Translate
                </TabsTrigger>
                <TabsTrigger
                  value="paraphrase"
                  className="text-sm font-medium transition-all data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white hover:bg-gray-200/70 dark:hover:bg-white/10"
                >
                  Paraphrase
                </TabsTrigger>
                <TabsTrigger
                  value="summarize"
                  className="text-sm font-medium transition-all data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white hover:bg-gray-200/70 dark:hover:bg-white/10"
                >
                  Summarize
                </TabsTrigger>
                <TabsTrigger
                  value="grammar"
                  className="text-sm font-medium transition-all data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white hover:bg-gray-200/70 dark:hover:bg-white/10"
                >
                  Grammar
                </TabsTrigger>
                <TabsTrigger
                  value="tone"
                  className="text-sm font-medium transition-all data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white hover:bg-gray-200/70 dark:hover:bg-white/10"
                >
                  Tone
                </TabsTrigger>
                <TabsTrigger
                  value="keywords"
                  className="text-sm font-medium transition-all data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white hover:bg-gray-200/70 dark:hover:bg-white/10"
                >
                  Keywords
                </TabsTrigger>
              </TabsList>

              <div className="mt-10">
                <TabsContent value="translate" className="mt-0">
                  <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 bg-gray-50/80 dark:bg-white/5 rounded-xl border border-gray-200/70 dark:border-white/10 shadow-sm">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-3 text-[#1E3A8A]">Language Translation</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Automatically detect language and translate to English with high accuracy
                      </p>
                    </div>
                    <Button
                      onClick={() => processText("translate")}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-8 py-3 h-12 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <Languages className="h-5 w-5" />
                      Translate Text
                    </Button>
                  </motion.div>
                </TabsContent>

                <TabsContent value="paraphrase" className="mt-0">
                  <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.05 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 bg-gray-50/80 dark:bg-white/5 rounded-xl border border-gray-200/70 dark:border-white/10 shadow-sm">
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
                      className="flex items-center gap-2 px-8 py-3 h-12 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <RefreshCw className="h-5 w-5" />
                      Paraphrase
                    </Button>
                  </motion.div>
                </TabsContent>

                <TabsContent value="summarize" className="mt-0">
                  <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.05 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 bg-gray-50/80 dark:bg-white/5 rounded-xl border border-gray-200/70 dark:border-white/10 shadow-sm">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-3 text-[#1E3A8A]">Text Summarization</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Create a concise summary highlighting the main points and key information
                      </p>
                    </div>
                    <Button
                      onClick={() => processText("summarize")}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-8 py-3 h-12 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <FileText className="h-5 w-5" />
                      Summarize
                    </Button>
                  </motion.div>
                </TabsContent>

                <TabsContent value="grammar" className="mt-0">
                  <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.05 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 bg-gray-50/80 dark:bg-white/5 rounded-xl border border-gray-200/70 dark:border-white/10 shadow-sm">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-3 text-[#1E3A8A]">Grammar Correction</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Fix grammar, spelling errors, and improve overall text fluency
                      </p>
                    </div>
                    <Button
                      onClick={() => processText("grammar")}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-8 py-3 h-12 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <Wand2 className="h-5 w-5" />
                      Correct Grammar
                    </Button>
                  </motion.div>
                </TabsContent>

                <TabsContent value="tone" className="mt-0">
                  <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.05 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 bg-gray-50/80 dark:bg-white/5 rounded-xl border border-gray-200/70 dark:border-white/10 shadow-sm">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-3 text-[#1E3A8A]">Tone Adjustment</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Adjust tone to professional, friendly, or academic while preserving meaning
                      </p>
                    </div>
                    <Button
                      onClick={() => processText("tone")}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-8 py-3 h-12 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <RefreshCw className="h-5 w-5" />
                      Adjust Tone
                    </Button>
                  </motion.div>
                </TabsContent>

                <TabsContent value="keywords" className="mt-0">
                  <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.05 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 bg-gray-50/80 dark:bg-white/5 rounded-xl border border-gray-200/70 dark:border-white/10 shadow-sm">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-3 text-[#1E3A8A]">Keyword Extraction</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Extract key terms, important concepts, and main topics from your text
                      </p>
                    </div>
                    <Button
                      onClick={() => processText("keywords")}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-8 py-3 h-12 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <FileText className="h-5 w-5" />
                      Extract Keywords
                    </Button>
                  </motion.div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Gradient Highlights Card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-12 overflow-hidden border-gray-200/70 dark:border-white/10 bg-gradient-to-r from-[#E0F2FE] via-[#ECFEFF] to-[#DCFCE7] dark:from-[#0b1120] dark:via-[#0b1328] dark:to-[#052e2b]">
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-[#1E3A8A] dark:text-[#10B981]">
                <Sparkles className="h-5 w-5" /> Highlights
              </CardTitle>
              <CardDescription className="max-w-2xl">
                Enjoy a colorful, modern workspace. Smooth animations, helpful actions, and a clean, focused editor.
              </CardDescription>
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/40 dark:bg-white/5 blur-2xl" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/70 text-[#1E3A8A] dark:bg-white/10 dark:text-[#9ae6b4]">Fast</span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/70 text-[#1E3A8A] dark:bg-white/10 dark:text-[#9ae6b4]">Accurate</span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/70 text-[#1E3A8A] dark:bg-white/10 dark:text-[#9ae6b4]">Secure</span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/70 text-[#1E3A8A] dark:bg-white/10 dark:text-[#9ae6b4]">Multi‑language</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 order-1 lg:order-2">
          {/* Input Section */}
          <Card className="border-gray-200/70 dark:border-white/10 bg-gradient-to-r from-[#E0F2FE] via-[#ECFEFF] to-[#DCFCE7] dark:from-[#0b1120] dark:via-[#0b1328] dark:to-[#052e2b]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1E3A8A] dark:text-[#10B981]">
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
                className="min-h-[200px] resize-none border-gray-200/70 dark:border-white/10 focus:border-[#10B981] focus:ring-[#10B981] bg-white/60 dark:bg-white/5"
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
                  className="flex items-center gap-1 border-gray-300 text-gray-600 hover:border-[#1E3A8A] hover:text-[#1E3A8A] bg-transparent dark:text-gray-300"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="border-gray-200/70 dark:border-white/10 bg-gradient-to-r from-[#E0F2FE] via-[#ECFEFF] to-[#DCFCE7] dark:from-[#0b1120] dark:via-[#0b1328] dark:to-[#052e2b]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-[#1E3A8A] dark:text-[#10B981]">
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Processed Output
                </span>
                {outputText && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 border-gray-300 text-gray-600 hover:border-[#10B981] hover:text-[#10B981] bg-transparent dark:text-gray-300"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                )}
              </CardTitle>
              <CardDescription>Your processed text will appear here after selecting an action below.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[200px] p-4 border-gray-200/70 dark:border-white/10 focus:border-[#10B981] focus:ring-[#10B981] bg-white/60 dark:bg-white/5 rounded-md ">
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center h-full">
                      <Loader2 className="h-6 w-6 animate-spin text-[#10B981]" />
                      <span className="ml-2 text-gray-600">Processing...</span>
                    </motion.div>
                  ) : outputText ? (
                    <motion.div key={outputText} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                      <MarkdownRenderer content={outputText} />
                    </motion.div>
                  ) : (
                    <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-gray-500 text-center">
                      Select an action below to process your text
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      <footer className="border-t mt-12 border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-300">
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
